import { Items, ItemId, SETS } from '../../resources/items';
import * as crypto from 'crypto';
import { CustomSocket, Item } from '../../interfaces';
import { Callback, SocketFunction, UID } from '../../types';
import { ItemLocations, ItemType } from '../../enums';
import { GameModule, User } from '../../components/classes';
import { addItem, getNextPosition } from './inventory';
import { error } from '../kernel/errors';
import { Pet } from '../../resources/pet';
import { calculateStatsV2, emitStats } from '../character/stats';
import { isItemEquipped } from './equip';
import { GEMS } from '../../resources/gems';
import { onRequestLoginData, onRequestLoginServerData } from '../kernel/pubSub';
import { getMonster } from '../../resources/monsters';
import { Container, removeItemFromItsContainer } from './container';
import { emitItemPatches } from './patches';
import { createReduceItemPatch, createRemoveItemPatch, createSwapItemPatch, createUpdateItemPatch } from './patches/inventoryPatch';

const MODULE_NAME = 'Items';

enum Core {
  BOUND,
  AMOUNT,
  LOCATION,
  POSITION,
  TYPE,
  SIZE,
}

onRequestLoginData(MODULE_NAME, (character) => ({
  items: {
    items: character.items,
    locations: character.locations,
    containers: character.containers,
  },
}));

onRequestLoginServerData(MODULE_NAME, (config) => ({
  sets: SETS,
}));

function addTypeProps(iid: ItemId) {
  switch (getItemBase(iid).type) {
    case ItemType.Avatar:
      return { level: 0 };
    case ItemType.Amulet:
    case ItemType.Belt:
    case ItemType.Weapon:
    case ItemType.Gloves:
    case ItemType.Helm:
    case ItemType.Body:
    case ItemType.Shoes:
      return { stats: {} };
    case ItemType.Pet:
      return {
        level: 0,
        exp: 0,
        needed: Pet.exp[0],
        skills: {
          aura: [],
          active: [],
          passive: [],
          unlocked: [2, 2, 2],
          available: 0,
          locks: [],
        },
      };
    default:
      return {};
  }
}

export const equipableItemTypes = [
  ItemType.Belt,
  ItemType.Weapon,
  ItemType.Gloves,
  ItemType.Ring,
  ItemType.Amulet,
  ItemType.Helm,
  ItemType.Body,
  ItemType.Shoes,
  ItemType.Pet,
];

export const nonStackItemTypes = [...equipableItemTypes, ItemType.Avatar, ItemType.Pet];

export function addItemToLocation(socket: CustomSocket, character: User, item: Item, newLocation: ItemLocations) {
  if (character.locations[newLocation] !== undefined) {
    return false;
  }

  const itemWasEquipped = isItemEquipped(character, item);

  removeItemFromItsLocation(character, item);
  removeItemFromItsContainer(character, item);

  setItemLocation(item, newLocation);

  character.locations[newLocation] = item.uid;

  if (itemWasEquipped) {
    character.stats = calculateStatsV2(socket, character);
  }

  return true;
}

export function createItemOld(iid: ItemId, isBound = 1): Item {
  const base = getItemBase(iid);
  const core: Partial<Item['core']> = [];

  core[Core.BOUND] = isBound;
  core[Core.AMOUNT] = 1;
  core[Core.LOCATION] = -1;
  core[Core.POSITION] = 0;
  core[Core.TYPE] = base.type;
  core[Core.SIZE] = base.size ?? 1;

  return {
    uid: crypto.randomUUID(),
    iid,
    core: core as Item['core'],
    props: {
      ...base.innate,
      ...addTypeProps(iid),
    },
  };
}

export function createItem(socket: CustomSocket, iid: ItemId, isBound = 1): Item {
  const base = getItemBaseFromSocketConfig(socket, iid);
  const core: Partial<Item['core']> = [];

  core[Core.BOUND] = isBound;
  core[Core.AMOUNT] = 1;
  core[Core.LOCATION] = -1;
  core[Core.POSITION] = 0;
  core[Core.TYPE] = base.type;
  core[Core.SIZE] = base.size ?? 1;

  return {
    uid: crypto.randomUUID(),
    iid,
    core: core as Item['core'],
    props: {
      ...base.innate,
      ...addTypeProps(iid),
    },
  };
}

export function createMonsterItem(socket: CustomSocket, monsterId: number): Item {
  const monster = socket.getConfig().Monsters.getMonster(monsterId);
  const core: Partial<Item['core']> = [];

  core[Core.BOUND] = 1;
  core[Core.AMOUNT] = 1;
  core[Core.LOCATION] = -1;
  core[Core.POSITION] = 0;
  core[Core.TYPE] = 500;
  core[Core.SIZE] = 2;

  return {
    uid: crypto.randomUUID(),
    iid: monsterId,
    core: core as Item['core'],
    props: {
      avatar: monster.avatar,
    },
  };
}

export function createItemUpdate(iid: ItemId) {
  const base = getItemBase(iid);

  return {
    props: {
      ...base.innate,
      ...addTypeProps(iid),
    },
  };
}

