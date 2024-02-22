import { Effects, FightStat } from '../../enums';

export interface Size {
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface FighterRow {
  [row: string]: { id: string; level: number; role: number; name: string; win: boolean }[];
}

export interface ArenaFighters {
  top: { id: string; level: number; role: number; name: string; win: boolean }[];
  mid: { id: string; level: number; role: number; name: string; win: boolean }[];
  bot: { id: string; level: number; role: number; name: string; win: boolean }[];
}

export enum FightEvents {
  START_FIGHTING = 0,
  BEGIN_ATTACK = 1,
  END_ATTACK = 2,
  CANT_MOVE = 3,
  PRIORITY_MUL = 5,
  BACK_THROWED = 6,
  COUNTER_DAMAGE = 7,
  CHANGE_BUFF = 9,
  USER_SKILL = 14,
  BE_DIE = 20,
  CHANGE_ROLE = 21,
  VICTORY = 22,
}

export interface FightEffect {
  role: number;
  id: Effects;
}

export interface FightStatChange {
  stat: FightStat;
  role: number;
  value: number;
}

export interface FightTurn {
  role: number;
  event: FightEvents;
  time: number;
  skillId?: UserSkills;
  targetRole?: number;
  targetSkillId?: UserSkills;
  targetLastDamage?: number;
  selfLastDamage?: number;
  reflectedDamage?: number;
  isHit?: boolean;
  isCrit?: boolean;
  incHp?: number;
  addEffect?: FightEffect[];
  removeEffect?: FightEffect[];
  decMp?: number;
  incMp?: number;
  decTargetMp?: number;
  statChange?: FightStatChange[];
}

export enum UserSkills {
  NONE = 0,
  BASIC_ATTACK = 1,
  PRIORITY_ATTACK = 2,
  THUNDERFALL = 1802,
  CRYSTAL_BLADE = 1803,
  TAILED_BEAST_HEART = 1805,
  LOTUS = 1807,
  FIREBALL = 1808,
  BALSAM = 1809,
  RASENGAN = 1810,
  RASENGAN_2 = 18102,
  GALE_PALM = 1813,
  DEAD_DEMON_CONSUMING_SEAL = 1814,
  DEAD_DEMON_CONSUMING_SEAL_2 = 18142,
  DEAD_DEMON_CONSUMING_SEAL_3 = 18143,
  EARTH_PRISON = 1815,
  GREAT_MUD_RIVER = 1816,
  GREAT_MUD_RIVER_2 = 18162,
  GREAT_STRENGTH = 1822,
  FIVE_ELEMENTAL_SEAL = 1823,
  CHIDORI = 1825,
  CHIDORI_2 = 18252,
  CHIDORI_3 = 18253,
  QUICKSTEP = 1826,
  ASSASSINATE = 1827,
  BOMB = 1828,
  BOMB_THROW_BACK = 18281,
  BOMB_KICK = 18282,
  BOMB_EXPLODE = 18283,
  MYSTICAL_PALM_TECHNIQUE = 1829,
  CHAKRA_BLADE = 1830,
  EIGHT_TRIGRAM_PALM = 1832,
  EIGHT_TRIGRAM_PALM_2 = 18322,
  EIGHT_TRIGRAM_PALM_3 = 18323,
  STATIC_FIELD = 1839,
  PRE_HEALING_JUTSU = 3802,
  CREATION_REBIRTH = 3803,
  BLOODBOIL = 3804,
  SEXY_TECHNIQUE = 3805,
  MUD_WALL = 3806,
  SNARED = 3807,
  THE_EIGHT_INNER_GATES_RELEASED = 3810,
  WINDSTORM_ARRAY = 3811,
  DETONATING_CLAY = 3812,
  DETONATING_CLAY_2 = 38122,
  MIST = 3813,
  LIQUOR = 3814,
  SUNSET = 3815,
  CURSED_SEAL_OF_HEAVEN = 3819,
  GIANT_WATERFALL = 3820,
  GIANT_WATERFALL_2 = 38201,
  PRAYER = 3821,
  FLYING_THUNDER_GOD = 3822,
  FLYING_THUNDER_GOD_2 = 38221,
  PUPPET = 3825,
  SUBSTITUTE = 3826,
  DEATH_MIRAGE_JUTSU = 3827,
  JUTSU = 9999,
  SECRET_TECHNIQUE = 10000,
  SECRET_TECHNIQUE_1_1 = 10001,
  PET_ATTACK = 40001,
  ANTIBODY = 40106,
}
