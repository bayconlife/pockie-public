import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface State {
  stones: number;
}

const initialState: State = {
  stones: 0,
};

export const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    addStones: (state, action: PayloadAction<number>) => {
      state.stones += action.payload;
    },
    reduceStones: (state, action: PayloadAction<number>) => {
      state.stones -= action.payload;
    },
    setStones: (state, action: PayloadAction<number>) => {
      state.stones = action.payload;
    },
  },
});

export const { addStones, reduceStones, setStones } = currencySlice.actions;

export default currencySlice.reducer;
