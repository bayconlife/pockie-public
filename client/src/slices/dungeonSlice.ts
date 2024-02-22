import { createSlice } from '@reduxjs/toolkit';

interface State {
  id: number;
  locations: number[][][];
  location: number;
  subLocation: number;
  showOutfits: boolean;
}

const initialState: State = {
  id: -1,
  locations: [],
  location: 0,
  subLocation: 0,
  showOutfits: false,
};

export const dungeonSlice = createSlice({
  name: 'dungeon',
  initialState,
  reducers: {
    hideOutfits: (state) => {
      state.showOutfits = false;
    },
    setDungeon: (state, action) => {
      state.id = action.payload.id;
      state.locations = action.payload.locations;
      state.location = action.payload.location;
      state.subLocation = action.payload.subLocation;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setSubLocation: (state, action) => {
      state.subLocation = action.payload;
    },
    showOutfits: (state) => {
      state.showOutfits = true;
    },
  },
});

export const { hideOutfits, setDungeon, setLocation, setSubLocation, showOutfits } = dungeonSlice.actions;

export default dungeonSlice.reducer;
