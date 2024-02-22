import { CustomSocket } from '../../../interfaces';
import { CARDS } from '../../../resources/cards';
import { cardsCreate, emitCards } from './cards';
import { EXPLORATION, EXPLORATION_CLIENT_DATA } from '../../../resources/exploration';
import { Callback, SocketFunction } from '../../../types';
import { error } from '../../kernel/errors';
import { addItem } from '../../items/inventory';
import { createItem, emitItems } from '../../items/itemSystem';
import { GameModule, User } from '../../../components/classes';
import { onRequestLoginData, onRequestLoginServerData } from '../../../modules/kernel/pubSub';

const MODULE_NAME = 'Exploration';

onRequestLoginData(MODULE_NAME, (character) => ({
  exploration: character.exploration,
}));

onRequestLoginServerData(MODULE_NAME, (config) => ({
  exploration: EXPLORATION_CLIENT_DATA,
}));

const explore: SocketFunction = async (socket, character, _, cb) => {
  const scene = character.scenes.current;

  if (character.exploration[scene] === undefined) {
    return error(socket, 'error__invalid_exploration');
  }

  if (character.exploration[scene][0] < 10) {
    return error(socket, 'error__invalid_exploration_amount');
  }

  const cards = CARDS.exploration[scene];

  if (cards === undefined) {
    return error(socket, 'error__invalid_card_set');
  }

  cardsCreate(socket, character, cards, 150168, 5);

  character.exploration[scene][0] = 0;
  character.exploration[scene][1] = Math.min(
    (1 / (EXPLORATION.starRates[scene] ?? 1)) * EXPLORATION.starRewards[scene].length,
    (character.exploration[scene][1] ?? 0) + 1
  );

  emitCards(socket, character, () => {
    emitExploration(socket, character);
  });
};

const exploreCollect: SocketFunction = async (socket, character, _, cb) => {
  const scene = character.scenes.current;

  if (character.exploration[scene] === undefined) {
    return error(socket, 'error__invalid_exploration');
  }

  const starRate = EXPLORATION.starRates[scene];

  if (starRate === undefined) {
    return error(socket, 'error__invalid_scene_star_rate');
  }

  const rewards = EXPLORATION.starRewards[scene];

  if (rewards === undefined) {
    return error(socket, 'error__invalid_scene_star_rewards');
  }

  const redeemed = character.exploration[scene][2] ?? 0;

  if (redeemed >= rewards.length) {
    return error(socket, 'error__stars_fully_collected');
  }

  if (Math.floor(character.exploration[scene][1] * starRate) <= redeemed) {
    return error(socket, 'error__not_enough_stars');
  }

  if (addItem(character, createItem(socket, rewards[redeemed]))) {
    character.exploration[scene][2] = Math.min(rewards.length, redeemed + 1);

    return [emitItems, emitExploration];
  } else {
    return error(socket, 'error__inventory_full');
  }
};

const exploreInfo: SocketFunction = async (socket, character, data, cb) => {
  emitExploration(socket, character);
};

export async function emitExploration(socket: CustomSocket, character: User) {
  socket.emit('updateExploration', { [character.scenes.current]: character.exploration[character.scenes.current] });
}

export default class ExplorationModule extends GameModule {
  moduleName = MODULE_NAME;
  modules = {
    explore,
    exploreCollect,
    exploreInfo,
  };
}
