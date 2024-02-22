import { t } from 'i18next';
import { ItemType } from '../enums';
import { Core, IItem } from '../slices/inventorySlice';
import store from '../store';
import { ASSET_CONFIG } from '../util/assetConfig';
import { AtLeastTS35 } from '@reduxjs/toolkit/dist/tsHelpers';

export function getItemAmount(item: IItem) {
  return item.core?.[Core.AMOUNT] ?? 1;
}

export function getAvatarPose(item: IItem) {
  return `poses/${ASSET_CONFIG.ITEMS[item.iid]?.[0].substring(8)}.png`;
}

export function getItem(idx: number) {
  // Not ideal to do it this way but it does reduce the amount of hooks just for lookup data.
  return store.getState().inventory.items[idx];
}

export function getItemLocation(item: IItem) {
  return item.core?.[Core.LOCATION] ?? -1;
}

export function getItemName(iid: number) {
  return t(`item__${iid}--name`);
}

export function getItemPosition(item: IItem) {
  return item.core?.[Core.POSITION] ?? -1;
}

export function getItemPrice(item: IItem) {
  return ASSET_CONFIG.ITEMS[item.iid]?.[2] ?? 1;
}

export function getItemType(item: IItem): number {
  return item.core?.[Core.TYPE] ?? ItemType.Missing;
}

export const getItemSize = (item: IItem) => {
  if (item.core === undefined) {
    return {
      width: 1,
      height: 1,
    };
  }

  switch (item.core[Core.SIZE]) {
    case 6:
      return {
        width: 2,
        height: 3,
      };
    case 4:
      return {
        width: 2,
        height: 2,
      };
    case 1:
    default:
      return {
        width: 1,
        height: 1,
      };
  }
};

type AtLeast<T, K extends keyof T> = Partial<IItem> & Pick<T, K>;

export function getItemSrc(item: AtLeast<IItem, 'iid'>) {
  const src = ASSET_CONFIG.ITEMS[item.iid]?.[0];

  return !src ? 'icons/items/tasks/1.png' : `icons/items/${src}.png`;
}

export function getItemValue(item: IItem) {
  return ASSET_CONFIG.ITEMS[item.iid]?.[1] ?? 0;
}

export function isItemBound(item: IItem) {
  return item.core?.[Core.BOUND] === 1 ?? true;
}

export function isItemType(item: IItem, type: ItemType) {
  return getItemType(item) === type;
}

export function setItemType(item: AtLeast<IItem, 'iid'>, type: ItemType) {
  if (item.core === undefined) {
    item.core = [-1, -1, -1, -1, -1, -1];
    item.core[Core.BOUND] = 1;
  }

  item.core[Core.TYPE] = type;

  return item;
}
