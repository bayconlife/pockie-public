import { IConfig } from 'config';

interface Inscribe {
  chance: number;
  cost: number;
  failure: number;
  percentStat: number;
}

export let inscribe: { [value: string]: Inscribe } = {};

export default function inscribeLoader(config: IConfig) {
  inscribe = config.get('Inscribe');
}
