import { createSlice } from '@reduxjs/toolkit';

interface State {
  synth: (number | null)[];
  synthResult: { id: number; level: number } | null;
}

const initialState: State = {
  synth: [null, null, null],
  synthResult: null,
};

export const bloodlineSlice = createSlice({
  name: 'bloodline',
  initialState,
  reducers: {
    clearSynth: (state) => {
      state.synth = [null, null, null];
      state.synthResult = null;
    },
    removeFromSynth: (state, action) => {
      state.synth[action.payload] = null;
    },
    setNextSynth: (state, action) => {
      const idx = state.synth.findIndex((id) => id === null);

      if (idx !== -1) {
        state.synth[idx] = action.payload;
      }
    },
    setSynthResult: (state, action) => {
      state.synthResult = action.payload;
    },
  },
});

export const { clearSynth, removeFromSynth, setNextSynth, setSynthResult } = bloodlineSlice.actions;

export default bloodlineSlice.reducer;
