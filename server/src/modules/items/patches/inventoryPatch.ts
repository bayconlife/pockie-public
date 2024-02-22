import { Patch, getItemIdentifier } from '.';
import { ItemLocations } from '../../../enums';
import { Item } from '../../../interfaces';
import { getItemLocation, getItemPosition } from '../itemSystem';

export function createAddItemPatch(item: Item) {
  return [Patch.ADD_ITEM, item];
}

export function createReduceItemPatch(item: Item, amount: number) {
  return [Patch.REDUCE_ITEM, ...getItemIdentifier(item), amount];
}

export function createRemoveItemPatch(item: Item) {
  return [Patch.REMOVE_ITEM, ...getItemIdentifier(item)];
}

export function createSetItemLocationPatch(item: Item, location: ItemLocations) {
  return [Patch.SET_LOCATION, ...getItemIdentifier(item), location];
}

export function createSwapItemPatch(item: Item, itemToSwapWith: Item) {
  return [Patch.SWAP_ITEMS, ...getItemIdentifier(item), ...getItemIdentifier(itemToSwapWith)];
}

export function createUpdateItemPatch(item: Item) {
  return [Patch.UPDATE_ITEM, ...getItemIdentifier(item), item];
}
