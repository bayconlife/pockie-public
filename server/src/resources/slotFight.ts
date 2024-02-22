import { Monster, Stats } from '../interfaces';
import { IConfig } from 'config';
import { monsterBase } from './monsters';

interface ConfigMatching {
  [id: string]: number[][];
}

interface ConfigPrizes {
  [id: string]: number;
}

interface ConfigScenes {
  [id: string]: number[];
}

interface Scenes {
  [id: string]: {
    monsters: number[];
    matching?: number[][];
  };
}

export const Monsters: { [id: string]: Monster } = {};
export const Scenes: Scenes = {};
export const Prizes: { [rank: string]: number } = {};

export default function slotFightLoader(config: IConfig) {
  Object.entries(config.get('SlotFight.Monsters') || {}).forEach(
    //@ts-ignore
    (entry) => (Monsters[entry[0]] = { id: entry[0], combatSkills: [], ...monsterBase, ...(entry[1] as Monster) })
  );

  Object.entries(config.get('SlotFight.Scenes') as ConfigScenes).forEach(([id, monsters]) => {
    Scenes[id] = { monsters };
  });

  Object.entries(config.get('SlotFight.Matching') as ConfigMatching).forEach(([id, matching]) => {
    Scenes[id].matching = matching;
  });

  Object.entries(config.get('SlotFight.Prizes') as ConfigPrizes).forEach(([id, prize]) => {
    Prizes[id] = prize;
  });
}
