import { createSlice } from '@reduxjs/toolkit';
import { IItem } from './inventorySlice';
export interface PotItem {
  id: number;
  icon: string;
  name: string;
  gold: number;
  medals: number;
  rankRequirement: number;
  items: IItem[][];
}

interface State {
  showVs: boolean;
  fighters: { id: string; level: number; avatar: number; name: string; win: boolean }[];
  medals: number;
  allClear: boolean;
  leaderboard: string[][];
  userRanking: number;
  tickets: number;
  shopPots: PotItem[];
  history: [string, number, number][];
  bossFight: boolean;
  cards: number[];
}

const initialState: State = {
  showVs: false,
  fighters: [],
  medals: 0,
  allClear: false,
  leaderboard: [],
  userRanking: 0,
  tickets: 0,
  shopPots: [],
  history: [],
  bossFight: false,
  cards: [],
};
export const arenaSlice = createSlice({
  name: 'arena',
  initialState,
  reducers: {
    showArenaVs: (state, action) => {
      state.showVs = action.payload;
    },
    setFights: (state, action) => {
      state.fighters = action.payload;
    },
    winFight: (state, action) => {
      state.fighters[action.payload].win = true;
    },
    setRankings: (state, action) => {
      state.userRanking = action.payload.userRank;
      state.leaderboard = action.payload.leaderboard;
    },
    setTickets: (state, action) => {
      state.tickets = action.payload;
    },
    setUserRank: (state, action) => {
      state.userRanking = action.payload;
    },
    setPots: (state, action) => {
      state.shopPots = action.payload;
    },
    setMedals: (state, action) => {
      state.medals = action.payload;
    },
    setHistory: (state, action) => {
      state.history = action.payload;
    },
    setBossFight: (state, action) => {
      state.bossFight = action.payload;
    },
    setCards: (state, action) => {
      state.cards = action.payload;
    },
    setArenaStats: (state, action) => {
      state.fighters = action.payload.fighters;
      state.bossFight = action.payload.bossFight;
      state.tickets = action.payload.tickets;
      state.medals = action.payload.medals;
      state.history = action.payload.history;
      state.cards = action.payload.cards;
    },
  },
});

export const {
  showArenaVs,
  setFights,
  winFight,
  setRankings,
  setTickets,
  setUserRank,
  setPots,
  setMedals,
  setHistory,
  setBossFight,
  setArenaStats,
  setCards,
} = arenaSlice.actions;

export default arenaSlice.reducer;
