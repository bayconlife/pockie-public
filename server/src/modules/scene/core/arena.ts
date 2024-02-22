import { CustomSocket, Stats } from '../../../interfaces';
import { fight } from '../../fight/combat';
import { Bosses, Fighters, Pots } from '../../../resources/arena';
import { SocketFunction } from '../../../types';
import { expNeededForRank, gainRankScore, rankUp } from '../../character/rank';
import { emitMedals } from '../../character/character';
import { GameModule, User } from '../../../components/classes';
import { error } from '../../kernel/errors';
import {
  addToLeaderboard,
  getArenaLeaderboardNameForSocket,
  getLeaderboardRangeByRank,
  getLeaderboardRank,
  getLeaderboardWithScore,
} from '../../kernel/leaderboards';
import { randomInt } from '../../../components/random';
import { getAvatar } from '../../account/avatars';
import { selectRandomItemWeighted } from '../../items/use';
import { createItem, emitItems } from '../../items/itemSystem';
import { addItem } from '../../items/inventory';
import { prompt } from '../../kernel/notices';
import { switchScene } from './scenes';
import { getCharacter, getUnlockedCharacter, updateUserWithoutSocket } from '../../../infrastructure/cache';
import { CARDS } from '../../../resources/cards';
import { cardsCreate, emitCards } from './cards';
import { emitFight } from '../../../modules/fight/fightSystem';
import { emitLevelStats, emitStats } from '../../../modules/character/stats';
import { updatePossibleCharacter } from '../../../modules/kernel/cache';
import { onLogin, onRequestLoginData } from '../../../modules/kernel/pubSub';

const MODULE_NAME = 'Arena';

onLogin(MODULE_NAME, (socket, character) => {
  if (character.arena === undefined) {
    character.arena = {
      rank: -1,
      score: 93500,
      medals: 0,
      fighters: [],
      tickets: 20,
      history: [],
      bossFight: false,
      cards: [],
      nextTicketReset: 0,
    };
  }

  character.arena.tickets = 100;
});

onRequestLoginData(MODULE_NAME, (character) => ({
  arena: character.arena,
}));

function getArenaId(socket: CustomSocket, character: User) {
  return socket.getAccountId() + '-' + character.displayName;
}

function convertFighterIdToAccountId(id: string) {
  id = '' + id;
  return Number(id.includes('-') ? id.substring(0, id.indexOf('-')) : id);
}

function calculateScoreModifier(p1: number, p2: number) {
  const k = 20;
  p1 = p1 / 100;
  p2 = p2 / 100;
  const prob1 = 1 / (1 + Math.pow(10, (p2 - p1) / 400));
  const prob2 = 1 / (1 + Math.pow(10, (p1 - p2) / 400));

  const p1Win = p1 + k * (1 - prob1);
  const p2Loss = p2 + k * (0 - prob2);

  const p1Loss = p1 + k * (0 - prob1);
  const p2Win = p2 + k * (1 - prob2);

  return [
    [Number((p1Win - p1).toFixed(2)), Number((p1Loss - p1).toFixed(2))],
    [Number((p2Win - p2).toFixed(2)), Number((p2Loss - p2).toFixed(2))],
  ];
}

