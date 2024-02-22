import { createSlice } from '@reduxjs/toolkit';

interface State {
  show: boolean;
  stats: Stats;
}
export interface Stats {
  avatar: number;
  level: number;
  exp: number;
  expForLevel: number;
  expToLevel: number;
  rank: number;
  score: number;
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
  weaponId?: number;
  pet?: number;
  sets?: { [setId: number]: number };
  title?: number;
}

const initialState: State = {
  show: false,
  stats: {
    avatar: 0,
    level: 0,
    exp: 0,
    expForLevel: 0,
    expToLevel: 0,
    rank: 0,
    score: 0,
    str: 0,
    agi: 0,
    sta: 0,
    hp: 0,
    maxHp: 0,
    chakra: 0,
    maxChakra: 0,
    speed: 0,
    dodge: 0,
    pierce: 0,
    defense: 0,
    defenseBreak: 0,
    hit: 0,
    critical: 0,
    criticalDamage: 0,
    con: 0,
    priorityMultipler: 0,
    maxAttack: 0,
    minAttack: 0,
    rebound: 0, // Reflect % damage
    decDamage: 0, // % Damage reduction
    parry: 0, // Who has this? Parry reduces damage by %
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
    weaponId: 0,
    pet: 0,
    sets: {},
  },
};

export const statSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    hideStats: (state) => {
      state.show = false;
    },
    levelUp: (state, action) => {
      state.stats.level += 1;
      state.stats.expToLevel = action.payload;
    },
    rankUp: (state, action) => {
      state.stats.rank += 1;
    },
    reduceHp: (state, action) => {
      state.stats.hp -= action.payload;
    },
    setStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    showStats: (state) => {
      state.show = true;
    },
  },
});

export const { hideStats, levelUp, rankUp, setStats, showStats } = statSlice.actions;

export default statSlice.reducer;
