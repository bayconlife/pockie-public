import { IConfig } from 'config';
import { ItemId } from './items';

export type BasicCardRow = [ItemId, number][];

interface Basic {
  [id: string]: BasicCardRow;
}

interface Cards {
  valhalla: Basic;
  exploration: Basic;
  arena: {
    [rank: number]: [ItemId, number][][];
  };
}

export let CARDS: Cards = {
  valhalla: {},
  exploration: {},
  arena: {},
};

export default function cardLoader(config: IConfig) {
  CARDS = config.get('Cards');
}
