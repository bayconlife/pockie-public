import { IConfig } from 'config';

interface Config {
  cost: number;
  rates: [number, number, number, number][];
}

export function serverLoaderImpress(config: IConfig) {
  return {
    CONFIG: config.get('Impress') as Config,
  };
}
