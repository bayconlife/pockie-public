import { ItemLocations, ItemType } from '../../enums';
import { CustomSocket, Item } from '../../interfaces';
import { calculateStatsV2, emitStats } from '../character/stats';
import { addItemToLocation, getItem, getItemType, hasItem, itemSwap } from './itemSystem';
import { error } from '../kernel/errors';
import { GameModule, User } from '../../components/classes';
import { SocketFunction } from '../../types';
import { createSetItemLocationPatch, createSwapItemPatch } from './patches/inventoryPatch';
import { emitItemPatches } from './patches';

export const equipableItemTypes = [
  ItemType.Avatar,
  ItemType.Weapon,
  ItemType.Gloves,
  ItemType.Pet,
  ItemType.Ring,
  ItemType.Amulet,
  ItemType.Helm,
  ItemType.Body,
  ItemType.Belt,
  ItemType.Shoes,
];

export const checkLevelsOfType = [
  ItemType.Weapon,
  ItemType.Gloves,
  ItemType.Ring,
  ItemType.Amulet,
  ItemType.Helm,
  ItemType.Body,
  ItemType.Belt,
  ItemType.Shoes,
];

const equipItem: SocketFunction<{ uid: string }> = async (socket, character, { uid }, cb) => {
  const item = getItem(character, uid);

  if (item === undefined) {
    return error(socket, 'Invalid item');
  }

  if (checkLevelsOfType.includes(getItemType(item)) && character.level < (item.props?.level || 0)) {
    return error(socket, 'Not high enough level.');
  }

  if (character.dungeon) {
    return error(socket, 'error__no_modifications_while_in_dungeon');
  }

  const itemType = getItemType(item);

  if (!equipableItemTypes.includes(itemType)) {
    return error(socket, 'This item type cannot be equipped');
  }

  const equippedItemUID = character.locations[ItemLocations.Equipment_Avatar + itemType];

  if (hasItem(character, equippedItemUID)) {
    itemSwap(character, item, getItem(character, equippedItemUID)!);
    emitItemPatches(socket, [createSwapItemPatch(item, character.items[equippedItemUID])]);
  } else {
    addItemToLocation(socket, character, item, ItemLocations.Equipment_Avatar + itemType);
    emitItemPatches(socket, [createSetItemLocationPatch(item, ItemLocations.Equipment_Avatar + itemType)]);
  }

  character.stats = calculateStatsV2(socket, character);

  return [emitStats];
};

export function equipItemToUser(socket: CustomSocket, user: User, item: Item) {
  const itemType = getItemType(item);
  const equippedItemUID = user.locations[ItemLocations.Equipment_Avatar + itemType];

  if (hasItem(user, equippedItemUID)) {
    itemSwap(user, item, getItem(user, equippedItemUID)!);
  } else {
    addItemToLocation(socket, user, item, ItemLocations.Equipment_Avatar + itemType);
  }
}

export function isItemEquipped(user: User, item: Item) {
  const location = ItemLocations.Equipment_Avatar + getItemType(item);

  return user.locations[location] === item.uid;
}

export default class EquipModule extends GameModule {
  moduleName = 'Equip';
  modules = {
    equipItem,
  };
}