const dummyFight: SocketFunction = async (socket, character, data, cb) => {
  let results = null;

  // for (let i = 0; i < 1; i++) {
  results = fight(
    [{ ...character.stats, hp: character.stats.maxHp, chakra: character.stats.maxChakra }],
    [
      {
        ...character.stats,
        id: 'test',
        displayName: 'Training Dummy',
        avatar: character.stats.avatar,
        level: 1,
        str: 1,
        agi: 1,
        sta: 1,
        criticalDamage: 200,
        priorityMultipler: 0,
        rebound: 0, // Reflect % damage
        decDamage: 0, // % Damage reduction
        parry: 0,
        canKickBomb: true,
        SkillAdd0: 0,
        SkillAdd1: 0,
        SkillAdd2: 0,
        SkillAdd3: 0,
        SkillAdd4: 0,
        SkillAdd5: 0,
        SkillAdd6: 0,
        SkillAdd7: 0,
        SkillAdd8: 0,
        SkillAdd9: 0,
        resistance: {
          duration: {
            poison: 0,
          },
        },
        petSkills: [],
        ...data.stats,
        maxHp: data.stats.hp,
        maxChakra: data.stats.chakra,
        skills: [10000, 7777, ...data.skills.filter((skill: any) => skill !== null)],
      },
    ],
    character,
    socket,
    {
      ignoreFightTimer: true,
    }
  );

  //   let playFight = false;
  //   // @ts-ignore
  //   for (let r = 0; r < results.fight.length; r++) {
  //     // @ts-ignore
  //     const action = results.fight[r];

  //     if (action.targetSkillId === 40006 && (action.targetLastDamage === undefined || action.targetLastDamage === 0)) {
  //       playFight = true;
  //       break;
  //     }
  //   }

  //   if (playFight) {
  //     break;
  //   }
  // }
  emitFight(socket, results, () => {});
};

const getArenaInfo: SocketFunction<number> = async (socket, character, index, cb) => {
  if (index < 0 || index > character.arena.fighters.length) {
    return error(socket, 'error__invalid_index');
  }

  const fighterId = character.arena.fighters[index].id;

  if (fighterId in Fighters) {
    return cb({ score: Fighters[fighterId].score, mod: calculateScoreModifier(character.arena.score, Fighters[fighterId].score) });
  }

  try {
    const opponent = await getUnlockedCharacter(socket.getServerId(), Number(convertFighterIdToAccountId(fighterId)));

    return cb({ score: opponent.arena.score, mod: calculateScoreModifier(character.arena.score, opponent.arena.score) });
  } catch (e) {
    return error(socket, 'error__invalid_opponent');
  }
};

const loadArena: SocketFunction = async (socket, character, _, cb) => {
  const score = await getLeaderboardWithScore(getArenaLeaderboardNameForSocket(socket), getArenaId(socket, character));

  if (score !== null) {
    character.arena.score = score;
  } else {
    character.arena = {
      rank: 1,
      score: 93500,
      medals: 0,
      fighters: [],
      tickets: 20,
      history: [],
      bossFight: false,
      cards: [],
      nextTicketReset: 0,
    };
  }

  if (Date.now() > (character.arena.nextTicketReset ?? 0)) {
    const nextReset = new Date(Date.now());

    nextReset.setHours(0, 0, 0, 0);
    nextReset.setDate(nextReset.getDate() + 1);

    character.arena.nextTicketReset = nextReset.getTime();
    character.arena.tickets = 50;
  }

  if (character.arena.fighters.length !== 0) {
    cb(character.arena);
    emitLevelStats(socket, character);

    return;
  }

  // The only time we get here is when the user goes to the arena the first time
  // When that happens we want to only add bots
  character.arena.fighters = generateOnlyBots(character);

  cb(character.arena);
  emitLevelStats(socket, character);
};

const openArenaCards: SocketFunction = async (socket, character, data, cb) => {
  const cards = CARDS.arena[character.arena.rank][data.row];

  // TODO this doesn't check that the user beat all of the units;

  if (cards === undefined) {
    return error(socket, 'error__invalid_card_set');
  }

  if (data.row === undefined) {
    return error(socket, 'error__invalid_card_row');
  }

  cardsCreate(socket, character, cards, 150168, 5);

  if (!character.arena.cards.includes(data.row)) {
    character.arena.cards.push(data.row);
  }

  emitCards(socket, character, () => {
    socket.emit('updateArena', { cards: character.arena.cards });
  });
};

function recordHistory(user: User, opponent: string, score = 0, medals = 0) {
  if (user.arena.history.length >= 30) {
    user.arena.history.shift();
  }

  user.arena.history.push([opponent, score, medals]);
}

const getPots: SocketFunction = async (socket, character, data, cb) => {
  cb(Pots);
};

