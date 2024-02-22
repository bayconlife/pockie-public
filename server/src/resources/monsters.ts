import { Stats } from '../interfaces';
import { IConfig } from 'config';
import { DropTable } from '../types';

interface MonsterStats extends Stats {
  dropTable: DropTable;
  exp: number;
  stones: number[];
  combatSkills: number[];
}

export const monsterBase: Stats = {
  avatar: 0,
  level: 0,
  str: 0,
  agi: 0,
  sta: 0,
  hp: 0,
  maxHp: 0,
  chakra: 0,
  maxChakra: 0,
  minAttack: 0,
  maxAttack: 0,
  speed: 1000,
  dodge: 0,
  pierce: 0,
  defense: 0,
  defenseBreak: 0,
  hit: 0,
  critical: 0,
  criticalDamage: 230,
  con: 0,
  priorityMultipler: 0,
  rebound: 0,
  decDamage: 0,
  parry: 0,
  canKickBomb: false,
  SkillAdd0: 0,
  SkillAdd1: 0,
  SkillAdd2: 0,
  SkillAdd3: 0,
  SkillAdd4: 0,
  SkillAdd5: 0,
  SkillAdd6: 0,
  SkillAdd7: 0,
  SkillAdd8: 0,
  SkillAdd9: 0,
  resistance: {
    duration: {
      poison: 0,
    },
  },
};

export const monsters: { [id: string]: MonsterStats } = {};

export default function monsterLoader(config: IConfig) {
  Object.entries(config.get('Monsters') || {}).forEach(
    // @ts-ignore
    (entry) => (monsters[entry[0]] = { id: entry[0], ...monsterBase, ...(entry[1] as MonsterStats) })
  );
}

export function getMonster(id: number) {
  return monsters[id];
}

export function serverLoaderMonsters(config: IConfig) {
  const monsters: { [id: string]: MonsterStats } = {};

  Object.entries(config.get('Monsters') || {}).forEach(
    // @ts-ignore
    (entry) => (monsters[entry[0]] = { id: entry[0], ...monsterBase, ...(entry[1] as MonsterStats) })
  );

  return {
    Monsters: monsters,
    getMonster: (id: number) => monsters['' + id],
  };
}
