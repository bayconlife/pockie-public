import { createSlice } from '@reduxjs/toolkit';
import { SiteState } from '../enums';

interface InitialState {
  state: SiteState;
}

const initialState: InitialState = {
  state: SiteState.LANDING,
};

export const stateSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {
    switchState: (state, action) => {
      state.state = action.payload;
    },
  },
});

export const { switchState } = stateSlice.actions;

export default stateSlice.reducer;