const openPots: SocketFunction = async (socket, character, data, cb) => {
  const price = Pots[data.id].medals * 1;

  // if (data.amount < 0) {
  //   return error(socket, 'error__invalid_amount');
  // }

  if (character.arena.medals < price) {
    return error(socket, 'error__invalid_medal_amount');
  }

  const idx = selectRandomItemWeighted(Pots[data.id].items, 1)[0];
  const outfit = createItem(socket, Pots[data.id].items[idx][0]);

  if (addItem(character, outfit) === null) {
    return socket.emit('error', 'Inventory full.');
  }

  character.arena.medals -= price;

  cb(outfit);

  return [emitItems, emitMedals];
};

const refreshFighters: SocketFunction = async (socket, character, data, cb) => {
  if (character.arena.tickets <= 0) {
    return error(socket, 'error__no_tickets');
  }
  // TODO check if user has any unopened cards and prompt them

  const rank = await getLeaderboardRank(getArenaLeaderboardNameForSocket(socket), getArenaId(socket, character));

  // TODO change this to a config option
  if (rank === null) {
    // The user has refreshed before beating any bots or hasn't ranked high enough to fight players.
    character.arena.fighters = generateOnlyBots(character);
  } else {
    character.arena.fighters = await generateArenaFighers(socket, character, rank);
  }

  character.arena.cards = [];
  socket.emit('updateArena', { cards: character.arena.cards });

  character.arena.tickets--;

  cb({ tickets: character.arena.tickets, fighters: character.arena.fighters });
};

const getArenaLeaderboard: SocketFunction = async (socket, character, data, cb) => {
  const leaderboardName = getArenaLeaderboardNameForSocket(socket);
  const leaderboard = await getLeaderboardRangeByRank(leaderboardName, 0, 7);
  let userPlacement = await getLeaderboardRank(leaderboardName, getArenaId(socket, character));
  const leaderboardRanks: string[][] = [];

  for (let i = 0; i < leaderboard.length; i++) {
    const ranking = await getLeaderboardWithScore(leaderboardName, leaderboard[i]);
    leaderboardRanks.push([leaderboard[i], ranking!.toString()]);
  }

  if (userPlacement !== null) {
    userPlacement += 1;
  }

  cb({ userRank: userPlacement, leaderboard: leaderboardRanks });
};

async function generateArenaFighers(socket: CustomSocket, user: User, rank: number) {
  const leaderboardName = getArenaLeaderboardNameForSocket(socket);
  const ids: string[] = [];

  let min = Math.max(rank - 30, 0);
  let max = Math.max(12, min + 12);

  for (let rows = 0; rows < 3; rows++) {
    let fighterIds = await getLeaderboardRangeByRank(leaderboardName, min, max);

    for (let i = 0; i < 6; i++) {
      let fighterId = fighterIds.splice(randomInt(0, fighterIds.length - 1), 1)[0];

      while (fighterId === getArenaId(socket, user)) {
        fighterId = fighterIds.splice(randomInt(0, fighterIds.length - 1), 1)[0];
      }

      ids.push(fighterId);
    }

    min = max + 1;
    max = min + 12;
  }

  if (ids.length < 18) {
    return user.arena.fighters;
  }

  let newFighters = [];

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];

    if (!(id in Fighters)) {
      // If the fighter is not a bot
      try {
        const opponentUserData = await getUnlockedCharacter(socket.getServerId(), convertFighterIdToAccountId(id));

        newFighters.push({
          id: id,
          level: opponentUserData.level,
          avatar: getAvatar(opponentUserData),
          name: opponentUserData.displayName,
          win: false,
        });
      } catch (e) {
        console.error('Invlaid user data in generateArenaFighters for id', id);
        return user.arena.fighters;
      }
    } else {
      const fighter = Fighters[id];
      newFighters.push({ id: fighter.id, level: fighter.level, avatar: fighter.avatar, name: `bot__${fighter.id}`, win: false });
    }
  }

  return newFighters;
}

