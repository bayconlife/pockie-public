import { createSlice } from '@reduxjs/toolkit';

export interface Party {
  id: string;
  leader: number;
  positions: number[];
  players: {
    [name: number]: {
      avatar: number;
      displayName: string;
      level: number;
    };
  };
}

interface State {
  id?: string;
  party?: Party;
}

const initialState: State = {};

export const PartySlice = createSlice({
  name: 'party',
  initialState,
  reducers: {
    setParty: (state, action) => {
      if (action.payload === null) {
        state.party = undefined;
      } else {
        state.party = action.payload;
      }
    },
    setPartyId: (state, action) => {
      state.id = action.payload;
    },
  },
});

export const { setParty, setPartyId } = PartySlice.actions;

export default PartySlice.reducer;
