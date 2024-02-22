import { Item } from '../../interfaces';
import { User } from '../../components/classes';
import {
  getItemAmount,
  getItemBase,
  getItemBound,
  getItemLocation,
  getItemPosition,
  getItemSizes,
  getItemType,
  increaseItemAmount,
  nonStackItemTypes,
  reduceItem,
  removeItem,
  setItemLocation,
  setItemPosition,
} from './itemSystem';

export interface Container {
  locations: number[];
  rows: number;
  rowLength: number;
}

export function addItemToContainer(character: User, item: Item, container: Container, stack = true) {
  const height = getItemSizes(item).height;
  const width = getItemSizes(item).width;
  const uids = Object.keys(character.items);
  const base = getItemBase(item.iid);

  const validItemUIDs = container.locations.reduce((validUIDs, location) => {
    validUIDs.push(...Object.values(character.containers[location] ?? []));

    return validUIDs;
  }, [] as string[]);

  if (stack && !nonStackItemTypes.includes(base.type)) {
    const matchingItemIID = validItemUIDs.find((uid) => {
      const _item = character.items[uid];
      return _item.iid === item.iid && getItemBound(_item) === getItemBound(item);
    });

    if (matchingItemIID) {
      const amount = getItemAmount(item);

      increaseItemAmount(character.items[matchingItemIID], amount);
      removeItem(character, item);

      return character.items[matchingItemIID];
    }
  }

  let newLocation: [number, number] = [-1, 0];
  let isValidPosition = false;

  for (let locationIdx = 0; locationIdx < container.locations.length; locationIdx++) {
    const location = container.locations[locationIdx];
    const positions: number[] = Object.entries(character.containers[location] ?? {}).reduce((pos, [position, uid]) => {
      const _item = character.items[uid];
      const size = getItemSizes(_item);

      for (var h = 0; h < size.height; h++) {
        for (var w = 0; w < size.width; w++) {
          pos.push(Number(position) + w + h * container.rowLength);
        }
      }

      return pos;
    }, [] as number[]);

    for (let i = 0; i < container.rows * container.rowLength; i++) {
      isValidPosition = true;

      for (let h = 0; h < height; h++) {
        for (let w = 0; w < width; w++) {
          isValidPosition = isValidPosition && !positions.includes(i + w + h * container.rowLength);

          const invalidVertical = i + width + height * container.rowLength > (container.rows + 1) * container.rowLength;
          const invalidHorizontal = (i % container.rowLength) + width > container.rowLength;

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

      if (isValidPosition) {
        newLocation = [location, i];
        break;
      }
    }

    if (isValidPosition) {
      break;
    }
  }

  if (!isValidPosition) {
    return null;
  }

  setItemLocation(item, newLocation[0]);
  setItemPosition(item, newLocation[1]);

  if (character.containers[newLocation[0]] === undefined) {
    character.containers[newLocation[0]] = {};
  }

  character.containers[newLocation[0]][newLocation[1]] = item.uid;
  character.items[item.uid] = item;

  return item;
}

export function doesContainerHaveSpace(character: User, item: Item, container: Container) {
  const height = getItemSizes(item).height;
  const width = getItemSizes(item).width;
  const uids = Object.keys(character.items);

  let isValidPosition = false;

  for (let locationIdx = 0; locationIdx < container.locations.length; locationIdx++) {
    const location = container.locations[locationIdx];
    const positions: number[] = [];

    for (let i = 0; i < uids.length; i++) {
      const uid = uids[i];
      const _item = character.items[uid];

      if (getItemLocation(_item) !== location) {
        continue;
      }

      if (!nonStackItemTypes.includes(getItemType(item)) && _item.iid === item.iid && getItemBound(item) === getItemBound(_item)) {
        return true;
      }

      const size = getItemSizes(_item);
      const position = getItemPosition(_item);

      for (var h = 0; h < size.height; h++) {
        for (var w = 0; w < size.width; w++) {
          positions.push(position + w + h * container.rowLength);
        }
      }
    }

    for (let i = 0; i < container.rows * container.rowLength; i++) {
      isValidPosition = true;

      for (let h = 0; h < height; h++) {
        for (let w = 0; w < width; w++) {
          isValidPosition = isValidPosition && !positions.includes(i + w + h * container.rowLength);

          const invalidVertical = i + width + height * container.rowLength > (container.rows + 1) * container.rowLength;
          const invalidHorizontal = (i % container.rowLength) + width > container.rowLength;

          if (invalidVertical || invalidHorizontal) {
            isValidPosition = false;
          }

          if (!isValidPosition) {
            break;
          }
        }
      }

      if (isValidPosition) {
        return true;
      }
    }
  }

  return isValidPosition;
}

export function removeItemFromItsContainer(character: User, item: Item) {
  const currentLocation = getItemLocation(item);
  const currentPosition = getItemPosition(item);

  delete character.containers[currentLocation]?.[currentPosition];
}
