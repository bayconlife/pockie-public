import { Callback, SocketFunction } from '../../types';
import { CustomSocket, Item } from '../../interfaces';
import { error } from '../kernel/errors';
import {
  addItemToLocation,
  createItem,
  emitItems,
  getItem,
  getItemType,
  getItemValue,
  hasItem,
  itemSwap,
  reduceItem,
  setItemLocation,
} from './itemSystem';
import { ItemLocations, ItemType } from '../../enums';
import { SYNTHESIS_BY_TYPE, fixedSynthesis, levelUpRates, randomSynthesis } from '../../resources/synthesis';
import { randomInt } from '../../components/random';
import { addLines } from '../drop/drops';
import { GameModule } from '../../components/classes';
import pubSub, { onRequestLoginServerData } from '../kernel/pubSub';
import { updatePetToMatchLevel } from './pets';
import { createSetItemLocationPatch, createSwapItemPatch } from './patches/inventoryPatch';
import { emitItemPatches } from './patches';

const equippableItemTypes = [
  ItemType.Belt,
  ItemType.Weapon,
  ItemType.Gloves,
  ItemType.Ring,
  ItemType.Amulet,
  ItemType.Helm,
  ItemType.Body,
  ItemType.Shoes,
];
const flatMainValueTypes = [...equippableItemTypes, ItemType.Avatar, ItemType.Pet];

const MODULE_NAME = 'Synthesis';

onRequestLoginServerData(MODULE_NAME, (config) => ({
  synthesisRecipes: randomSynthesis,
}));

function _minSubValue(item: Item) {
  return _rollSubValue(8, item);
}

function _maxSubValue(item: Item) {
  return _rollSubValue(12, item);
}

function _rollSubValue(roll: number, item: Item) {
  if (equippableItemTypes.includes(getItemType(item))) {
    return (roll / 100) * (1 + v[item.props?.lines?.length ?? 0]);
  }

  return (roll / 100) * getItemValue(item.iid);
}

function _getSubValue(item: Item) {
  return _rollSubValue(randomInt(8, 12), item);
}

function _calculateValue(mainValue: number, subValue: number) {
  const temp1 = mainValue - 2 > 0 ? mainValue - 2 : 0;
  const temp2 = mainValue - 3 > 0 ? mainValue - 3 : 0;

  let value = Math.max(Math.pow(mainValue, 2) + subValue - Math.pow(temp1, 2) + Math.pow(temp2, 2), 0);
  value = Math.floor(Math.max(Math.pow(value, 0.5) * 10, 0));

  return value;
}

function _getTotalValue(main: Item, first: Item, second: Item) {
  let mainValue = getItemValue(main.iid);

  if (equippableItemTypes.includes(getItemType(main))) {
    return mainValue;
  }

  return _calculateValue(mainValue / 10, _getSubValue(first) + _getSubValue(second));
}

function _getRange(main: Item, first: Item, second: Item) {
  let mainValue = getItemValue(main.iid);

  // if ([ItemType.Avatar, ItemType.Pet].includes(getItemType(main.iid))) {
  //   return [mainValue, mainValue];
  // }

  const isMainEquippable = equippableItemTypes.includes(getItemType(main));
  const isFirstEquippable = equippableItemTypes.includes(getItemType(first));
  const isSecondEquippable = equippableItemTypes.includes(getItemType(second));

  if (isMainEquippable) {
    mainValue = v[Math.min(main.props?.lines?.length ?? 0, v.length - 1)] / 10;
  } else {
    mainValue /= 10;
  }

  let minSubTotal = 0;
  let maxSubTotal = 0;

  minSubTotal += isMainEquippable ? _minLineValue(first) : _minSubValue(first);
  maxSubTotal += isMainEquippable ? _maxLineValue(first) : _maxSubValue(first);

  minSubTotal += isMainEquippable ? _minLineValue(second) : _minSubValue(second);
  maxSubTotal += isMainEquippable ? _maxLineValue(second) : _maxSubValue(second);

  return [_calculateValue(mainValue, minSubTotal), _calculateValue(mainValue, maxSubTotal)];
}

