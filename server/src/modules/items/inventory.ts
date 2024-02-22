import { Item } from '../../interfaces';
import { SocketFunction } from '../../types';
import { calculateStatsV2 } from '../character/stats';
import {
  createItem,
  emitItems,
  getItem,
  getItemAmount,
  getItemBase,
  getItemBound,
  getItemInLocation,
  getItemLocation,
  getItemPosition,
  getItemSizes,
  hasItem,
  reduceItem,
  removeItemFromItsLocation,
  setItemAmount,
  setItemBound,
  setItemLocation,
  setItemPosition,
} from './itemSystem';
import { emitStones } from '../character/character';
import { GameModule, User } from '../../components/classes';
import { error, errorInvalidItem, errorInvalidLocation } from '../kernel/errors';
import { ItemLocations } from '../../enums';
import { addItemToContainer, removeItemFromItsContainer } from './container';
import { isItemEquipped } from './equip';
import { createReduceItemPatch } from './patches/inventoryPatch';
import { emitItemPatches } from './patches';

const inventories = 10;
const inventoryRows = 6;
const inventoryRowLength = 10;

export const CONTAINER_INVENTORY = { locations: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], rows: 6, rowLength: 10 };

const setInventoryPosition: SocketFunction<{ uid: string; location: number; position: number }> = async (socket, character, data, cb) => {
  const { uid, location, position } = data;

  if (location < 0 || location > inventories) {
    return errorInvalidLocation(socket);
  }

  const item = getItem(character, uid);

  if (item === undefined) {
    return errorInvalidItem(socket);
  }

  if (getItemInLocation(character, ItemLocations.Equipment_Avatar)?.uid === uid) {
    return error(socket, 'error__must_have_avatar');
  }

  const positions: number[] = Object.entries(character.containers[location] ?? {}).reduce((pos, [position, _uid]) => {
    if (uid === _uid) {
      return pos;
    }

    const _item = character.items[_uid];
    const size = getItemSizes(_item);

    for (var h = 0; h < size.height; h++) {
      for (var w = 0; w < size.width; w++) {
        pos.push(Number(position) + w + h * inventoryRowLength);
      }
    }

    return pos;
  }, [] as number[]);

  const height = getItemSizes(item).height;
  const width = getItemSizes(item).width;
  let isValidPosition = true;

  for (let h = 0; h < height; h++) {
    for (let w = 0; w < width; w++) {
      isValidPosition = isValidPosition && !positions.includes(position + w + h * inventoryRowLength);

      const invalidVertical = position + width + height * inventoryRowLength > (inventoryRows + 1) * inventoryRowLength;
      const invalidHorizontal = (position % inventoryRowLength) + width > inventoryRowLength;

      if (invalidVertical || invalidHorizontal) {
        isValidPosition = false;
      }

      if (!isValidPosition) {
        break;
      }
    }

    if (!isValidPosition) {
      break;
    }
  }

  if (!isValidPosition) {
    return error(socket, 'error__invalid_position');
  }

  const itemWasEquipped = isItemEquipped(character, item);

  removeItemFromItsLocation(character, item);
  removeItemFromItsContainer(character, item);

  setItemLocation(item, location);
  setItemPosition(item, position);

  if (character.containers[location] === undefined) {
    character.containers[location] = {};
  }

  character.containers[location][position] = uid;

  if (itemWasEquipped) {
    character.stats = calculateStatsV2(socket, character);
    socket.emit('updateStats', character.stats);
  }

  cb();
};

export function addItem(character: User, item: Item) {
  return addItemToContainer(character, item, CONTAINER_INVENTORY);
}

const getInventory: SocketFunction = async (socket, character, data, cb) => {
  // const user = getUser(socket.getAccountId());
  // cb({ items: user.items, equipped: user.equipped });

  return [emitItems];
};

export function getNextPosition(user: User, item: Item) {
  const height = getItemSizes(item).height;
  const width = getItemSizes(item).width;

  let isValidPosition = false;
  let position = -1;
  let location = 0;

  for (location = 0; location < inventories; location++) {
    const positions: number[] = [];

    Object.entries(user.items).forEach(([uid, item]) => {
      if (getItemLocation(item) !== location) {
        return;
      }

      const size = getItemSizes(item);
      const position = getItemPosition(item);

      for (var h = 0; h < size.height; h++) {
        for (var w = 0; w < size.width; w++) {
          positions.push(position + w + h * inventoryRowLength);
        }
      }
    });

    for (let i = 0; i < 60; i++) {
      isValidPosition = true;

      for (let h = 0; h < height; h++) {
        for (let w = 0; w < width; w++) {
          isValidPosition = isValidPosition && !positions.includes(i + w + h * inventoryRowLength);

          const invalidVertical = i + width + height * inventoryRowLength > (inventoryRows + 1) * inventoryRowLength;
          const invalidHorizontal = (i % inventoryRowLength) + width > inventoryRowLength;

          if (invalidVertical || invalidHorizontal) {
            isValidPosition = false;
          }

          if (!isValidPosition) {
            break;
          }
        }
      }

      if (isValidPosition) {
        position = i;
        break;
      }
    }

    if (isValidPosition) {
      break;
    }
  }

  return [position, location];
}

const sellItems: SocketFunction<string[]> = async (socket, character, uids, cb) => {
  const patches: any[] = [];

  uids.forEach((uid) => {
    if (uid in character.items) {
      character.stones += Number(getItemBase(character.items[uid].iid)?.price) ?? 1;

      patches.push(createReduceItemPatch(character.items[uid], 1));
      reduceItem(character, character.items[uid], 1);
    }
  });

  cb(true);

  emitItemPatches(socket, patches);

  return [emitStones];
};

const sellItem: SocketFunction<string> = async (socket, character, uid, cb) => {
  const item = getItem(character, uid);

  if (item === undefined) {
    return errorInvalidItem(socket);
  }

  const value = getItemBase(item.iid).price ?? 1;
  const amount = getItemAmount(item);

  character.stones += value * amount;

  reduceItem(character, item, amount);

  cb();
};

export const splitItem: SocketFunction<{ uid: string }> = async (socket, character, { uid }, cb) => {
  const item = getItem(character, uid);

  if (item === undefined) {
    return errorInvalidItem(socket);
  }

  const count = getItemAmount(item);

  if (count === 1) {
    return error(socket, 'error__not_enough_stacks');
  }

  const amount = Math.floor(count / 2);
  const newItem = createItem(socket, item.iid);
  const result = addItemToContainer(character, newItem, CONTAINER_INVENTORY, false);

  if (result === null) {
    return error(socket, 'error__no_space_available');
  }

  setItemAmount(newItem, amount);
  setItemBound(newItem, getItemBound(item));

  reduceItem(character, item, amount);

  cb([getItemAmount(item), result]);
};

export const updateInventory: SocketFunction = async (socket, character, _, cb) => {
  return [emitItems];
};

export default class InventoryModule extends GameModule {
  moduleName = 'Inventory';
  modules = {
    moveItem: setInventoryPosition,
    inventory: getInventory,
    sellItem,
    sellItems,
    splitItem,
    updateInventory,
  };
}
