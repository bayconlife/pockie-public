import { monsters } from '../../../resources/monsters';
import { CustomSocket } from '../../../interfaces';
import { Callback, EmitterFunction, SocketFunction } from '../../../types';
import { emitStones } from '../../character/character';
import { error } from '../../kernel/errors';
import { notice, prompt } from '../../kernel/notices';
import { fight } from '../../fight/combat';
import { dropItems } from '../../drop/drops';
import { addItem } from '../../items/inventory';
import { emitLevelUp, gainExp } from '../../character/level';
import { emitLevelStats } from '../../character/stats';
import { QuestType } from '../../../resources/quests';
import { randomInt } from '../../../components/random';
import { emitQuests } from '../../quests/quests';
import { switchScene } from './scenes';
import { emitItems } from '../../items/itemSystem';
import pubSubSystem, { onRequestLoginData } from '../../kernel/pubSub';
import { emitHunt } from '../expedition/hunt';
import { updateCharacter } from '../../../modules/kernel/cache';
import { GameModule, User } from '../../../components/classes';
import { emitFight } from '../../../modules/fight/fightSystem';
import pubSub from '../../kernel/pubSub';
import { flatMap } from 'lodash';

const MODULE_NAME = 'Fields';

onRequestLoginData(MODULE_NAME, (character) => ({
  multiFight: character.multiFight,
}));

const fieldFight: SocketFunction<{ id: number }> = async (socket, character, { id }, cb) => {
  const monster = socket.getConfig().Monsters.Monsters[id];

  if (monster === undefined) {
    return error(socket, 'error__invalid_monster');
  }

  if (character.fight.timeForNextFight > Date.now()) {
    return error(socket, 'error__fighting_too_fast timeLeft: ' + ((Date.now() - character.fight.timeForNextFight) / 1000).toFixed(2));
  }

  const fightResult = fight([character.stats], [monster], character, socket);

  if (typeof fightResult === 'string') {
    return error(socket, fightResult);
  }

  // const pData = fightResult.players.find((player) => player.id === character.stats.id);

  // if (pData) {
  //   console.log(pData);
  //   character.stats.hp = pData.hp;
  //   character.stats.chakra = pData.chakra;
  // }

  // pubSub.emit('fightFinished', socket, character);

  if (!fightResult.victory) {
    return emitFight(socket, fightResult, () => {
      socket.emit('requestSwitchScene', character.village);
    });
  }

  const scene = character.scenes.current;
  const items = dropItems(socket, monster.dropTable, (character.stats.dropPercent ?? 0) + 50); // Math.pow(1.5, monster.level % 11));
  const itemList: (number | string)[] = [];
  const stonesGained = randomInt(monster.stones[0], monster.stones[1]);
  const { didLevelUp, skillsGained } = gainExp(socket, character, monster.exp);

  let updateQuests = false;

  character.stones += stonesGained;

  const emits: EmitterFunction[] = [];

  pubSub.emit('wonFight', character, monster.id, socket, scene).forEach((resp) => {
    emits.push(...resp[0]);

    if (resp.length > 1) {
      itemList.push(...resp[1]);
    }
  });

  items.forEach((item) => {
    if (addItem(character, item) !== null) {
      itemList.push(item.iid);
    } else {
      itemList.push('Inventory Full!');
    }
  });

  character.quests.inProgress.forEach((quest) => {
    if (quest.steps[quest.step].type === QuestType.Kill && quest.steps[quest.step].monster === id) {
      quest.steps[quest.step].current = Math.min(quest.steps[quest.step].current + 1, quest.steps[quest.step].amount);

      if (quest.steps[quest.step].current >= quest.steps[quest.step].amount) {
        if (quest.step === quest.steps.length - 1) {
          quest.completed = true;
        } else {
          quest.step += 1;
        }
      }

      updateQuests = true;
    }

    if (quest.steps[quest.step].type === QuestType.Collect && quest.steps[quest.step].monster === id) {
      if (randomInt(0, 99) < quest.steps[quest.step].rate) {
        quest.steps[quest.step].current = Math.min(quest.steps[quest.step].current + 1, quest.steps[quest.step].amount);

        if (quest.steps[quest.step].current >= quest.steps[quest.step].amount) {
          if (quest.step === quest.steps.length - 1) {
            quest.completed = true;
          } else {
            quest.step += 1;
          }
        }

        itemList.push(quest.steps[quest.step].item);

        updateQuests = true;
      }
    }
  });

  emitFight(
    socket,
    {
      ...fightResult,
      scene: character.scenes.current,
      rewards: {
        exp: monster.exp,
        stones: stonesGained,
        items: itemList,
      },
    },
    (c, didLevelUp, skillsGained, updateQuests) => {
      emitLevelStats(socket, c);
      emitStones(socket, c);
      // emitHunt(socket);

      if (items.length > 0) {
        emitItems(socket, c);
      }

      if (didLevelUp) {
        emitLevelUp(socket, c, skillsGained);
      }

      if (updateQuests) {
        emitQuests(socket, c);
      }

      emits.forEach((emit: any) => emit(socket, c));
    },
    didLevelUp,
    skillsGained,
    updateQuests
  );
};

