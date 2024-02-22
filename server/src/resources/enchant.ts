import { IConfig } from 'config';
import { ItemType } from '../enums';

interface Enchant {
  cost: number;
  types: ItemType[];
  stones: number[];
}

export let Enchant: Enchant = {
  cost: 0,
  types: [],
  stones: [],
};

export default function enchantLoader(config: IConfig) {
  Enchant = config.get('Enchant');
}
