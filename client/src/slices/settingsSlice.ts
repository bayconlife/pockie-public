import { createSlice } from '@reduxjs/toolkit';

interface State {
  firstSet: boolean;
  originalDamage: boolean;
  font: string;
  mute: boolean;
  volume: number;
}

const DEFAULT_SETTINGS: State = {
  firstSet: false,
  originalDamage: true,
  font: 'KOMIKAX',
  mute: true,
  volume: 10,
};

const initialState: State = { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem('settings') ?? JSON.stringify(DEFAULT_SETTINGS)) };

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSetting: (state, action) => {
      state = { ...state, ...action.payload };

      localStorage.setItem('settings', JSON.stringify(state));

      return state;
    },
  },
});

export const { setSetting } = settingsSlice.actions;

export default settingsSlice.reducer;
