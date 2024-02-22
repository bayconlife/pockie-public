import { SocketFunction } from '../../types';
import { GameModule, User } from '../../components/classes';
import { onLogin, onRequestLoginData } from '../kernel/pubSub';
import { CustomSocket } from '../../interfaces';

const MODULE_NAME = 'Energy';

onLogin(MODULE_NAME, (socket, c) => {
  if (c.energy === undefined) {
    c.energy = {
      current: 200,
      nextRefresh: 0,
    };
  }

  if (c.energy.nextRefresh > Date.now()) {
    return;
  }

  refreshEnergy(socket, c);
});

onRequestLoginData(MODULE_NAME, (c) => ({
  energy: c.energy,
}));

const checkEnergyRefresh: SocketFunction = async (socket, character, _, cb) => {
  if (character.energy.nextRefresh > Date.now()) {
    return cb();
  }

  refreshEnergy(socket, character);
};

function refreshEnergy(socket: CustomSocket, character: User) {
  const config = socket.getConfig().Energy.CONFIG;
  const nextRefresh = new Date(Date.now());

  nextRefresh.setHours(0, 0, 0, 0);
  nextRefresh.setDate(nextRefresh.getDate() + 1);

  character.energy.current = Math.min(config.max, character.energy.current + config.dailyGain);
  character.energy.nextRefresh = nextRefresh.getTime();
}

export default class EnergyModule extends GameModule {
  moduleName = MODULE_NAME;
  modules = {
    checkEnergyRefresh,
  };
}
