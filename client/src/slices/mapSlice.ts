import { createSlice } from '@reduxjs/toolkit';

interface State {
  show: boolean;
}

const initialState: State = {
  show: false,
};

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    hideMap: (state) => {
      state.show = false;
    },
    showMap: (state) => {
      state.show = true;
    },
  },
});

export const { hideMap, showMap } = mapSlice.actions;

export default mapSlice.reducer;
