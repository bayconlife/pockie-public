import { onLogin, onRequestLoginData, onRequestLoginServerData } from '../../../modules/kernel/pubSub';
import { GameModule, User } from '../../../components/classes';
import { createItem, emitItems } from '../../../modules/items/itemSystem';
import { SocketFunction } from '../../../types';
import { error } from '../../../modules/kernel/errors';
import { CustomSocket } from '../../../interfaces';
import { addItem } from '../../../modules/items/inventory';
import { prompt } from '../../../modules/kernel/notices';
import { updateCharacter } from '../../../modules/kernel/cache';
import { emitStones } from '../../character/character';

const MODULE_NAME = 'Home';
const defaultHome = {
  farm: [],
};

onLogin(MODULE_NAME, (socket, character) => {
  character.home = {
    ...defaultHome,
    ...character.home,
  };
});

onRequestLoginData(MODULE_NAME, (character: User) => {
  return {
    home: character.home,
  };
});

onRequestLoginServerData(MODULE_NAME, (config) => ({
  home: {
    farm: config.Home.FARM_ITEMS,
  },
}));

function emitHome(socket: CustomSocket, character: User) {
  socket.emit('updateCharacter', {
    home: character.home,
  });
}

const purchasePlot: SocketFunction<{ id: number; plantId: number }> = async (socket, character, { id, plantId }, cb) => {
  if (id > 6 || id < 0) {
    error(socket, 'error__invalid_plot');
  }

  const FARM_CONFIG = socket.getConfig().Home.FARM_CONFIG;

  if (!FARM_CONFIG[plantId]) {
    error(socket, 'error__invalid_plant');
  }

  if (character.stones < FARM_CONFIG[plantId].cost) {
    error(socket, 'error__not_enough_stones');
  }

  character.home.farm[id] = [plantId, Date.now() + FARM_CONFIG[plantId].time];
  character.stones -= FARM_CONFIG[plantId].cost;

  cb();

  return [emitHome, emitStones];
};

const removePlot: SocketFunction<number> = async (socket, character, id, cb) => {
  if (id < 0 || id > 6) {
    error(socket, 'error__invalid_plot');
  }

  if (!character.home.farm[id]) {
    error(socket, 'error__no_crop');
  }

  if (Date.now() > character.home.farm[id][1]) {
    if (!addItem(character, createItem(socket, character.home.farm[id][0]))) {
      error(socket, 'error__not_enough_inventory_space');

      cb();
      return [emitHome];
    }

    delete character.home.farm[id];

    cb();

    return [emitHome, emitItems];
  } else {
    prompt(socket, 'Are you sure you want to remove this crop?', async (accept) => {
      if (accept) {
        const char = await updateCharacter(socket, (c) => {
          delete c.home.farm[id];
        });

        emitHome(socket, char);

        cb();
      }
    });
  }
};

export default class HomeModule extends GameModule {
  moduleName = MODULE_NAME;
  modules = {
    purchasePlot,
    removePlot,
  };
}
