import { IConfig } from 'config';

interface Config {
  score: number[];
  modifierRates: {
    mystery: number;
    broken: number;
  };
  rewards: number[];
  perDay: number;
  refreshCost: number;
}

export function serverLoaderPetTracing(config: IConfig) {
  return config.get('PetTracing') as Config;
}
