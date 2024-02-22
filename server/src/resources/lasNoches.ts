import { Monster, Stats } from '../interfaces';
import { IConfig } from 'config';
import { monsterBase } from './monsters';

interface ConfigFloor {
  exp: number;
  npc: number;
}

interface ConfigFloors {
  [id: string]: ConfigFloor;
}

interface Floor {
  exp: number;
  monster: Monster;
}

interface Floors {
  [id: string]: Floor;
}

export const Monsters: { [id: string]: Monster } = {};
export const Floors: Floors = {};

export default function lasNochesLoader(config: IConfig) {
  Object.entries(config.get('LasNoches.Monsters') || {}).forEach(
    //@ts-ignore
    (entry) => (Monsters[entry[0]] = { ...monsterBase, ...(entry[1] as Monster) })
  );

  Object.entries(config.get('LasNoches.Floors') as ConfigFloors).forEach((entry) => {
    Floors[entry[0]] = { exp: entry[1].exp, monster: Monsters[entry[1].npc] };
  });
}
