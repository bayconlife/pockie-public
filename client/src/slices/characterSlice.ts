import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface DailyQuest {
  id: number;
  group?: number;
  level: number;
  grade: number;
  steps: { type: number; [key: string]: any }[];
  step: number;
  completed: boolean;
  rewards: { [key: string]: any };
}

export interface BloodlineLimit {
  collected: boolean;
  amity: number;
  daily: number;
}

/** Holds data from the User class on the backend. Things that get large enough can be split into their own slice such as stats. */
interface State {
  bloodlines: {
    limits: {
      [id: number]: {
        collected: boolean;
        amity: number;
        daily: number;
        souls: { id: number; level: number }[];
      };
    };
    souls: { id: number; level: number }[];
    active: (number | null)[];
    bg: number;
  };
  buffs: {
    [buffId: number]: number;
  };
  collection: {
    avatar: {
      collectedIdxs: {
        gray: number[];
        blue: number[];
        orange: number[];
      };
      level: number;
      stats: {
        1: number;
        2: number;
        3: number;
        9: number;
        11: number;
        12: number;
      };
    };
  };
  currency: {
    giftCertificates: number;
  };
  energy: {
    current: number;
  };
  exploration: {
    attemptsToday: number;
    resetTime: number;
    cards: {
      shown: number[];
      cards: any[];
      selected: number;
    };
    scenes: {
      [location: string]: {
        /** [monstersKilled, starLevel, attemptCount] */
        normal: [number, number, number, number];
        key: [];
      };
    };
  };
  displayName: string;
  home: {
    farm: [number, number][];
  };
  petTracing: {
    board: number[];
    powers: number[];
    score: number;
    highScore: number;
    attemptsLeft: number;
    started: boolean;
  };
  recovery: {
    hp: number;
    chakra: number;
  };
  social: {
    blockedAccountIds: number[];
  };
  tasks: {
    daily: {
      available: DailyQuest[];
      inProgress: DailyQuest[];
      nextRefreshTime: number;
      resetTime: number;
    };
  };
  titles: {
    current: number;
    unlocked: number[];
  };
}

const initialState: State = {
  bloodlines: {
    limits: {},
    souls: [],
    active: [null, null, null],
    bg: -1,
  },
  buffs: {},
  collection: {
    avatar: {
      collectedIdxs: {
        gray: [],
        blue: [],
        orange: [],
      },
      level: 0,
      stats: {
        1: 0,
        2: 0,
        3: 0,
        9: 0,
        11: 0,
        12: 0,
      },
    },
  },
  currency: {
    giftCertificates: 0,
  },
  energy: {
    current: 0,
  },
  exploration: {
    attemptsToday: 0,
    resetTime: 0,
    cards: {
      shown: [],
      cards: [],
      selected: -1,
    },
    scenes: {},
  },
  displayName: '',
  home: {
    farm: [],
  },
  petTracing: {
    board: [],
    powers: [],
    score: 0,
    highScore: 0,
    attemptsLeft: 10,
    started: false,
  },
  recovery: {
    hp: 0,
    chakra: 0,
  },
  social: {
    blockedAccountIds: [],
  },
  tasks: {
    daily: {
      available: [],
      inProgress: [],
      nextRefreshTime: 0,
      resetTime: 0,
    },
  },
  titles: {
    current: 0,
    unlocked: [0],
  },
};

export const CharacterSlice = createSlice({
  name: 'character',
  initialState,
  reducers: {
    blockAccount: (state, action: PayloadAction<number>) => {
      state.social.blockedAccountIds.push(action.payload);
    },
    setCharacterData: (state, action) => {
      return { ...state, ...action.payload };
    },
    setCharacterPartial: (state, action) => {
      return { ...state, ...action.payload };
    },
    setPetTracePartial: (state, action) => {
      return { ...state, petTracing: { ...state.petTracing, ...action.payload } };
    },
    unblockAccount: (state, action: PayloadAction<number>) => {
      const idx = state.social.blockedAccountIds.indexOf(action.payload);

      if (idx !== -1) {
        const newBlockedAccountIds = [...state.social.blockedAccountIds];

        newBlockedAccountIds.splice(idx, 1);

        state.social.blockedAccountIds = newBlockedAccountIds;
      }
    },

    // Bloodline
    activateBloodline: (state, action: PayloadAction<number>) => {
      const idx = state.bloodlines.active.indexOf(null);

      if (idx !== -1) {
        state.bloodlines.active[idx] = action.payload;
      }
    },
    deactivateBloodline: (state, action: PayloadAction<number>) => {
      const idx = state.bloodlines.active.indexOf(action.payload);

      if (idx !== -1) {
        state.bloodlines.active[idx] = null;
      }
    },
    updateBloodlineLimit: (state, action) => {
      state.bloodlines.limits[action.payload.id] = action.payload.limit;
    },
  },
});

export const {
  activateBloodline,
  deactivateBloodline,
  updateBloodlineLimit,

  blockAccount,
  setCharacterData,
  setCharacterPartial,
  setPetTracePartial,
  unblockAccount,
} = CharacterSlice.actions;

export default CharacterSlice.reducer;
