import { CustomSocket, Item } from '../../../interfaces';
import { getItemLocation, getItemPosition } from '../itemSystem';

export enum Patch {
  ADD_ITEM = 0,
  REMOVE_ITEM = 1,
  REDUCE_ITEM = 2,
  SWAP_ITEMS = 3,
  SET_LOCATION = 4,
  UPDATE_ITEM = 5,
  ADD_HOLE = 10,
}

export function emitItemPatches(socket: CustomSocket, patches: any[]) {
  socket.emit('inventoryPatch', patches);
}

export function getItemIdentifier(item: Item) {
  // return [getItemLocation(item), getItemPosition(item)];
  return [item.uid];
}
