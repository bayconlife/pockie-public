import { IConfig } from 'config';

export const TITLES: { [key: string]: any } = {};

export default function titleLoader(config: IConfig) {
  Object.entries(config.get<{ [key: string]: [number, number][] }>('Titles.Titles')).forEach(([key, stats]) => {
    TITLES[key] = stats;
  });
}
