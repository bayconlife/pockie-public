import { Callback, SocketFunction } from '../../types';
import { CustomSocket, Item } from '../../interfaces';
import { ItemLocations } from '../../enums';
import { error, errorInvalidItem, errorInvalidLocation } from '../kernel/errors';
import {
  addItemToLocation,
  createItem,
  emitItems,
  getItem,
  getItemAmount,
  getItemLocation,
  getItemType,
  itemSwap,
  reduceItem,
  setItemLocation,
} from './itemSystem';
import { emitStones } from '../character/character';
import { GEMS } from '../../resources/gems';
import { calculateStatsV2 } from '../character/stats';
import { isItemEquipped } from './equip';
import { addItem, splitItem } from './inventory';
import { GameModule } from '../../components/classes';
import { createReduceItemPatch, createSetItemLocationPatch, createSwapItemPatch } from './patches/inventoryPatch';
import { createAddHolePatch } from './patches/gemPatches';
import { emitItemPatches } from './patches';

const locations = [ItemLocations.GemCreateSlot, ItemLocations.GemCreateSlotTalisman, ItemLocations.GemRemove];

function createHole(item: Item) {
  if (item.props.gems === undefined) {
    item.props.gems = [];
  }

  item.props.gems.push(null);
}

const gemCreateHole: SocketFunction = async (socket, character, _, cb) => {
  if (!(ItemLocations.GemCreateSlot in character.locations)) {
    return error(socket, 'error__required_location_is_empty');
  }

  if (character.stones < GEMS.cost) {
    return error(socket, 'error__invalid_stones');
  }

  const item = getItem(character, character.locations[ItemLocations.GemCreateSlot]);

  if (item === undefined) {
    return errorInvalidItem(socket);
  }

  const talisman = getItem(character, character.locations[ItemLocations.GemCreateSlotTalisman]);
  const gemHoleCount = (item.props.gems ?? []).length;

  if (gemHoleCount >= GEMS.maxHoles[getItemType(item)]) {
    return error(socket, 'error__max_gem_holes');
  }

  if (talisman === undefined) {
    character.stones -= GEMS.cost;
    emitStones(socket, character);
  } else {
    emitItemPatches(socket, [createReduceItemPatch(talisman, 1)]);
    reduceItem(character, talisman, 1);
  }

  createHole(item);
  cb(item);
};

const gemInsert: SocketFunction<{ uid: string; gemUID: string }> = async (socket, character, { uid, gemUID }, cb) => {
  const item = getItem(character, uid);

  if (item === undefined) {
    return errorInvalidItem(socket);
  }

  const gem = getItem(character, gemUID);

  if (gem === undefined) {
    return errorInvalidItem(socket);
  }

  if (!(item.props.gems ?? []).includes(null)) {
    return error(socket, 'error__no_open_holes');
  }

  if (getItemLocation(gem) > 10) {
    return error(socket, 'error__gem_must_be_in_inventory');
  }

  if (getItemAmount(gem) > 1) {
    const newGem = createItem(socket, gem.iid);

    gem.core[1] -= 1;

    setItemLocation(newGem, ItemLocations.Socketed);
    character.items[newGem.uid] = newGem;
    item.props.gems[item.props.gems.indexOf(null)] = newGem.uid;
  } else {
    item.props.gems[item.props.gems.indexOf(null)] = gemUID;
    setItemLocation(gem, ItemLocations.Socketed);
  }

  if (isItemEquipped(character, item)) {
    character.stats = calculateStatsV2(socket, character);
  }

  return [emitItems];
};

const gemRemove: SocketFunction = async (socket, character, _, cb) => {
  const item = getItem(character, character.locations[ItemLocations.GemRemove]);

  if (item === undefined) {
    return errorInvalidItem(socket);
  }

  item.props.gems?.forEach((gemUID: string, idx: number) => {
    if (gemUID === null) {
      return;
    }

    const gem = getItem(character, gemUID);

    if (gem === undefined) {
      return;
    }

    if (addItem(character, gem)) {
      item.props.gems[idx] = null;
    }
  });

  if (isItemEquipped(character, item)) {
    character.stats = calculateStatsV2(socket, character);
  }

  return [emitItems];
};

const gemRemoveByUID: SocketFunction<string> = async (socket, character, uid, cb) => {
  const item = getItem(character, uid);

  if (item === undefined) {
    return errorInvalidItem(socket);
  }

  item.props.gems?.forEach((gemUID: string, idx: number) => {
    if (gemUID === null) {
      return;
    }

    const gem = getItem(character, gemUID);

    if (gem === undefined) {
      return;
    }

    if (addItem(character, gem)) {
      item.props.gems[idx] = null;
    }
  });

  if (isItemEquipped(character, item)) {
    character.stats = calculateStatsV2(socket, character);
  }

  return [emitItems];
};

const gemSetItem: SocketFunction<{ uid: string; location: number }> = async (socket, character, { uid, location }, cb) => {
  if (!locations.includes(location)) {
    return errorInvalidLocation(socket);
  }

  const item = getItem(character, uid);

  if (item === undefined) {
    return errorInvalidItem(socket);
  }

  if (location === ItemLocations.GemCreateSlotTalisman && !GEMS.talismans.includes(item.iid)) {
    return error(socket, 'error__invalid_item_for_location');
  }

  if ((location === ItemLocations.GemCreateSlot || location === ItemLocations.GemRemove) && !(getItemType(item) in GEMS.maxHoles)) {
    return error(socket, 'error__invalid_item_for_location');
  }

  if (location in character.locations) {
    itemSwap(character, item, character.items[character.locations[location]]);
    emitItemPatches(socket, [createSwapItemPatch(item, character.items[character.locations[location]])]);
  } else {
    addItemToLocation(socket, character, item, location);
    emitItemPatches(socket, [createSetItemLocationPatch(item, location)]);
  }
};

export default class GemModule extends GameModule {
  moduleName = 'Gems';
  modules = {
    gemCreateHole,
    gemInsert,
    gemRemove,
    gemRemoveByUID,
    gemSetItem,
  };
}
