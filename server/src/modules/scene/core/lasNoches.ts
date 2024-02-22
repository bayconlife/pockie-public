import { SocketFunction } from '../../../types';
import { fight } from '../../fight/combat';
import { Floors } from '../../../resources/lasNoches';
import { emitLevelStats } from '../../character/stats';
import { error } from '../../kernel/errors';
import { emitLevelUp, gainExp } from '../../character/level';
import { GameModule } from '../../../components/classes';
import { emitFight } from '../../../modules/fight/fightSystem';
import { onLogin } from '../../../modules/kernel/pubSub';

const MODULE_NAME = 'LasNoches';
const defaultLasNoches = {
  current: -1,
  attemptsLeft: 2,
  exp: 0,
};

onLogin(MODULE_NAME, (socket, character) => {
  character.lasNoches = {
    ...defaultLasNoches,
    ...character.lasNoches,
  };
});

const attemptLevel: SocketFunction = async (socket, character, data, cb) => {
  if (character.lasNoches.current === -1) {
    return error(socket, 'Las Noches not started');
  }

  if (character.lasNoches.attemptsLeft === 0) {
    return error(socket, 'No attempts left');
  }

  if (character.party) {
    return error(socket, 'Cannot attempt Las Noches while in a party.');
  }

  const floor = Floors[character.lasNoches.current];
  const monster = floor.monster;
  const fightResult = fight([character.stats], [monster], character, socket);

  if (typeof fightResult === 'string') {
    return error(socket, fightResult);
  }

  if (fightResult.victory) {
    character.lasNoches.exp += floor.exp;
    character.lasNoches.current += 1;
  } else {
    character.lasNoches.attemptsLeft -= 1;

    if (character.lasNoches.attemptsLeft <= 0) {
      character.lasNoches.exp = Math.floor(character.lasNoches.exp / 2);
    }
  }

  emitFight(socket, fightResult, () => cb({ ...character.lasNoches, nextExp: floor.exp }));
};

const enterLasNoches: SocketFunction = async (socket, character, data, cb) => {
  if (character.lasNoches.current !== -1) {
    return error(socket, 'Las Noches already started');
  }

  if (character.party) {
    return error(socket, 'Cannot start Las Noches while in a party.');
  }

  character.lasNoches.exp = 0;
  character.lasNoches.current = -1;
  character.lasNoches.attemptsLeft = 2;

  cb();
};

const claimLasNoches: SocketFunction = async (socket, character, data, cb) => {
  if (character.lasNoches.current === -1) {
    return error(socket, 'Las Noches not started');
  }

  const { didLevelUp, skillsGained } = gainExp(socket, character, character.lasNoches.exp);

  character.lasNoches.exp = 0;
  character.lasNoches.current = -1;
  character.lasNoches.attemptsLeft = 2;

  if (didLevelUp) {
    emitLevelUp(socket, character, skillsGained);
  }

  cb();

  return [emitLevelStats];
};

const infoLasNoches: SocketFunction = async (socket, character, _, cb) => {
  const floor = Floors[character.lasNoches.current];

  cb({ ...character.lasNoches, nextExp: floor.exp });
};

const startLasNoches: SocketFunction = async (socket, character, _, cb) => {
  if (character.lasNoches.current !== -1) {
    return error(socket, 'Las Noches already started');
  }

  if (character.party) {
    return error(socket, 'Cannot start Las Noches while in a party.');
  }

  character.lasNoches.current = 0;

  cb();
};

export default class LasNochesModule extends GameModule {
  moduleName = MODULE_NAME;
  modules = {
    lasNochesEnter: enterLasNoches,
    lasNochesStart: startLasNoches,
    lasNochesAttempt: attemptLevel,
    lasNochesClaim: claimLasNoches,
    lasNochesInfo: infoLasNoches,
  };
}
