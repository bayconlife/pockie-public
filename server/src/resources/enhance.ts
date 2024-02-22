import { IConfig } from 'config';

interface Enhance {
  failRate: number[];
  weapons: number;
  amounts: { [type: number]: { [level: number]: number } };
  talismans: number[];
}

export let Enhance: Enhance = {
  failRate: [],
  weapons: 6,
  amounts: {},
  talismans: [],
};

export default function enhanceLoader(config: IConfig) {
  Enhance = config.get('Enhance');
}