export function generateOnlyBots(user: User) {
  return Object.values(Fighters)
    .filter((e) => e.score <= expNeededForRank(user.arena.rank + 2))
    .sort((a, b) => a.score - b.score)
    .splice(0, 18)
    .reverse()
    .map((fighter) => ({ id: fighter.id, level: fighter.level, avatar: fighter.avatar, name: `bot__${fighter.id}`, win: false }));
}

async function getEnemyData(socket: CustomSocket, id: number): Promise<[Stats | undefined, number]> {
  const opponent = Fighters[id];

  if (opponent) {
    return [opponent, opponent.score];
  } else {
    try {
      const userFighter = await getUnlockedCharacter(socket.getServerId(), id);

      return [userFighter.stats, userFighter.arena.score];
    } catch (e) {
      console.error('Invalid user in fighter data', id);
      return [undefined, 0];
    }
  }
}

const arenaFight: SocketFunction<{ idx: number }> = async (socket, character, { idx }, cb) => {
  if (character.stats === undefined) {
    // TODO: this needs to throw error that is intercepted and then fixed in inventory?
    return;
  }

  if (character.arena.bossFight) {
    return error(socket, 'Need To fight boss!');
  }

  if (character.arena.tickets <= 0) {
    return error(socket, 'error__no_tickets');
  }

  const fighter = character.arena.fighters[idx];

  if (!fighter) {
    return error(socket, 'Invalid fighter position selected.');
  }

  if (fighter.win) {
    return error(socket, 'Cannot fight someone you have already beaten.');
  }

  const [enemyData, enemyScore] = await getEnemyData(socket, convertFighterIdToAccountId(fighter.id));

  if (enemyData === undefined) {
    return error(socket, 'Invalid fighter data.');
  }

  const leaderboardName = getArenaLeaderboardNameForSocket(socket);
  const result = fight(
    [{ ...character.stats, hp: character.stats.maxHp, chakra: character.stats.maxChakra }],
    [{ ...enemyData, hp: enemyData.maxHp, chakra: enemyData.maxChakra }],
    character,
    socket
  );

  if (typeof result === 'string') {
    return error(socket, result);
  }

  const isOpponentABot = fighter.id in Fighters;
  let score = 0;
  const k = 20;
  const p1 = character.arena.score / 100;
  const p2 = enemyScore / 100;
  const prob1 = 1 / (1 + Math.pow(10, (p2 - p1) / 400));
  const prob2 = 1 / (1 + Math.pow(10, (p1 - p2) / 400));

  character.arena.tickets--;
  character.arena.medals += 10;

  if (result.victory) {
    const r1 = Math.floor((p1 + k * (1 - prob1)) * 100);
    const r2 = Math.floor((p2 + k * (0 - prob2)) * 100);

    score = Math.floor(r1 - character.arena.score);
    gainRankScore(character, score);

    character.arena.fighters[idx].win = true;

    recordHistory(character, fighter.name, score, 10);

    emitMedals(socket, character);

    await addToLeaderboard(leaderboardName, character.arena.score, getArenaId(socket, character));

    if (!isOpponentABot) {
      await addToLeaderboard(leaderboardName, r2, '' + fighter.id);
      await updatePossibleCharacter(convertFighterIdToAccountId(fighter.id), socket.getServerId(), (opp) => {
        recordHistory(opp, character.displayName, r2 - enemyScore, 0);
        opp.arena.score = r2;
      });
    }

    const userRank = await getLeaderboardRank(leaderboardName, getArenaId(socket, character));

    emitFight(
      socket,
      {
        ...result,
        scoreGained: score,
        fighterIndex: idx,
        callback: character.arena.bossFight ? 'arenaBossFight' : undefined,
        bossFight: character.arena.bossFight,
        rewards: {
          rank: userRank,
          medals: 10,
        },
      },
      () => {
        socket.emit('updateStats', {
          score: character.arena.score,
        });
        socket.emit('updateArena', {
          userRank,
          tickets: character.arena.tickets,
          fighters: character.arena.fighters,
        });
        socket.emit('updateArenaHistory', character.arena.history);
      }
    );
  } else {
    const r1 = Math.floor((p1 + k * (0 - prob1)) * 100);
    const r2 = Math.floor((p2 + k * (1 - prob2)) * 100);

    score = r1 - character.arena.score;

    gainRankScore(character, score);
    recordHistory(character, fighter.name, score, -10);

    await addToLeaderboard(leaderboardName, character.arena.score, getArenaId(socket, character));

    if (!isOpponentABot) {
      await addToLeaderboard(leaderboardName, r2, '' + fighter.id);
      await updatePossibleCharacter(convertFighterIdToAccountId(fighter.id), socket.getServerId(), (opp) => {
        recordHistory(opp, character.displayName, r2 - enemyScore, 0);
        opp.arena.score = r2;
      });
    }

    const userRank = await getLeaderboardRank(leaderboardName, getArenaId(socket, character));

    emitFight(socket, result, () => {
      socket.emit('updateStats', {
        score: character.arena.score,
      });
      socket.emit('updateArena', { userRank, tickets: character.arena.tickets });
      socket.emit('updateArenaHistory', character.arena.history);
    });
  }
};