const v = [14, 22, 31, 39, 46];

function _minLineValue(item: Item) {
  return _rollLineValue(8, item);
}

function _maxLineValue(item: Item) {
  return _rollLineValue(12, item);
}

function _rollLineValue(roll: number, item: Item) {
  let value = 1;

  if (item.props?.lines === undefined && !equippableItemTypes.includes(getItemType(item))) {
    value = getItemValue(item.iid);
  } else if (item.props?.lines) {
    value = 1 + v[item.props.lines.length];
  }

  return (roll / 100) * value;
}

function _getLineValue(item: Item) {
  return _rollLineValue(randomInt(8, 12), item);
}

function _getRandomPropCount(main: Item, first: Item, second: Item) {
  const mainValue = v[Math.min(main.props?.lines?.length ?? 0, v.length - 1)] / 10;
  const subTotal = _getLineValue(first) + _getLineValue(second);
  const temp1 = mainValue - 2 > 0 ? mainValue - 2 : 0;
  const temp2 = mainValue - 3 > 0 ? mainValue - 3 : 0;

  let newValue = Math.max(Math.pow(mainValue, 2) + subTotal - Math.pow(temp1, 2) + Math.pow(temp2, 2), 0);
  newValue = Math.ceil(Math.max(Math.pow(newValue, 0.5) * 10, 0));

  let props = 0;

  v.forEach((value, idx) => {
    if (newValue >= value) {
      props = idx;
    }
  });

  return props;
}

const synthesisCreate: SocketFunction = async (socket, character, data, cb) => {
  if (!(20 in character.locations && 21 in character.locations && 22 in character.locations)) {
    return error(socket, 'Not all slots filled.');
  }

  if (23 in character.locations) {
    return error(socket, 'Take item out first.');
  }

  const main = getItem(character, character.locations[20]);
  const first = getItem(character, character.locations[21]);
  const second = getItem(character, character.locations[22]);

  if (main === undefined || first === undefined || second === undefined) {
    return error(socket, 'Items in location are not in item list.');
  }

  if (
    (main.props?.gems ?? []).some((uid: any) => uid !== null) ||
    (first.props?.gems ?? []).some((uid: any) => uid !== null) ||
    (second.props?.gems ?? []).some((uid: any) => uid !== null)
  ) {
    return error(socket, 'Remove gems first.');
  }

  let createRandomItem = true;
  let lookup = getItemType(main);
  let item = createItem(socket, 150319);

  if (main.iid in fixedSynthesis) {
    lookup = main.iid;
  }

  function lineMatch(line: number[], first: number, second: number) {
    return (line[0] === first && line[1] === second) || (line[0] === second && line[1] === first);
  }

  if (main.iid in fixedSynthesis) {
    const match = fixedSynthesis[main.iid].find((line) => lineMatch(line, first.iid, second.iid));

    if (match !== undefined) {
      if (match[3] === undefined || (match[3] !== undefined && randomInt(0, 99) < match[3])) {
        item = createItem(socket, match[2]);
      } else {
        delete character.locations[20]; // Prevent item from being deleted below
        item = main;
      }

      createRandomItem = false;
    }
  }

  if (createRandomItem && lookup in levelUpRates && first.iid === main.iid && second.iid === main.iid) {
    const rate = main.props.level in levelUpRates[lookup] ? levelUpRates[lookup][main.props.level ?? 0] : 0;

    if (randomInt(0, 99) < rate) {
      main.props.level += 1;

      if (lookup === ItemType.Pet) {
        updatePetToMatchLevel(main);
      }
    }

    delete character.locations[20]; // Prevent item from being deleted below
    item = main;
    createRandomItem = false;
  }

  if (createRandomItem && lookup in fixedSynthesis) {
    const match = fixedSynthesis[lookup].find((line) => lineMatch(line, first.iid, second.iid));

    if (match !== undefined) {
      item = createItem(socket, match[2]);
      createRandomItem = false;
    }
  }

  if (createRandomItem && lookup in SYNTHESIS_BY_TYPE) {
    let value = _getTotalValue(main, first, second);

    for (let i = value; i > 0; i--) {
      if (i in SYNTHESIS_BY_TYPE[lookup]) {
        item = createItem(socket, SYNTHESIS_BY_TYPE[lookup][i][randomInt(0, SYNTHESIS_BY_TYPE[lookup][i].length - 1)]);
        createRandomItem = false;

        break;
      }
    }
  }

  if (createRandomItem) {
    let value = _getTotalValue(main, first, second);

    for (let i = value; i > 0; i--) {
      if (i in randomSynthesis) {
        item = createItem(socket, randomSynthesis[i][randomInt(0, randomSynthesis[i].length - 1)]);

        break;
      }
    }
  }

  if (equippableItemTypes.includes(getItemType(item))) {
    addLines(socket, item, _getRandomPropCount(main, first, second));
  }

  setItemLocation(item, 23);

  character.items[item.uid] = item;
  character.locations[23] = item.uid;

  [20, 21, 22].forEach((location) => reduceItem(character, character.items[character.locations[location]], 1));

  return [emitItems];
};