export async function emitItems(socket: CustomSocket, character: User) {
  socket.emit('updateItems', {
    items: character.items,
    locations: character.locations,
    containers: character.containers,
  });
}

export function findItemsByIIDInContainer(character: User, iid: number, container: Container) {
  return Object.values(character.items).filter((item) => {
    if (item.iid.toString() !== iid.toString()) {
      return false;
    }

    if (!container.locations.includes(getItemLocation(item))) {
      return false;
    }

    return true;
  });
}

export function getItem(character: User, uid: UID) {
  return uid in character.items ? character.items[uid] : undefined;
}

export function getItemsThatMatchIID(character: User, iid: number) {
  return Object.keys(character.items)
    .filter((k) => character.items[k].iid === iid)
    .map((k) => character.items[k]);
}

export function getItemAmount(item: Item) {
  return item.core[Core.AMOUNT];
}

export function getItemBase(iid: ItemId) {
  return iid in Items ? JSON.parse(JSON.stringify(Items[iid])) : { innate: {} };
}

export function getItemBaseFromSocketConfig(socket: CustomSocket, iid: ItemId) {
  return iid in socket.getConfig().Items.Items ? JSON.parse(JSON.stringify(socket.getConfig().Items.Items[iid])) : { innate: {} };
}

export function getItemBound(item: Item) {
  return item.core[Core.BOUND];
}

export function getItemInLocation(character: User, location: ItemLocations) {
  return getItem(character, character.locations[location]);
}

export function getItemLocation(item: Item) {
  return item.core[Core.LOCATION];
}

export function getItemPosition(item: Item) {
  return item.core[Core.POSITION];
}

export function getItemSizes(item: Item) {
  const size = item?.core[Core.SIZE] ? item.core[Core.SIZE] : getItemBase(item.iid).size;

  if (size) {
    switch (size) {
      case 1:
        return { width: 1, height: 1 };
      case 4:
        return { width: 2, height: 2 };
      case 6:
        return { width: 2, height: 3 };
    }
  }

  switch (getItemType(item)) {
    case ItemType.Avatar:
    case ItemType.Gloves:
    case ItemType.Helm:
    case ItemType.Body:
    case ItemType.Belt:
    case ItemType.Shoes:
    case ItemType.Pet:
      return {
        width: 2,
        height: 2,
      };
    case ItemType.Weapon:
      return {
        width: 2,
        height: 3,
      };
    case ItemType.Ring:
    case ItemType.Amulet:
    case ItemType.Etc:
    default:
      return {
        width: 1,
        height: 1,
      };
  }
}

export function getItemType(item: Item) {
  const type = item.core[Core.TYPE];

  return type ? type : getItemBase(item.iid).type;
}

export function getItemValue(iid: ItemId) {
  return getItemBase(iid).value ?? 0;
}

export function hasItem(character: User, uid: string) {
  return uid in character.items;
}

export function increaseItemAmount(item: Item, amount: number) {
  item.core[Core.AMOUNT] += amount;
}

export function isItemType(item: Item, type: ItemType) {
  return getItemType(item) === type;
}

export function isLocationFilled(character: User, location: ItemLocations) {
  return location in character.locations;
}

export function itemSwap(character: User, item: Item, itemToSwapWith: Item) {
  const itemType = getItemType(item);
  const swapType = getItemType(itemToSwapWith);

  // Stack Items
  if (item.iid === itemToSwapWith.iid && !nonStackItemTypes.includes(itemType) && getItemBound(item) === getItemBound(itemToSwapWith)) {
    const amount = getItemAmount(item);

    increaseItemAmount(itemToSwapWith, amount);
    removeItem(character, item);

    return 2;
  }

  if (itemType === swapType) {
    const itemLocation = getItemLocation(item);
    const itemPosition = getItemPosition(item);

    const swapLocation = getItemLocation(itemToSwapWith);
    const swapPosition = getItemPosition(itemToSwapWith);

    setItemLocation(item, swapLocation);
    setItemPosition(item, swapPosition);

    setItemLocation(itemToSwapWith, itemLocation);
    setItemPosition(itemToSwapWith, itemPosition);

    character.locations[itemLocation] = itemToSwapWith.uid;
    character.locations[swapLocation] = item.uid;
    delete character.locations[0];

    if (character.containers[itemLocation]?.[itemPosition]) {
      character.containers[itemLocation][itemPosition] = itemToSwapWith.uid;
    }

    if (character.containers[swapLocation]?.[swapPosition]) {
      character.containers[swapLocation][swapPosition] = item.uid;
    }

    return 1;
  }

  return 0;
}

export function reduceItem(character: User, item: Item, amount: number) {
  if (item === undefined || character.items[item.uid] === undefined) {
    return;
  }

  if (getItemAmount(item) !== undefined) {
    item.core[Core.AMOUNT] -= amount;
  }

  if (item.core[Core.AMOUNT] === undefined || item.core[Core.AMOUNT] <= 0) {
    removeItem(character, item);
  }
}

