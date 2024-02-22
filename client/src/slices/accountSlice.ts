import { createSlice } from '@reduxjs/toolkit';

export enum LoadState {
  NOT_LOADED,
  LOADING,
  LOADED,
}

interface State {
  id?: number;
  loading: LoadState;
  serverId: number;
  version: string;
}

const initialState: State = {
  loading: LoadState.NOT_LOADED,
  serverId: -1,
  version: '',
};

export const AccountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setLoadState: (state, action) => {
      state.loading = action.payload;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setServerId: (state, action) => {
      state.serverId = action.payload;
    },
    setServerVersion: (state, action) => {
      state.version = action.payload;
    },
  },
});

export const { setLoadState, setId, setServerId, setServerVersion } = AccountSlice.actions;

export default AccountSlice.reducer;
