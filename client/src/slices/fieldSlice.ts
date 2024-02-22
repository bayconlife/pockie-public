import { createSlice } from '@reduxjs/toolkit';

interface State {
  exploration: { [sceneId: string]: [number, number, number] };
  hunt: {
    killed: number[];
    monsters: { avatar: number; id: number }[];
  };
}

const initialState: State = {
  exploration: {},
  hunt: {
    killed: [],
    monsters: [],
  },
};

export const FieldSlice = createSlice({
  name: 'field',
  initialState,
  reducers: {
    setExploration: (state, action) => {
      state.exploration = { ...state.exploration, ...action.payload };
    },
    setHunt: (state, action) => {
      state.hunt.killed = action.payload?.killed ?? [];
      state.hunt.monsters = action.payload?.monsters ?? [];
    },
  },
});

export const { setExploration, setHunt } = FieldSlice.actions;

export default FieldSlice.reducer;
