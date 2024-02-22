import io from 'socket.io';
import type { Room } from 'socket.io-adapter';
import {
  Effect,
  FightEvents,
  FightStat,
  ItemLocations,
  ItemType,
  QuestType,
  SkillCategory,
  SkillMethod,
  SkillTrigger,
  SkillType,
  UserSkillResult,
} from './enums';
import { DropTable, NpcId, UID } from './types';
import { CombatEffect } from './classes';
import { Fight } from './modules/fight/fightSystem';
import { User } from './components/classes';
import { Config } from './resources/servers';

export interface CustomSocket extends io.Socket {
  getAccountId: () => number;
  getCharacter: () => Promise<User>;
  getConfig: () => Config;
  getServerId: () => number;
  getUnlockedCharacter: () => Promise<User>;
  save: (user: User) => Promise<void>;
  shout: (room: Room | Room[], event: string, ...args: any) => void;
  unlock: (character: User) => void;
}

export interface Stats {
  displayName?: string;
  id?: string;
  avatar: number;
  level: number;
  str: number;
  agi: number;
  sta: number;
  hp: number;
  maxHp: number;
  chakra: number;
  maxChakra: number;
  speed: number;
  dodge: number;
  pierce: number;
  defense: number;
  defenseBreak: number;
  hit: number;
  critical: number;
  criticalDamage: number;
  con: number;
  priorityMultipler: number;
  maxAttack: number;
  minAttack: number;
  rebound: number; // Reflect % damage
  decDamage: number; // % Damage reduction
  parry: number; // Who has this? Parry reduces damage by %
  canKickBomb: boolean;
  SkillAdd0: number;
  SkillAdd1: number;
  SkillAdd2: number;
  SkillAdd3: number;
  SkillAdd4: number;
  SkillAdd5: number;
  SkillAdd6: number;
  SkillAdd7: number;
  SkillAdd8: number;
  SkillAdd9: number;
  resistance: {
    duration: {
      poison: number;
    };
  };
  weaponId?: number;
  pet?: number;
  petSkills?: number[];
  sets?: { [setId: string]: number };
  skills?: number[];
  title?: number;
  expPercent?: number;
  dropPercent?: number;
}

export interface CombatActorBaseData {
  id?: string;
  stats: Stats;
  exp?: number;
  dropTable?: DropTable;
}

export interface CombatActor extends Stats {
  id?: string;
  index: number;
  attackTime: number;
  previousTime: number;
  nextAttackTime: number;
  canAttack: number;
  canUseSkill: number;
  isTurn: boolean;
  type: string;
  saveSkillId: number;
  stats: {
    block: {
      percent: number;
      initial: number;
      multipler: number;
      additional: number;
    };
    defense: {
      initial: number;
      multipler: number;
      additional: number;
    };
    dodge: {
      initial: number;
      multipler: number;
      additional: number;
    };
    hit: {
      initial: number;
      multipler: number;
      additional: number;
    };
    shield: number;
    attackTime: {
      initial: number;
      multipler: number;
      additional: number;
      modified: number;
    };
    attack: {
      max: {
        initial: number;
        multipler: number;
        additional: number;
      };
      min: {
        initial: number;
        multipler: number;
        additional: number;
      };
    };
    resistance: {
      duration: {
        poison: number;
      };
    };
    vampiricHp: number;
  };
  skillList: number[];
  combatSkills: {
    attack: Skill[];
    passive: Skill[];
    trigger: Skill[];
  };
  effects: {
    [effect: string]: CombatEffect;
  };
  getEffect: (effectId: number) => CombatEffect;
  hasEffect: (effectId: number) => boolean;
  target: CombatActor;
  weaponId?: number;
  pet?: number;
}

export interface Dungeon {
  id: string;
  mode: number;
  location: number;
  subLocation: number;
  stats: { [id: string]: Stats };
}

export interface ItemBase {
  type: ItemType;
  src: string;
  size: number;
  innate: {
    [prop: string]: any;
  };
  props: {
    [prop: string]: any;
  };
  value?: number;
}

export interface Item {
  iid: number;
  uid: string;
  /* 
    use Core enum to access these

    [boundType, amount, location, position, type, size] 
  */
  core: [number, number, number, number, number, number];
  props: {
    [prop: string]: any;
  };
}

export interface Line {
  level: number;
  stat: number;
  min: number;
  max: number;
}

// export interface Fight {
//   reason: FightReasons;
//   roles: FightRole[];
//   actions: FightAction[];
// }

export interface FightAction {
  role: number;
  event: FightEvents;
  time: number;
  skillId?: number;
  targetRole?: number;
  targetSkillId?: number;
  addEffect?: { role: number; id: Effect }[];
  removeEffect?: { role: number; id: Effect }[];
  isCrit?: boolean;
  isHit?: boolean;
  reflectedDamage?: number;
  targetLastDamage?: number;
  selfLastDamage?: number;
  incHp?: number;
  decMp?: number;
  decTargetMp?: number;
  incTargetMp?: number;
  statChange?: FightStatChange[];
}

export interface FightStatChange {
  stat: FightStat;
  index: number;
  value: number;
}

export interface FightRole {
  isOnOffense: boolean;
  avatar: number;
  hp: number;
  mana: number;
}

export interface Monster extends Stats {
  skills: [];
  dropTable?: DropTable;
  exp?: number;
  stones?: number[];
}

export interface Fighter extends Stats {
  id: string;
  skills: [];
  score: number;
}
export interface FighterRow {
  [row: string]: { id: string; level: number; role: number; name: string; win: boolean }[];
}

export interface ArenaFighter {
  id: string;
  level: number;
  avatar: number;
  name: string;
  win: boolean;
}

export interface ArenaFighters {
  top: { id: string; level: number; role: number; name: string; win: boolean }[];
  mid: { id: string; level: number; role: number; name: string; win: boolean }[];
  bot: { id: string; level: number; role: number; name: string; win: boolean }[];
}

export interface Pot {
  id: number;
  icon: string;
  name: string;
  gold: number;
  medals: number;
  rankRequirement: number;
  items: number[][];
}

export interface Quest {
  id: number;
  level: number;
  requires: number[];
  acceptFrom: NpcId;
  steps: { type: QuestType; [key: string]: any }[];
  step: number;
  completed: boolean;
  turnIn: NpcId;
  rewards: { [key: string]: any };
  unlocks: number[];
}

export interface DailyQuest {
  id: number;
  group?: number;
  level: number;
  grade: number;
  steps: { type: QuestType; [key: string]: any }[];
  step: number;
  completed: boolean;
  rewards: { [key: string]: any };
}

export class Skill {
  id: number;
  type: SkillType;
  category: SkillCategory;
  trigger: SkillTrigger;
  probability: number;
  method: SkillMethod;

  use: (fight: Fight, action: FightAction, source: CombatActor, target: CombatActor) => UserSkillResult;
}

export interface PassiveSkill extends Skill {
  modifier: number;
  amount: number;
}
