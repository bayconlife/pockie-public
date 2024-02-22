import { SocketFunction } from '../../../types';
import { CustomSocket, Dungeon, Item, Stats } from '../../../interfaces';
import { Scene } from '../../../resources/scenes';
import { getUsersParty, isCharacterInParty, isCharacterPartyLeader, partyCreate, updateParty } from '../../character/party';
import { error } from '../../kernel/errors';
import { GATES, VALHALLA_CONFIG } from '../../../resources/valhalla';
import { fight } from '../../fight/combat';
import { randomUUID } from '../../../components/random';
import { createItem, emitItems } from '../../items/itemSystem';
import { addItem } from '../../items/inventory';
import { dropItems } from '../../drop/drops';
import { GameModule, User } from '../../../components/classes';
import { BasicCardRow, CARDS } from '../../../resources/cards';
import { cardsCreate } from './cards';
import { getUnlockedCharacter } from '../../../infrastructure/cache';
import { onLogin, onRequestLoginServerData } from '../../../modules/kernel/pubSub';

const MODULE_NAME = 'Dungeons';

onLogin(MODULE_NAME, (socket, character) => {
  if (isCharacterInDungeon(character)) {
    socket.join(`dungeon-${character.dungeon}`);
  } else {
    delete character.dungeon;
  }
});

onRequestLoginServerData(MODULE_NAME, (config) => ({
  valhalla: config.Valhalla.ClientData,
}));

export const dungeons = new Map<string, Dungeon>();

export function isCharacterInDungeon(character: User) {
  if (character.dungeon === undefined) {
    return false;
  }

  if (dungeons.has(character.dungeon)) {
    return true;
  }

  return false;
}

const dungeonFight: SocketFunction = async (socket, character, _, cb) => {
  const dungeonId = character.dungeon;

  if (!isCharacterInDungeon(character)) {
    return error(socket, 'error__dungeon_instance_not_found');
  }

  const party = getUsersParty(character);

  if (party === null) {
    return error(socket, 'error__invalid_party');
  }

  if (!isCharacterPartyLeader(socket, character)) {
    return error(socket, 'error__must_be_leader');
  }

  const dungeon = dungeons.get(character.dungeon!);

  if (dungeon === undefined) {
    return error(socket, 'error__dungeon_instance_not_found');
  }

  const gate = socket.getConfig().Valhalla.Gates[dungeon.id];
  const locations = gate.modes[dungeon.mode].locations;
  const monsters = locations[dungeon.location][dungeon.subLocation];
  const playerData: Stats[] = [];

  party.positions.forEach((id) => {
    if (id in dungeon.stats) {
      playerData.push(dungeon.stats[id]);
    }
  });

  const fightResult = fight(playerData, monsters, character, socket);

  if (typeof fightResult === 'string') {
    return error(socket, fightResult);
  }

  let dungeonWasCompleted = false;
  const itemList: [number | string, string][] = [];
  let cards: BasicCardRow | undefined = undefined;

  if (fightResult.victory) {
    dungeon.subLocation += 1;

    if (dungeon.subLocation >= locations[dungeon.location].length) {
      dungeon.location += 1;
      dungeon.subLocation = 0;

      if (dungeon.location >= locations.length) {
        dungeonWasCompleted = true;

        if (gate.modes[dungeon.mode].cards) {
          cards = CARDS.valhalla[gate.modes[dungeon.mode].cards];
        }
      }
    }
  } else {
    dungeonWasCompleted = true;
  }

  if (dungeonWasCompleted) {
    dungeons.delete(dungeonId!);
  }

  await updateParty(socket, character, party, (partyMember, idx) => {
    const id = party.positions[idx];
    const items: Item[] = [];

    if (fightResult.victory) {
      monsters.forEach((monster) => items.push(...dropItems(socket, monster.dropTable, partyMember.stats.dropPercent)));

      items.forEach((item) => {
        if (addItem(partyMember, item) !== null) {
          itemList.push([item.iid, partyMember.displayName]);
        } else {
          itemList.push(['error__inventory_full', partyMember.displayName]);
        }
      });

      if (cards !== undefined) {
        cardsCreate(socket, partyMember, cards, VALHALLA_CONFIG.default, 5);
      }
    }

    if (dungeonWasCompleted) {
      delete partyMember.dungeon;
    } else {
      const c = fightResult.players.find((player) => player.id === id.toString());

      if (c === undefined) {
        return;
      }

      if (c.hp > 0) {
        dungeon.stats[id].hp = Math.max(Math.min(Math.ceil(c.hp + c.maxHp * VALHALLA_CONFIG.hpRestore), c.maxHp), 0);
      }

      dungeon.stats[id].chakra = Math.max(Math.min(Math.ceil(c.chakra + c.maxChakra * VALHALLA_CONFIG.mpRestore), c.maxChakra), 0);
    }
  });

  let callback = 'dungeonRefresh';
  let callbackArgs: any = undefined;

  if (dungeonWasCompleted) {
    callback = fightResult.victory ? 'cardCheck' : 'switchScene';
    callbackArgs = fightResult.victory ? undefined : 5001;

    setTimeout(() => {
      socket.shout(`dungeon-${dungeonId}`, 'dungeonUpdate', { location: dungeon.location, subLocation: dungeon.subLocation });
      socket.shout(`dungeon-${dungeonId}`, 'dungeonComplete');
      socket.shout(`dungeon-${dungeonId}`, `dungeon-${dungeonId}`);
    }, 1000);
  }

  socket.shout(`dungeon-${dungeonId}`, 'fight', {
    callback,
    callbackArgs,
    ...fightResult,
    rewards: { items: itemList, progress: (dungeon.subLocation / 5) * 100 + '%' },
  });
};

