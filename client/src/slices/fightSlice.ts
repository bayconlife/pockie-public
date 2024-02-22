import { createSlice } from '@reduxjs/toolkit';

export enum FightState {
  LOADING,
  LOADED,
  FINISHED,
}

interface State {
  state: FightState;
  show: boolean;
  fight: any;
  rewards: any;
}

const initialState: State = {
  state: FightState.FINISHED,
  show: false,
  fight: null,
  rewards: null,
};

export const fightSlice = createSlice({
  name: 'fight',
  initialState,
  reducers: {
    startFight: (state) => {
      state.show = true;
      state.fight = {
        player: 'Ichigo',
        target: 'Ichigo',
        win: 'true',
        turns: [{}],
      };
    },
    endFight: (state) => {
      state.show = false;
      state.fight = null;
      state.rewards = null;
      state.state = FightState.FINISHED;
    },
    setFight: (state, action) => {
      state.show = true;
      state.fight = action.payload;

      if (action.payload === null) {
        state.state = FightState.FINISHED;
      } else if (state.state === FightState.LOADING) {
        state.state = FightState.LOADED;
      }
    },
    setFightState: (state, action) => {
      state.state = action.payload;
    },
    setRewards: (state, action) => {
      state.rewards = action.payload;
    },
  },
});

export const { startFight, endFight, setFight, setFightState, setRewards } = fightSlice.actions;

export default fightSlice.reducer;
