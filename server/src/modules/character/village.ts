import { SocketFunction } from '../../types';
import { GameModule } from '../../components/classes';
import { calculateStatsV2, emitStats } from './stats';
import { error } from '../kernel/errors';
import { onRequestLoginData } from '../kernel/pubSub';

const MODULE_NAME = 'Villages';

onRequestLoginData(MODULE_NAME, (character) => ({
  homeVillage: character.village,
}));

const villageSwap: SocketFunction<number> = async (socket, character, id, cb) => {
  if (![111, 211, 311, 411, 511].includes(id)) {
    return error(socket, 'error__invalid_village');
  }

  character.village = id;
  character.stats = calculateStatsV2(socket, character);

  cb();

  return [emitStats];
};

export default class VillageModule extends GameModule {
  moduleName = MODULE_NAME;
  modules = {
    villageSwap,
  };
}
