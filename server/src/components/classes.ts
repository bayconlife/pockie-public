import { QuestId, SocketFunction, UID } from '../types';
import { ArenaFighter, ArenaFighters, DailyQuest, Dungeon, Item, Quest, Stats } from '../interfaces';
import { random, randomUUID } from './random';
import { registerModule } from '../modules/kernel/moduleLoader';

interface Achievements {
  [key: number]: number;
}

interface Cards {
  shown: number[];
  items: Item[];
}

export interface PetAttemptCard {
  success: boolean;
  item: Item;
}

interface CardsV2 {
  shown: number[];
  cards: [number, Item, ...any][];
  selected: number;
}

interface Collection {
  avatar: {
    collectedIdxs: {
      gray: number[];
      blue: number[];
      orange: number[];
    };
    level: number;
    stats: {
      [statId: number]: number;
    };
  };
}

interface Quests {
  inProgress: Quest[];
  available: Quest[];
  completed: QuestId[];
}

interface Shop {
  lastRefresh: number;
  refreshCost: number;
  items: Item[];
}

interface Shops {
  normal: Shop;
  pet: Shop;
  food: Shop;
  black: Shop;
}

interface Arena {
  rank: number;
  score: number;
  medals: number;
  fighters: ArenaFighter[];
  tickets: number;
  history: (string | number)[][];
  bossFight: boolean;
  cards: number[];
  nextTicketReset: number;
}

interface Home {
  farm: [number, number][];
}

interface Hunt {
  killed: number[];
  monsters: number[];
}

interface LasNoches {
  current: number;
  attemptsLeft: number;
  exp: number;
}

export class User {
  lastUsed: number = 0;
  achievements: Achievements = {};
  arena: Arena = {
    rank: 1,
    score: 93500,
    medals: 0,
    fighters: [],
    tickets: 20,
    history: [],
    bossFight: false,
    cards: [],
    nextTicketReset: 0,
  };
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
  } = {
    limits: {},
    souls: [],
    active: [null, null, null],
    bg: -1,
  };
  buffs: {
    [buffId: number]: number;
  } = {};
  cards?: Cards;
  collection?: Collection;
  currency: {
    giftCertificates: number;
  } = {
    giftCertificates: 0,
  };
  displayName: string = '';
  dungeon?: string;
  energy: { current: number; nextRefresh: number } = { current: 0, nextRefresh: 0 };
  exp: number = 0;
  exploration: { [location: string]: [number, number, number] } = {};
  explorationV2?: {
    attemptsToday: number;
    resetTime: number;
    cards: CardsV2;
    scenes: {
      [location: string]: {
        /** [monstersKilled, starLevel, explorationsForThisStar] */
        normal: [number, number, number, number];
        key: [];
      };
    };
  };
  fight: {
    timeForNextFight: number;
    results?: any;
  } = {
    timeForNextFight: 0,
  };
  home: Home = {
    farm: [],
  };
  hunt: Hunt = {
    killed: [],
    monsters: [],
  };
  items: { [uid: string]: Item } = {};
  lasNoches: LasNoches = {
    current: -1,
    attemptsLeft: 2,
    exp: 0,
  };
  level: number = 1;
  containers: {
    [id: number]: {
      [position: number]: UID;
    };
  } = {};
  locations: { [location: string]: UID } = {};
  multiFight: {
    start: number;
    end: number;
    monsterId: number;
    amount: number;
    scene: number;
  } = { start: 0, end: 0, monsterId: 0, amount: 0, scene: 1 };
  party?: string;
  petTracing: {
    board: number[];
    powers: [number, number, number];
    score: number;
    highScore: number;
    attemptsLeft: number;
    resetTime: number;
    started: boolean;
  } = {
    board: [],
    started: false,
    powers: [0, 0, 0],
    score: 0,
    highScore: 0,
    attemptsLeft: 10,
    resetTime: 0,
  };
  quests: Quests = {
    inProgress: [],
    available: [],
    completed: [],
  };
  recovery: {
    hp: 0;
    chakra: 0;
  };
  scenes: {
    current: number;
    previous: number;
  } = { current: 1, previous: 1 };
  shops: Shops = {
    normal: {
      lastRefresh: 0,
      refreshCost: 0,
      items: [],
    },
    pet: {
      lastRefresh: 0,
      refreshCost: 0,
      items: [],
    },
    food: {
      lastRefresh: 0,
      refreshCost: 0,
      items: [],
    },
    black: {
      lastRefresh: 0,
      refreshCost: 0,
      items: [],
    },
  };
  skills: (number | null)[] = [null, null, null, null, null, null, null, null, null, null];
  skillsKnown: { id: number; level: number }[] = [];
  slotFights: {
    roll: [number, number][];
    nextRollAt: number;
  } = { roll: [], nextRollAt: 0 };
  social: {
    blockedAccountIds: number[];
  } = {
    blockedAccountIds: [],
  };
  stats: Stats;
  statBonus: {
    [key: string]: [number, number][];
  };
  stones: number = 0;
  tasks?: {
    daily?: {
      available: DailyQuest[];
      inProgress: DailyQuest[];
      nextRefreshTime: number;
      resetTime: number;
    };
  };
  titles: { current: number; unlocked: number[] } = {
    current: 0,
    unlocked: [0],
  };
  version: string = '1';
  village: number = -1;
  unlock?: () => void; // Resource locking mechanism to prevent race condition

  constructor() {
    this.displayName = 'User-' + randomUUID();
  }
}

export abstract class GameModule {
  protected abstract moduleName: string;
  protected abstract modules: { [key: string]: SocketFunction };

  private moduleLoader: typeof registerModule;

  constructor(moduleLoader: typeof registerModule) {
    this.moduleLoader = moduleLoader;
  }

  load() {
    this.moduleLoader(this.moduleName, (on) => {
      Object.entries(this.modules).forEach(([key, fn]) => on(key, fn));
    });
  }
}
