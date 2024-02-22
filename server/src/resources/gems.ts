import { IConfig } from 'config';

interface Gems {
  cost: number;
  talismans: number[];
  maxHoles: {
    [itemType: number]: number;
  };
}

export let GEMS: Gems = {
  cost: 1000,
  talismans: [],
  maxHoles: {},
};

export default function gemLoader(config: IConfig) {
  GEMS = config.get('Gems');
}
