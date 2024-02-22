import { IConfig } from 'config';

interface Collection {
  avatars: {
    gray: {
      outfits: [number, number, number, number][];
      levels: { [level: number]: [number, number][] };
      titles: { [level: number]: number };
    };
    blue: {
      outfits: [number, number, number, number][];
      levels: { [level: number]: [number, number][] };
      titles: { [level: number]: number };
    };
    orange: {
      outfits: [number, number, number, number][];
      levels: { [level: number]: [number, number][] };
      titles: { [level: number]: number };
    };
  };
}

export function serverLoaderCollection(config: IConfig) {
  return config.get('Collection') as Collection;
}
