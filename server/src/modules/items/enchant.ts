import { ItemLocations, ItemType } from '../../enums';
import { Item } from '../../interfaces';
import { SocketFunction } from '../../types';
import { error } from '../kernel/errors';
import { addItemToLocation, getItem, getItemType, isItemType, itemSwap, reduceItem } from './itemSystem';
import { GameModule, User } from '../../components/classes';
import { Enchant } from '../../resources/enchant';
import { Items } from '../../resources/items';
import { createReduceItemPatch, createSetItemLocationPatch, createSwapItemPatch } from './patches/inventoryPatch';
import { emitItemPatches } from './patches';

const locations = [ItemLocations.Enchant, ItemLocations.EnchantStone];

async function checkEnchantLocations(user: User) {
  const item = getItem(user, user.locations[ItemLocations.Enchant]);
  const stone = getItem(user, user.locations[ItemLocations.EnchantStone]);
  return !(item === undefined) && !(stone === undefined);
}

const enchantGetInfo: SocketFunction = async (socket, character, _, cb) => {
  cb({ valid: checkEnchantLocations(character) });

  return [];
};

const enchantSetItem: SocketFunction<{ uid: string; location: number }> = async (socket, character, { location, uid }, cb) => {
  if (!locations.includes(location)) {
    return error(socket, 'Invalid location');
  }

  const item = getItem(character, uid);

  if (item === undefined) {
    return error(socket, 'Invalid item');
  }

  if (location === ItemLocations.EnchantStone && !isItemType(item, ItemType.Enchantment)) {
    return error(socket, 'Cannot put non stone into that location');
  }

  if (location === ItemLocations.Enchant && !Enchant.types.includes(getItemType(item))) {
    return error(socket, 'Must put weapon or armor into this location');
  }

  if (location in character.locations) {
    itemSwap(character, item, character.items[character.locations[location]]);
    emitItemPatches(socket, [createSwapItemPatch(item, character.items[character.locations[location]])]);
  } else {
    addItemToLocation(socket, character, item, location);
    emitItemPatches(socket, [createSetItemLocationPatch(item, location)]);
  }

  cb({ valid: checkEnchantLocations(character) });
};

const enchantAttempt: SocketFunction = async (socket, character, data, cb) => {
  if (!(ItemLocations.Enchant in character.locations)) {
    return error(socket, 'No item to enchant');
  }

  const item = getItem(character, character.locations[ItemLocations.Enchant]);

  if (item === undefined) {
    return error(socket, 'Invalid item');
  }

  const stone = getItem(character, character.locations[ItemLocations.EnchantStone]);

  if (stone === undefined) {
    return error(socket, 'Invalid Enchanting item');
  }

  if (!Items[stone.iid].innate.types.includes(getItemType(item))) {
    return error(socket, 'Invalid Stone for Item');
  }

  enchantItem(character, item, stone);
  emitItemPatches(socket, [createReduceItemPatch(stone, 1)]);
  reduceItem(character, stone, 1);

  cb(item);
};

function enchantItem(user: User, item: Item, stone: Item) {
  const enchantments = stone.props.stats;

  deleteEnchantment(user.items[item.uid]);

  for (let i = 0; i < enchantments.length; i++) {
    user.items[item.uid].props.stats[`Enchantment_${i + 1}`] = { stat: enchantments[i].stat, roll: enchantments[i].value };
  }
}

function deleteEnchantment(item: Item) {
  delete item.props.stats['Enchantment_1'];
  delete item.props.stats['Enchantment_2'];
  delete item.props.stats['Enchantment_3'];
}

export default class EnchantModule extends GameModule {
  moduleName = 'Enchant';
  modules = {
    enchantAttempt,
    enchantGetInfo,
    enchantSetItem,
  };
}
