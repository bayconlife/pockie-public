import { ItemLocations, ItemType } from '../../enums';
import { SocketFunction } from '../../types';
import { error } from '../kernel/errors';
import { addItemToLocation, getItem, getItemType, isItemType, itemSwap, reduceItem } from './itemSystem';
import { Enhance } from '../../resources/enhance';
import { emitStones } from '../character/character';
import { randomInt } from '../../components/random';
import { Stat } from '../../resources/lines';
import { GameModule, User } from '../../components/classes';
import { createSetItemLocationPatch, createSwapItemPatch } from './patches/inventoryPatch';
import { emitItemPatches } from './patches';

const locations = [ItemLocations.Enhance, ItemLocations.EnhanceTalisman];

const enhanceAttempt: SocketFunction = async (socket, character, data, cb) => {
  if (!(ItemLocations.Enhance in character.locations)) {
    return error(socket, 'No item to enhance');
  }

  if (character.stones < 80) {
    return error(socket, 'Not enough stones');
  }

  const item = getItem(character, character.locations[ItemLocations.Enhance]);

  if (item === undefined) {
    return error(socket, 'Invalid item');
  }

  const talisman = getItem(character, character.locations[ItemLocations.EnhanceTalisman]);
  let success = false;

  if (talisman === undefined) {
    character.stones -= 80;
  } else {
    reduceItem(character, talisman, 1);
  }

  success = enhanceItem(character);
  socket.save(character);

  let level = item.props.enhance ?? 0;
  const valid = level < Enhance.failRate.length;
  const rate = valid ? 100 - Enhance.failRate[level] : 0;

  cb({ rate, success, valid, item });

  return [emitStones];
};

function enhanceItem(character: User) {
  const item = getItem(character, character.locations[ItemLocations.Enhance])!;
  let level = item.props.enhance ?? 0;
  const chance = 100 - Enhance.failRate[level];

  if (chance > randomInt(0, 99)) {
    level += 1;

    if (isItemType(item, ItemType.Weapon)) {
      // const min = Math.ceil(((item.props.attack[0] + item.props.attack[1]) / 2) * (1 + (level * Enhance.weapons) / 100) * 0.9);
      // const max = Math.ceil(((item.props.attack[0] + item.props.attack[1]) / 2) * (1 + (level * Enhance.weapons) / 100) * 1.1);

      const min = Math.ceil((item.props.attack[0] * (level * Enhance.weapons)) / 100);
      const max = Math.ceil((item.props.attack[1] * (level * Enhance.weapons)) / 100);

      character.items[item.uid].props.stats['Enhance_1'] = { stat: Stat.Min_Attack, roll: min };
      character.items[item.uid].props.stats['Enhance_2'] = { stat: Stat.Max_Attack, roll: max };
    } else {
      character.items[item.uid].props.stats['Enhance_1'] = {
        stat: Stat.Max_Hp,
        roll: level * (Enhance.amounts[getItemType(item)][item.props.level] ?? 1),
      };
    }

    character.items[item.uid].props.enhance = level;

    return true;
  }

  return false;
}

const enhanceGetItem: SocketFunction = async (socket, character, _, cb) => {
  const item = getItem(character, character.locations[ItemLocations.Enhance]);

  let level = item ? item.props.enhance ?? 0 : -1;
  const valid = level < Enhance.failRate.length;
  const rate = valid ? 100 - (Enhance.failRate[level] ?? 100) : 0;

  cb({ rate, valid });
};

const enhanceSetItem: SocketFunction<{ uid: string; location: number }> = async (socket, character, { uid, location }, cb) => {
  if (!locations.includes(location)) {
    return error(socket, 'Invalid location');
  }

  const item = getItem(character, uid);

  if (item === undefined) {
    return error(socket, 'Invalid item');
  }

  if (location === ItemLocations.EnhanceTalisman && !Enhance.talismans.includes(item.iid)) {
    return error(socket, 'Cannot put non talisman into that location');
  }

  if (location === ItemLocations.Enhance && !(getItemType(item) in Enhance.amounts)) {
    return error(socket, 'Must put weapon or armor into this location');
  }

  if (location in character.locations) {
    itemSwap(character, item, character.items[character.locations[location]]);
    emitItemPatches(socket, [createSwapItemPatch(item, character.items[character.locations[location]])]);
  } else {
    console.log('Set item');
    addItemToLocation(socket, character, item, location);
    emitItemPatches(socket, [createSetItemLocationPatch(item, location)]);
  }

  let level = item.props.enhance ?? 0;
  const valid = level < Enhance.failRate.length;
  const rate = valid ? 100 - Enhance.failRate[level] : 0;

  cb({ rate, valid });
};

export default class EnhanceModule extends GameModule {
  moduleName = 'Enhance';
  modules = {
    enhanceAttempt,
    enhanceGetItem,
    enhanceSetItem,
  };
}
