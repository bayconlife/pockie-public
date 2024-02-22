import { IConfig } from 'config';

// export let EXP_FOR_LEVEL: { [key: string]: number } = {};
// export let LEVELING_CONFIG: { [key: string]: number } = {};

// export function levelingLoader(config: IConfig) {
//   // Object.entries(config).forEach((entry) => (EXP_FOR_LEVEL[entry[0]] = entry[1] as number));

//   EXP_FOR_LEVEL = config.get('Leveling.exp');
//   LEVELING_CONFIG = config.get('Leveling.config');
// }

export function serverLevelingLoader(config: IConfig) {
  return {
    EXP_FOR_LEVEL: config.get('Leveling.exp') as { [key: string]: number },
    Config: config.get('Leveling.config') as { [key: string]: number },
  };
}