const synthesisRecipeName: SocketFunction = async (socket, character, data, cb) => {
  if (!(20 in character.locations && 21 in character.locations && 22 in character.locations)) {
    cb({ item: '', range: [0, 0] });
    return;
  }

  const main = getItem(character, character.locations[20]);
  const first = getItem(character, character.locations[21]);
  const second = getItem(character, character.locations[22]);

  if (main === undefined || first === undefined || second === undefined) {
    return error(socket, 'Items in location are not in item list.');
  }

  let item: number | string = 150000;
  let lookup = getItemType(main);

  if (lookup in levelUpRates && first.iid === main.iid && second.iid === main.iid) {
    const rate = main.props.level in levelUpRates[lookup] ? levelUpRates[lookup][main.props.level ?? 0] : 0;

    item = `[[${lookup} +${main.props.level + 1} (${rate}%)`;
  }

  if (main.iid in fixedSynthesis) {
    lookup = main.iid;
  }

  if (lookup in fixedSynthesis) {
    function lineMatch(line: number[], first: number, second: number) {
      return (line[0] === first && line[1] === second) || (line[0] === second && line[1] === first);
    }

    const match = fixedSynthesis[lookup].find((line) => lineMatch(line, first.iid, second.iid));

    if (match !== undefined) {
      return cb({ item: match[2], rate: match[3] });
    }
  }

  if (item === 150000 && lookup in equippableItemTypes) {
    item = `[[random__${lookup}]]`;
  }

  cb({ item, range: _getRange(main, first, second) });
};

const synthesisSetItem: SocketFunction = async (socket, character, data, cb) => {
  const { uid, location }: { uid: string; location: number } = data;
  const item = getItem(character, uid);

  if (item === undefined) {
    return error(socket, 'Item does not exist.');
  }

  if (![20, 21, 22].includes(location)) {
    return error(socket, 'Wrong location given for synthesis.');
  }

  if (location in character.locations && character.locations[location] !== '') {
    itemSwap(character, character.items[uid], character.items[character.locations[location]]);
    emitItemPatches(socket, [createSwapItemPatch(item, character.items[character.locations[location]])]);
  } else {
    addItemToLocation(socket, character, character.items[uid], location);
    emitItemPatches(socket, [createSetItemLocationPatch(item, location)]);
  }
};

export default class SynthesisModule extends GameModule {
  moduleName = MODULE_NAME;
  modules = {
    synthesisCreate,
    synthesisRecipeName,
    synthesisSetItem,
  };
}
