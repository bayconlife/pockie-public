import { createSlice } from '@reduxjs/toolkit';
import { IItem } from './inventorySlice';

interface State {
  /** left, top, width, height */
  bounds: number[];
  chatSize: number;
  displayName: string;
  homeVillage: number;
  dragging: {
    item: IItem | null;
  };
  scale: number;
  multiFight: number | null;
  scenes: {
    [id: string]: {
      level: number;
      npcs: number[];
      monsters: number[];
      boss: number;
    };
  };
  slotFights: {
    roll: [number, number][];
    nextRollAt: number;
  };
}

const initialState: State = {
  bounds: [0, 0, 1000, 600],
  chatSize: 0,
  displayName: '',
  homeVillage: -1,
  dragging: {
    item: null,
  },
  scale: 1,
  multiFight: null,
  scenes: {},
  slotFights: {
    roll: [],
    nextRollAt: 0,
  },
};

export const UISlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    dragItem: (state, action) => {
      state.dragging.item = action.payload;
    },
    setBounds: (state, action) => {
      state.bounds = action.payload;
    },
    setChatSize: (state, action) => {
      state.chatSize = Math.min(Math.max(action.payload, 0), 3);
    },
    setDisplayName: (state, action) => {
      state.displayName = action.payload;
    },
    setMultiFight: (state, action) => {
      state.multiFight = action.payload === null ? null : Date.now() + action.payload;
    },
    setScale: (state, action) => {
      state.scale = action.payload;
    },
    setSlotFight: (state, action) => {
      state.slotFights = action.payload;
    },
    setHomeVillage: (state, action) => {
      state.homeVillage = action.payload;
    },
  },
});

export const { dragItem, setBounds, setChatSize, setDisplayName, setMultiFight, setScale, setSlotFight, setHomeVillage } = UISlice.actions;

export default UISlice.reducer;
