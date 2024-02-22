import { IConfig } from 'config';
import { Item } from '../interfaces';

interface Shop {
  [name: string]: number;
}

interface ShopItem {
  item: number;
  price: number;
}

interface Shops {
  [id: number]: {
    type?: number;
    refreshCost: number;
    amount: number;
    items: ShopItem[];
  };
}

export let Shop: Shop = {};
export let Shops: Shops = {};

export default function shopLoader(config: IConfig) {
  Shop = config.get('Shop');
  Shops = config.get('Shops');
}
