import { IConfig } from 'config';
import { Monster } from '../interfaces';
import { monsterBase } from './monsters';

export const FIELD_BOSSES = new Map<string, Map<number, Monster>>();

export default function fieldBossLoader(config: IConfig) {
  const configData: { [id: string]: { [level: number]: Monster } } = config.get('Scenes.FieldBosses') || {};

  Object.keys(configData).forEach((key) => {
    if (!FIELD_BOSSES.has(key)) {
      FIELD_BOSSES.set(key, new Map());
    }

    Object.keys(configData[key]).forEach((level) => {
      FIELD_BOSSES.get(key)?.set(Number(level), { ...monsterBase, ...(configData[key][Number(level)] as Monster) });
    });
  });
}
