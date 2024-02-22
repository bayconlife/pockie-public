import { IConfig } from 'config';

interface Refine {
  cost: number;
  talismans: number[];
}

export let REFINE: Refine = {
  cost: 1000,
  talismans: [],
};

export default function refineLoader(config: IConfig) {
  REFINE = config.get('Refine');
}