const dungeonInfo: SocketFunction<{ id: string; difficulty: number }> = async (socket, character, { id, difficulty }, cb) => {
  cb({
    id,
    ...GATES[id],
    sets: (GATES[id].modes[difficulty].sets ?? []).map((set) => ({ id: set.id, items: set.items.map((iid) => createItem(socket, iid)) })),
  });
};

const dungeonGiveUp: SocketFunction = async (socket, character, _, cb) => {
  if (!isCharacterInDungeon(character)) {
    return error(socket, 'error__dungeon_instance_not_found');
  }

  const dungeon = dungeons.get(character.dungeon!)!;
  const dungeonId = character.dungeon;
  const party = getUsersParty(character);

  if (party === null) {
    return error(socket, 'error__invalid_party');
  }

  await updateParty(socket, character, party, (partyMember, idx) => {
    delete partyMember.dungeon;
  });

  dungeons.delete(character.dungeon!);

  socket.shout(`dungeon-${dungeonId}`, 'dungeonUpdate', { location: dungeon.location, subLocation: dungeon.subLocation });
  socket.shout(`dungeon-${dungeonId}`, 'dungeonComplete');
  socket.shout(`dungeon-${dungeonId}`, `dungeon-${dungeonId}`);
};

const dungeonRefresh: SocketFunction = async (socket, character, _, cb) => {
  return [emitDungeon, emitItems];
};

const dungeonStart: SocketFunction<{ id: string; difficulty: number }> = async (socket, character, { id, difficulty }, cb) => {
  const dungeonInfo = GATES[id];

  if (dungeonInfo === undefined || !(difficulty in dungeonInfo.modes)) {
    return error(socket, 'error__invalid_dungeon');
  }

  if (character.dungeon !== undefined) {
    if (dungeons.has(character.dungeon)) {
      error(socket, 'error__dungeon_in_progress');
      socket.emit('requestSwitchScene', Scene.Dungeon);
      socket.shout(`dungeon-${character.dungeon}`, 'requestSwitchScene', Scene.Dungeon);
      return;
    } else {
      error(socket, 'error__dungeon_instance_not_found');
      delete character.dungeon;
    }
  }

  let party = getUsersParty(character);

  if (!isCharacterInParty(character)) {
    party = partyCreate(socket, character);

    socket.save(character);
  }

  if (party === null) {
    return error(socket, 'error__invalid_party');
  }

  if (!isCharacterPartyLeader(socket, character)) {
    return error(socket, 'error__must_be_leader');
  }

  for (let i = 0; i < party.positions.length; i++) {
    const partyMember = await getUnlockedCharacter(socket.getServerId(), party.positions[i]);

    if (partyMember === null) {
      return error(socket, 'error__invalid_character_in_party');
    }

    if (partyMember.cards !== undefined) {
      return error(socket, 'error__character_has_cards');
    }

    if (partyMember.level < dungeonInfo.minLevel) {
      return error(socket, 'error__not_high_enough_level');
    }
  }

  if (party.positions.length > dungeonInfo.modes[difficulty].partyLimit) {
    return error(socket, 'error__too_many_party_members');
  }

  const dungeonId = randomUUID();
  const dungeon: Dungeon = {
    id,
    mode: difficulty,
    location: 0,
    subLocation: 0,
    stats: {},
  };

  dungeons.set(dungeonId, dungeon);
  character.unlock?.();

  await updateParty(socket, character, party, (partyMember, idx) => {
    partyMember.dungeon = dungeonId;

    dungeon.stats[party!.positions[idx]] = {
      ...partyMember.stats,
      id: party!.positions[idx].toString(),
    };
  });

  socket.join(`dungeon-${dungeonId}`);
  socket.to(`party-${character.party}`).socketsJoin(`dungeon-${dungeonId}`);
  socket.shout(`dungeon-${dungeonId}`, 'requestSwitchScene', Scene.Dungeon);
};

export async function emitDungeon(socket: CustomSocket) {
  const character = await socket.getUnlockedCharacter();

  if (!isCharacterInDungeon(character)) {
    socket.emit('requestSwitchScene', Scene.Valhalla);

    return;
  }

  const dungeon = dungeons.get(character.dungeon!)!;

  socket.emit('updateDungeon', {
    ...dungeon,
    locations: GATES[dungeon.id].modes[dungeon.mode].locations.map((location) =>
      location.map((battle) => battle.map((monster) => monster.id))
    ),
  });
}

export default class DungeonModule extends GameModule {
  moduleName = MODULE_NAME;
  modules = {
    dungeonAbandon: dungeonGiveUp,
    dungeonFight,
    dungeonInfo,
    dungeonRefresh,
    dungeonStart,
  };
}