const arenaBossFight: SocketFunction = async (socket, character, data, cb) => {
  if (!character.arena.bossFight) {
    return error(socket, 'Not able to fight boss currently');
  }

  prompt(socket, 'Challenge arena level boss to promote to next rank?', async (accepted: boolean) => {
    const user = await socket.getCharacter();

    if (accepted) {
      const leaderboardName = getArenaLeaderboardNameForSocket(socket);
      const boss = Bosses[user.arena.rank];

      const result = fight([user.stats], [boss], character, socket);

      if (typeof result === 'string') {
        return error(socket, result);
      }

      if (result.victory) {
        user.arena.bossFight = false;
        rankUp(user);
        user.arena.medals += 10;

        emitMedals(socket, character);
        recordHistory(user, `arena_boss__${boss.id}`, 0, 10);

        socket.save(user);

        await addToLeaderboard(leaderboardName, user.arena.score, getArenaId(socket, character));

        const userRank = await getLeaderboardRank(leaderboardName, getArenaId(socket, character));

        emitFight(
          socket,
          {
            ...result,
            scoreGained: 1,
            bossFight: false,
            rewards: {
              rank: userRank,
              medals: 10,
            },
          },
          () => {
            socket.emit('updateStats', {
              rank: user.arena.rank,
              score: user.arena.score,
            });
            socket.emit('updateArena', { userRank, bossFight: false });
            socket.emit('updateArenaHistory', user.arena.history);
          }
        );
      } else {
        user.arena.bossFight = false;

        gainRankScore(user, -100);
        recordHistory(user, `arena_boss__${boss.id}`, -100, -10);

        socket.save(user);

        await addToLeaderboard(leaderboardName, user.arena.score, getArenaId(socket, character));

        const userRank = await getLeaderboardRank(leaderboardName, getArenaId(socket, character));

        emitFight(socket, result, () => {
          socket.emit('updateStats', { score: user.arena.score });
          socket.emit('updateArena', { userRank, bossFight: false });
          socket.emit('updateArenaHistory', user.arena.history);
        });
      }
    } else {
      socket.emit('requestSwitchScene', user.village);
    }

    user.unlock?.();
  });
};

export default class ArenaModule extends GameModule {
  moduleName = MODULE_NAME;
  modules = {
    arena: loadArena,
    arenaBossFight: arenaBossFight,
    arenaFight: arenaFight,
    arenaInfo: getArenaInfo,
    arenaRefresh: refreshFighters,
    dummyFight,
    getPots: getPots,
    openPot: openPots,
    openArenaCards: openArenaCards,
    updateLeaderboard: getArenaLeaderboard,
  };
}