export function reduceItemsByAmount(character: User, items: Item[], itemsNeeded: number) {
  const patches = [];

  for (let i = items.length - 1; i >= 0; i--) {
    const count = getItemAmount(items[i]);

    if (count >= itemsNeeded) {
      patches.push(createReduceItemPatch(items[i], itemsNeeded));
      reduceItem(character, items[i], itemsNeeded);
    } else {
      itemsNeeded -= count;
      patches.push(createReduceItemPatch(items[i], count));
      reduceItem(character, items[i], count);
    }
  }

  return patches;
}

export function removeItem(character: User, item: Item) {
  if (item === undefined || character.items[item.uid] === undefined) {
    return;
  }

  removeItemFromItsLocation(character, item);
  removeItemFromItsContainer(character, item);

  delete character.items[item.uid];
}

export function removeItemFromItsLocation(character: User, item: Item) {
  const currentLocation = getItemLocation(item);

  delete character.locations[currentLocation];
}

export function setItemAmount(item: Item, amount: number) {
  item.core[Core.AMOUNT] = amount;
}

export function setItemBound(item: Item, bound: number) {
  item.core[Core.BOUND] = bound;
}

export function setItemLocation(item: Item, location: number) {
  item.core[Core.LOCATION] = location;
}

export function setItemPosition(item: Item, position: number) {
  item.core[Core.POSITION] = position;
}

const swapItems: SocketFunction<{ itemUID: string; targetUID: string }> = async (socket, character, { itemUID, targetUID }, cb) => {
  const item = getItem(character, itemUID);
  const targetItem = getItem(character, targetUID);

  if (itemUID === targetUID) {
    return error(socket, 'error__swap_same_uid');
  }

  if (!item || !targetItem) {
    return error(socket, "You don't own one of those items.");
  }

  const isEquipped = isItemEquipped(character, item);
  const isTargetEquipped = isItemEquipped(character, targetItem);

  if (isEquipped && equipableItemTypes.includes(getItemType(targetItem)) && character.items[targetUID].props.level > character.level) {
    return error(socket, "You aren't high enough level to equip this.");
  }

  if (isTargetEquipped && equipableItemTypes.includes(getItemType(item)) && character.items[itemUID].props.level > character.level) {
    return error(socket, "You aren't high enough level to equip this.");
  }

  const swapResult = itemSwap(character, item, targetItem);

  if (swapResult === 0) {
    return error(socket, 'Invalid Swap');
  }

  if (isEquipped || isTargetEquipped) {
    character.stats = calculateStatsV2(socket, character);

    emitStats(socket, character);
  }

  // if (swapResult === 1) {
  //   emitItemPatches(socket, [createSwapItemPatch(item, targetItem)]);
  // } else {
  //   emitItemPatches(socket, [createUpdateItemPatch(targetItem)]);
  // }

  emitItems(socket, character);
};

export function updateItems(socket: CustomSocket, character: User) {
  const ITEMS = socket.getConfig().Items.Items;
  const removeList: Item[] = [];

  Object.keys(character.items).forEach((uid) => {
    const o = character.items[uid];
    const i = createItemUpdate(o.iid);
    const base = getItemBaseFromSocketConfig(socket, o.iid);

    if (!(o.iid in ITEMS)) {
      removeList.push(o);
      return;
    }

    if (!o.core) {
      o.core = [-1, -1, -1, -1, -1, -1];
    }

    o.core[Core.TYPE] = base.type;
    o.core[Core.SIZE] = base.size;

    character.items[uid] = {
      ...o,
      ...i,
      props: {
        ...addTypeProps(o.iid),
        ...o.props,
        ...base.innate,
      },
    };

    if (o.props?.lines) {
      character.items[uid].props.lines = o.props.lines;
    }

    // const gemHoleCount = (character.items[uid].props.gems ?? []).length;

    // if (gemHoleCount > GEMS.maxHoles[character.items[uid].type]) {
    //   console.log('Yo that is bad');
    //   character.items[uid].props.gems?.forEach((gemUID: string, idx: number) => {
    //     if (gemUID === null) {
    //       return;
    //     }

    //     const gem = getItem(character, gemUID);

    //     if (gem === undefined) {
    //       return;
    //     }

    //     addItem(character, gem);

    //     o.props.gems[idx] = null;
    //   });

    //   character.items[uid].props.gems = [];
    // }
  });

  Object.entries(character.locations).forEach(([location, uid]) => {
    if (character.items[uid].core[Core.LOCATION] !== Number(location)) {
      delete character.locations[location];
    }
  });

  Object.entries(character.containers ?? {}).forEach(([location, containerPositions]) =>
    Object.entries(containerPositions).forEach(([position, uid]) => {
      if (character.items[uid] === undefined) {
        delete character.locations[location];
        delete character.containers[Number(location)]?.[Number(position)];
      }
    })
  );

  // removeList.forEach((i) => {
  //   removeItem(character, i);
  // });
}

export default class ItemModule extends GameModule {
  moduleName = MODULE_NAME;
  modules = {
    swapItems,
  };
}
