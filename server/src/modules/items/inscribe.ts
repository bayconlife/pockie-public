import { Callback, SocketFunction } from '../../types';
import { CustomSocket, Item } from '../../interfaces';
import { error, errorInvalidItem } from '../kernel/errors';
import { addItemToLocation, getItem, getItemAmount, getItemType, hasItem, isItemType, itemSwap, reduceItem } from './itemSystem';
import { ItemLocations, ItemType } from '../../enums';
import { emitStones } from '../character/character';
import { inscribe } from '../../resources/inscribe';
import { randomInt } from '../../components/random';
import { Stat } from '../../resources/lines';
import { GameModule } from '../../components/classes';
import { createReduceItemPatch, createSetItemLocationPatch, createSwapItemPatch, createUpdateItemPatch } from './patches/inventoryPatch';
import { emitItemPatches } from './patches';

const inscribeItemTypes = [ItemType.Weapon, ItemType.Belt, ItemType.Body, ItemType.Gloves, ItemType.Helm, ItemType.Shoes];

function _getStatsForLevel(item: Item, level: number) {
  const { percentStat } = inscribe[level];

  if (isItemType(item, ItemType.Weapon)) {
    return [Math.ceil((item.props.attack[0] * percentStat) / 100), Math.ceil((item.props.attack[1] * percentStat) / 100)];
  } else {
    return [Math.ceil((item.props.defense * percentStat) / 100)];
  }
}

const inscribeAttempt: SocketFunction<number> = async (socket, character, amount, cb) => {
  if (amount > 5 || amount < 1) {
    return error(socket, 'You need to choose an amount of seals between 1 and 3.');
  }

  if (!(ItemLocations.Inscribe in character.locations)) {
    return error(socket, 'You must have an item in the inscribe slot first.');
  }

  if (!hasItem(character, character.locations[ItemLocations.Inscribe])) {
    return error(socket, "You don't own the item in the inscribe slot.");
  }

  const item = character.items[character.locations[ItemLocations.Inscribe]];
  const inscribeLevel = item.props.inscribe ?? 0;

  if (inscribe[inscribeLevel] === undefined) {
    return error(socket, 'error__max_inscribe');
  }

  const { chance, cost, failure } = inscribe[inscribeLevel];

  if (character.stones < cost) {
    return error(socket, 'Not enough stones to attempt.');
  }

  let lowSeals = Object.entries(character.items).filter(([key, item]) => item.iid === 161008);
  const totalLowSeals = lowSeals.reduce((sum, [key, item]) => sum + getItemAmount(item), 0);

  if (totalLowSeals < amount) {
    return error(socket, 'Not enough inscription talismans.');
  }

  let result = true;
  let newLevel = inscribeLevel;
  const patches = [];

  if (randomInt(0, 99) <= chance + 3 * amount) {
    newLevel = inscribeLevel + 1;
  } else {
    newLevel = failure;
    result = false;
  }

  if (newLevel > 0) {
    const stats = _getStatsForLevel(item, newLevel - 1);

    if (isItemType(item, ItemType.Weapon)) {
      character.items[item.uid].props.stats['Inscribe_1'] = { stat: Stat.Min_Attack, roll: stats[0] };
      character.items[item.uid].props.stats['Inscribe_2'] = { stat: Stat.Max_Attack, roll: stats[1] };
    } else {
      character.items[item.uid].props.stats['Inscribe_1'] = { stat: Stat.Defense, roll: stats[0] };
    }
  }

  let attempt = 0;
  while (amount > 0) {
    if (lowSeals.length === 0) {
      return;
    }

    //@ts-ignore
    const [uid, seal] = lowSeals.pop();
    const used = Math.min(amount, getItemAmount(seal));

    patches.push(createReduceItemPatch(character.items[uid], used));
    reduceItem(character, character.items[uid], used);

    amount -= used;

    attempt++;
    if (attempt >= 5) {
      break;
    }
  }

  item.props.inscribe = newLevel;
  character.stones -= cost;

  cb({
    item,
    result,
    ...inscribe[newLevel],
  });

  emitItemPatches(socket, patches);

  return [emitStones];
};

const inscribeGetInfo: SocketFunction = async (socket, character, data, cb) => {
  if (!(ItemLocations.Inscribe in character.locations)) {
    return error(socket, 'You must have an item in the inscribe slot first.');
  }

  if (!hasItem(character, character.locations[ItemLocations.Inscribe])) {
    return error(socket, "You don't own the item in the inscribe slot.");
  }

  const inscribeLevel = character.items[character.locations[ItemLocations.Inscribe]].props.inscribe ?? 0;

  if (inscribeLevel) cb(inscribe[inscribeLevel]);
};

const inscribeSetItem: SocketFunction<{ uid: string; location: number }> = async (socket, character, { uid, location }, cb) => {
  const item = getItem(character, uid);

  if (item === undefined) {
    return errorInvalidItem(socket);
  }

  if (!inscribeItemTypes.includes(getItemType(character.items[uid]))) {
    return error(socket, 'Wrong item type.');
  }

  if (location in character.locations) {
    itemSwap(character, character.items[uid], character.items[character.locations[location]]);
    emitItemPatches(socket, [createSwapItemPatch(item, character.items[character.locations[location]])]);
  } else {
    addItemToLocation(socket, character, character.items[uid], location);
    emitItemPatches(socket, [createSetItemLocationPatch(item, location)]);
  }

  const inscribeLevel = character.items[character.locations[ItemLocations.Inscribe]].props.inscribe ?? 0;

  cb(inscribe[inscribeLevel]);
};

export default class InscribeModule extends GameModule {
  moduleName = 'Inscribe';
  modules = {
    inscribeAttempt,
    inscribeGetInfo,
    inscribeSetItem,
  };
}
