import { SocketFunction } from '../../../types';
import { GameModule } from '../../../components/classes';
import { onRequestLoginServerData } from '../../../modules/kernel/pubSub';
import { ItemLocations } from '../../../enums';
import { error, errorInvalidItem, errorInvalidLocation } from '../../../modules/kernel/errors';
import {
  addItemToLocation,
  createItem,
  getItem,
  getItemLocation,
  getItemPosition,
  itemSwap,
  setItemLocation,
  setItemPosition,
} from '../../../modules/items/itemSystem';
import { emitItemPatches } from '../../../modules/items/patches';
import { createSetItemLocationPatch, createSwapItemPatch } from '../../../modules/items/patches/inventoryPatch';
import { randomInt } from '../../../components/random';
import { emitStones } from '../../../modules/character/character';
import { notice } from '../../../modules/kernel/notices';

const MODULE_NAME = 'Reroll';

onRequestLoginServerData(MODULE_NAME, (config) => ({
  reroll: config.Base.Reroll,
}));

const rerollPet: SocketFunction<{ targetIID: number; maxStones: number }> = async (socket, character, { targetIID, maxStones }, cb) => {
  if (!(ItemLocations.RerollPet in character.locations)) {
    return error(socket, 'No item to reroll');
  }

  let item = getItem(character, character.locations[ItemLocations.RerollPet]);

  if (item === undefined) {
    return errorInvalidItem(socket);
  }

  const stoneCost = 1500;

  if (character.stones < stoneCost) {
    return error(socket, 'Not enough stones.');
  }

  maxStones = Math.floor(maxStones / stoneCost) * stoneCost;

  if (maxStones > 100000 || maxStones > character.stones) {
    return error(socket, 'Invalid max amount.');
  }

  const availablePets = socket.getConfig().Base.Reroll.pets;

  if (!availablePets.includes(targetIID)) {
    return error(socket, 'Invalid target pet selected.');
  }

  let roll = availablePets[randomInt(0, availablePets.length - 1)];
  let stoneTotal = stoneCost;

  while (roll !== targetIID && stoneTotal < maxStones) {
    roll = availablePets[randomInt(0, availablePets.length - 1)];
    stoneTotal += stoneCost;
  }

  const newItem = createItem(socket, roll, 1);

  newItem.uid = item.uid;
  setItemLocation(newItem, getItemLocation(item));
  setItemPosition(newItem, getItemPosition(item));

  character.items[item.uid] = newItem;
  character.stones -= stoneTotal;

  notice(socket, `Spent ${stoneTotal} stones.`);

  cb(newItem);

  return [emitStones];
};

const rerollPetSetItem: SocketFunction<string> = async (socket, character, uid, cb) => {
  const item = getItem(character, uid);
  const location = ItemLocations.RerollPet;

  if (item === undefined) {
    return errorInvalidItem(socket);
  }

  if (location in character.locations) {
    itemSwap(character, item, character.items[character.locations[location]]);
    emitItemPatches(socket, [createSwapItemPatch(item, character.items[character.locations[location]])]);
  } else {
    addItemToLocation(socket, character, item, location);
    emitItemPatches(socket, [createSetItemLocationPatch(item, location)]);
  }

  cb();
};

export default class RerollModule extends GameModule {
  moduleName = MODULE_NAME;
  modules = {
    rerollPetSetItem,
    rerollPet,
  };
}
