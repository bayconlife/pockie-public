import { SocketFunction, UID } from '../../types';
import { GameModule } from '../../components/classes';
import { addItemToLocation, getItem, getItemAmount, getItemBase, getItemInLocation, itemSwap, reduceItem } from './itemSystem';
import { error, errorInvalidItem, errorInvalidLocation } from '../kernel/errors';
import { ItemLocations, ItemType } from '../../enums';
import { randomInt } from '../../components/random';
import { addLines } from '../drop/drops';
import { createReduceItemPatch, createSetItemLocationPatch, createSwapItemPatch, createUpdateItemPatch } from './patches/inventoryPatch';
import { emitItemPatches } from './patches';

const IMPRESS_ITEM_TYPES = [
  ItemType.Weapon,
  ItemType.Gloves,
  ItemType.Ring,
  ItemType.Amulet,
  ItemType.Helm,
  ItemType.Body,
  ItemType.Belt,
  ItemType.Shoes,
];

const getImpressRate: SocketFunction = async (socket, character, _, cb) => {
  const i = getItemInLocation(character, ItemLocations.Impress_Item);
  const blade = getItemInLocation(character, ItemLocations.Impress_Blade);
  const crystal = getItemInLocation(character, ItemLocations.Impress_Crystal);
  let rate =
    !!i && i.props.lines?.length < 4
      ? (socket.getConfig().Impress.CONFIG.rates.find((line) => i.props.level >= line[0] && i.props.level <= line[1]) ?? [0, 0, 0, 0])[2]
      : 0;
  let crystalsUsed = 0;

  if (crystal) {
    while (rate < 100 && crystalsUsed < getItemAmount(crystal)) {
      rate += crystal.props.rate;
      crystalsUsed++;
    }
  }

  if (!blade || !i || (!!i && i.props.lines?.length >= 4)) {
    rate = 0;
  }

  cb(rate);
};

const impressAttempt: SocketFunction = async (socket, character, _, cb) => {
  const item = getItemInLocation(character, ItemLocations.Impress_Item);
  const blade = getItemInLocation(character, ItemLocations.Impress_Blade);
  const crystal = getItemInLocation(character, ItemLocations.Impress_Crystal);

  if (!item || !blade) {
    return error(socket, 'error__missing_required_items');
  }

  if (item.props.lines?.length >= 4) {
    return error(socket, 'error__max_affixes');
  }

  if (item.props.level > blade.props.maxLevel) {
    return error(socket, 'error__blade_too_low_level');
  }

  let rate = (socket.getConfig().Impress.CONFIG.rates.find((line) => item.props.level >= line[0] && item.props.level <= line[1]) ?? [
    0, 0, 0, 0,
  ])[2];
  let crystalsUsed = 0;

  if (crystal) {
    while (rate < 100 && crystalsUsed < getItemAmount(crystal)) {
      rate += crystal.props.rate;
      crystalsUsed++;
    }
  }

  const patches: any[] = [createReduceItemPatch(blade, 1)];

  if (randomInt(0, 99) < rate) {
    addLines(socket, item, 1);
  }

  reduceItem(character, blade, 1);

  if (crystal) {
    patches.push(createReduceItemPatch(crystal, crystalsUsed));
    reduceItem(character, crystal, crystalsUsed);
  }

  cb(item);

  emitItemPatches(socket, patches);
};

const impressSetItem: SocketFunction<UID> = async (socket, character, uid, cb) => {
  const item = getItem(character, uid);

  if (item === undefined) {
    return errorInvalidItem(socket);
  }

  const base = getItemBase(item.iid);
  let location = ItemLocations.Impress_Item;

  if (base.type === ItemType.Impress) {
    location = ItemLocations.Impress_Blade;

    const i = getItemInLocation(character, ItemLocations.Impress_Blade);

    if (!!i && i.props.level > item.props.maxLevel) {
      return error(socket, 'error__impress_blade_too_low_level');
    }
  } else if (base.type === ItemType.ImpressRate) {
    location = ItemLocations.Impress_Crystal;

    const i = getItemInLocation(character, ItemLocations.Impress_Blade);

    if (!!i && i.props.level > item.props.maxLevel) {
      return error(socket, 'error__impress_stone_too_low_level');
    }
  } else if (IMPRESS_ITEM_TYPES.includes(base.type)) {
    location = ItemLocations.Impress_Item;

    const b = getItemInLocation(character, ItemLocations.Impress_Blade);

    if (!!b && item.props.level > b.props.maxLevel) {
      return error(socket, 'error__item_too_high_level_for_blade');
    }

    const s = getItemInLocation(character, ItemLocations.Impress_Crystal);

    if (!!s && item.props.level > s.props.maxLevel) {
      return error(socket, 'error__item_too_high_level_for_stone');
    }
  } else {
    return errorInvalidLocation(socket);
  }

  if (location in character.locations) {
    itemSwap(character, item, character.items[character.locations[location]]);
    emitItemPatches(socket, [createSwapItemPatch(item, character.items[character.locations[location]])]);
  } else {
    addItemToLocation(socket, character, item, location);
    emitItemPatches(socket, [createSetItemLocationPatch(item, location)]);
  }

  const i = getItemInLocation(character, ItemLocations.Impress_Item);
  const blade = getItemInLocation(character, ItemLocations.Impress_Blade);
  const crystal = getItemInLocation(character, ItemLocations.Impress_Crystal);
  let rate =
    !!i && i.props.lines?.length < 4
      ? (socket.getConfig().Impress.CONFIG.rates.find((line) => i.props.level >= line[0] && i.props.level <= line[1]) ?? [0, 0, 0, 0])[2]
      : 0;
  let crystalsUsed = 0;

  if (crystal) {
    while (rate < 100 && crystalsUsed < getItemAmount(crystal)) {
      rate += crystal.props.rate;
      crystalsUsed++;
    }
  }

  if (!blade || !i || (!!i && i.props.lines?.length >= 4)) {
    rate = 0;
  }

  cb(rate);
};

export default class ImpressModule extends GameModule {
  moduleName = 'Impress';
  modules = {
    getImpressRate,
    impressSetItem,
    impressAttempt,
  };
}
