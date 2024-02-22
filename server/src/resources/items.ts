import { ItemBase } from '../interfaces';
import { IConfig } from 'config';

interface IItem {
  [name: string]: number;
}

export interface ItemBaseData {
  [iid: number]: ItemBase;
}

interface Set {
  [setId: number]: {
    total: number;
    bonus: {
      [amount: number]: number[];
    };
  };
}

export type ItemId = number;
export let Item: IItem = {};
export let Items: ItemBaseData = {};
export let SETS: Set = {};
export let ITEM_TYPES: { [key: string]: any } = {};

export default function itemLoader(config: IConfig) {
  Item = config.get('Items.Item');
  Items = config.get('Items.Items');
  SETS = config.get('Items.Sets');
  ITEM_TYPES = config.get('Items.Types');
}

export function serverLoaderItems(config: IConfig) {
  return {
    Items: config.get('Items.Items') as ItemBaseData,
    Avatars: config.get('Items.Avatars'),
  };
}
