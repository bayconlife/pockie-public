import { createSlice } from '@reduxjs/toolkit';

export interface Message {
  user: string;
  id: number;
  serverId: number;
  message: string;
}

interface State {
  global: Message[];
  party: Message[];
}

const initialState: State = {
  global: [],
  party: [],
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addGlobalMessage: (state, action) => {
      state.global.push(action.payload);

      if (state.global.length > 200) {
        state.global.shift();
      }
    },
    addPartyMessage: (state, action) => {
      state.party.push(action.payload);

      if (state.party.length > 200) {
        state.party.shift();
      }
    },
  },
});

export const { addGlobalMessage, addPartyMessage } = chatSlice.actions;

export default chatSlice.reducer;
