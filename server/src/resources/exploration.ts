import { IConfig } from 'config';
import { ItemId } from './items';
import { createItem } from '../modules/items/itemSystem';
import { Item } from '../interfaces';
import { CARDS } from './cards';
import { Key } from 'readline';

interface Exploration {
  starRates: {
    [scene: string]: number;
  };
  starRewards: {
    [scene: string]: ItemId[];
  };
}

interface ExplorationClientData {
  starRates: {
    [scene: string]: number;
  };
  starRewards: {
    [scene: string]: Item[];
  };
  cards: {
    [scene: string]: Item[];
  };
}

export let EXPLORATION: Exploration = {
  starRates: {},
  starRewards: {},
};

export let EXPLORATION_CLIENT_DATA: ExplorationClientData = {
  starRates: {},
  starRewards: {},
  cards: {},
};

export default function explorationLoader(config: IConfig) {
  EXPLORATION = config.get('Scenes.Exploration');

  EXPLORATION_CLIENT_DATA.starRates = EXPLORATION.starRates;

  // Object.keys(EXPLORATION.starRewards).forEach((scene) => {
  //   EXPLORATION_CLIENT_DATA.starRewards[scene] = EXPLORATION.starRewards[scene].map((iid) => createItem(iid));
  // });

  // Object.keys(CARDS.exploration).forEach((scene) => {
  //   EXPLORATION_CLIENT_DATA.cards[scene] = CARDS.exploration[scene].map((row) => {
  //     const item = createItem(row[0]);

  //     item.props.rate = row[1];

  //     return item;
  //   });
  // });
}

interface NormalExploration {
  /** [monster, money, key, boss, pet, item] */
  rates: [number, number, number, number, number, number];
  monsters: number[];
  stones: number;
  /** [iid, isBound, weight] */
  keys: [number, number, number][];
  /** [iid, isBound, weight] */
  boss: [number, number, number][];
  /** [iid, isBound, weight] */
  pets: [number, number, number][];
  /** [iid, isBound, weight] */
  items: [number, number, number][];
  attemptsNeededForStarUp: number;
  /** [pet, exp] */
  stars: [number, number][];
  /** [pet, exp] */
  starRewards: [number, number];
}

interface KeyExploration extends NormalExploration {
  iid: number;
}

interface SceneExploration {
  [sceneId: number]: {
    normal: NormalExploration;
    key: KeyExploration;
  };
}

export function serverLoaderExploration(config: IConfig) {
  return {
    SCENES: config.get('Scenes.ExplorationV2.Scenes') as SceneExploration,
  };
}
