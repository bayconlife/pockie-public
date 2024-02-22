import { IConfig } from 'config';

interface Config {
  max: number;
  dailyGain: number;
}

export function serverLoaderEnergy(config: IConfig) {
  return {
    CONFIG: config.get('Energy') as Config,
  };
}