const fieldFightMulti: SocketFunction<{ id: number; amount: number }> = async (socket, character, { id, amount }, cb) => {
  if (!(id in socket.getConfig().Monsters.Monsters)) {
    return error(socket, 'Invalid monster');
  }

  if (amount > 30) {
    return error(socket, 'Invalid amount');
  }

  if (character.multiFight.start !== 0) {
    emitMultiFight(socket, character);
    return error(socket, 'Already in multi fight');
  }

  const start = Date.now();

  character.multiFight = {
    start,
    end: start + amount * 180 * 1000,
    amount,
    monsterId: id,
    scene: character.scenes.current,
  };

  return [emitMultiFight];
};

const fieldFightMultiClaim: SocketFunction = async (socket, character, _, cb) => {
  if (character.multiFight.start === 0) {
    return error(socket, 'Multi Fight not started yet.');
  }

  if (character.multiFight.end > Date.now()) {
    return prompt(socket, 'Fights are not finished yet, claim early?', async (accepted: boolean) => {
      if (!accepted) {
        return;
      }

      const amount = Math.min(Math.floor((Date.now() - character.multiFight.start) / (180 * 1000)), 30);
      const c = await updateCharacter(socket, (c) => {
        const results = multiFight(socket, c, amount);

        notice(
          socket,
          `You killed ${results.killed} monsters. Gained ${results.exp} exp, ${results.stones} stone and these items: ${results.items.join(
            ', '
          )}`
        );

        results.emits.forEach((emit) => emit(socket, c));
      });

      emitItems(socket, c);
      emitStones(socket, c);
      emitLevelStats(socket, c);
      emitMultiFight(socket, c);
      emitQuests(socket, c);

      cb();
    });
  }

  const results = multiFight(socket, character, character.multiFight.amount);

  notice(
    socket,
    `You killed ${results.killed} monsters. Gained ${results.exp} exp, ${results.stones} stone and these items: ${results.items.join(', ')}`
  );

  return [emitItems, emitStones, emitLevelStats, emitMultiFight, emitQuests, ...results.emits];
};

function multiFight(socket: CustomSocket, character: User, amount: number) {
  const monster = socket.getConfig().Monsters.Monsters[character.multiFight.monsterId];
  const scene = character.multiFight.scene;
  let exp = 0;
  let killed = 0;
  let items: any[] = [];
  let stones = 0;
  const emits: EmitterFunction[] = [];

  for (let i = 0; i < amount; i++) {
    const fightResult = fight([character.stats], [monster], character, socket, { allowMulti: true, ignoreFightTimer: true });

    if (typeof fightResult === 'string') {
      continue;
    }

    if (fightResult.victory) {
      dropItems(socket, monster.dropTable, character.stats.dropPercent).forEach((item) => {
        if (addItem(character, item) !== null) {
          items.push(`[[item__${item.iid}--name]]`);
        } else {
          items.push('Inventory Full!');
        }
      });

      pubSub.emit('wonFight', character, monster.id, socket, scene).forEach((resp) => {
        emits.push(...resp[0]);

        if (resp.length > 1) {
          items.push(...resp[1]);
        }
      });

      exp += monster.exp;
      stones += randomInt(monster.stones[0], monster.stones[1]);

      const results = pubSub.emit('fightWon', character, character.multiFight.monsterId);

      killed += 1;
      results.forEach((result) => items.push(...result[1]));
    }
  }

  const { skillsGained } = gainExp(socket, character, exp);

  setTimeout(() => emitLevelStats(socket, character), 200);

  if (skillsGained.length > 0) {
    setTimeout(() => socket.emit('updateSkillsKnown', character.skillsKnown), 200);
  }

  character.stones += stones;

  character.multiFight.start = 0;
  character.multiFight.end = 0;
  character.fight.timeForNextFight = 0;

  return {
    killed,
    exp,
    items,
    stones,
    emits,
  };
}

const getMultiFightInfo: SocketFunction = async (socket, character, data, cb) => {
  emitMultiFight(socket, character);
};

export async function emitMultiFight(socket: CustomSocket, character: User) {
  const timeLeft = Math.max(character.multiFight.end - Date.now(), 0);

  socket.emit('updateMultiFight', character.multiFight.start === 0 ? null : timeLeft);
}

export default class FieldModule extends GameModule {
  moduleName = MODULE_NAME;
  modules = {
    fightMonster: fieldFight,
    fieldFightMulti,
    fieldFightMultiClaim,
    getMultiFightInfo,
  };
}
