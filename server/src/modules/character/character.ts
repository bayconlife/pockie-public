import { Callback, SocketFunction } from '../../types';
import { CustomSocket } from '../../interfaces';
import { emitMultiFight } from '../scene/core/fields';
import { getCharacter, getUnlockedCharacter } from '../../infrastructure/cache';
import { error } from '../kernel/errors';
import { ItemLocations } from '../../enums';
import { GameModule, User } from '../../components/classes';
import { onFightFinished, onLogin, onRequestLoginData, onRequestLoginServerData } from '../kernel/pubSub';
import { RANKS } from '../../resources/arena';
import character from '.';

const MODULE_NAME = 'Character';
const INITIAL_DATA = {
  recovery: {
    hp: 0,
    chakra: 0,
  },
};

onLogin(MODULE_NAME, (socket, character) => {
  if (character.statBonus === undefined) {
    character.statBonus = {};
  }

  if (character.buffs === undefined) {
    character.buffs = {};
  }

  character.fight = {
    // @ts-ignore
    timeForNextFight: 0,
    ...character.fight,
  };

  character.recovery = {
    ...INITIAL_DATA,
    ...character.recovery,
  };
});

onRequestLoginData(MODULE_NAME, (character) => ({
  buffs: character.buffs,
  displayName: character.displayName,
  stats: {
    ...character.stats,
    rank: character.arena.rank,
  },
  recovery: character.recovery,
}));

onRequestLoginServerData(MODULE_NAME, (config) => ({
  leveling: {
    max: config.Leveling.Config.maxLevel,
    expPerLevel: config.Leveling.EXP_FOR_LEVEL,
  },
  rank: RANKS,
}));

onFightFinished(MODULE_NAME, (socket, character) => {
  applyCharacterRecovery(socket, character);

  return [];
});

export async function emitStones(socket: CustomSocket, character: User) {
  socket.emit('updateStones', character.stones);
}
export async function emitMedals(socket: CustomSocket, character: User) {
  socket.emit('updateMedals', character.arena.medals);
}

export const purchaseRecovery: SocketFunction<{ type: number; amount: number }> = async (socket, character, { type, amount }, cb) => {
  if (![0, 1].includes(type)) {
    return error(socket, 'error__invalid_type');
  }

  const currentAmount = type === 0 ? character.recovery.hp : character.recovery.chakra;

  if (amount > 10000 - currentAmount) {
    return error(socket, 'error__invalid_amount');
  }

  const cost = type === 0 ? amount * 10 : amount * 5;

  if (character.stones < cost) {
    return error(socket, 'error__not_enough_stones');
  }

  character.stones -= cost;

  if (type === 0) {
    character.recovery.hp += amount;
  } else {
    character.recovery.chakra += amount;
  }

  applyCharacterRecovery(socket, character);

  cb();

  return [emitStones];
};

export function applyCharacterRecovery(socket: CustomSocket, character: User) {
  let missingHp = character.stats.maxHp - character.stats.hp;
  let missingChakra = character.stats.maxChakra - character.stats.chakra;

  if (missingHp > character.recovery.hp) {
    missingHp = character.recovery.hp;
  }

  if (missingChakra > character.recovery.chakra) {
    missingChakra = character.recovery.chakra;
  }

  if (missingHp <= 0) {
    missingHp = 0;
  }

  if (missingChakra <= 0) {
    missingChakra = 0;
  }

  console.log('Applying recovery of', missingHp, character.stats.hp);

  character.recovery.hp -= missingHp;
  character.recovery.chakra -= missingChakra;

  character.stats.hp += missingHp;
  character.stats.chakra += missingChakra;

  socket.emit('recover', [missingHp, missingChakra]);
}

interface ViewCharacterProps {
  serverId: number;
  accountId: number;
}

export async function viewCharacter(socket: CustomSocket, { serverId, accountId }: ViewCharacterProps, cb?: Callback) {
  try {
    const character = await getUnlockedCharacter(serverId, accountId);
    const reducedCharacter = {
      stats: character.stats,
      items: character.items,
      locations: character.locations,
      skills: character.skills,
    };

    socket.emit('viewCharacter', reducedCharacter);
  } catch (e) {
    return error(socket, 'error__invalid_character');
  }
}

export default class CharacterModule extends GameModule {
  moduleName = MODULE_NAME;
  modules = {
    purchaseRecovery,
  };
}
