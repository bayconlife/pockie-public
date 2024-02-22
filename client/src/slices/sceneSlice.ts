import { createSlice } from '@reduxjs/toolkit';
import { Scene } from '../enums';

export interface Monster {
  id: number;
  level: number;
  avatar: number;
}

interface State {
  scene: Scene;
  monsters: Monster[];
  npcs: number[];
  boss?: number;
  npcsWithQuestsAvailable: number[];
  players: { level: number; name: string; id: number }[];
}

const initialState: State = {
  scene: Scene.NONE,
  monsters: [],
  npcs: [],
  npcsWithQuestsAvailable: [],
  players: [],
};

export const sceneSlice = createSlice({
  name: 'scene',
  initialState,
  reducers: {
    addPlayer: (state, action) => {
      state.players.push(action.payload);
    },
    clearScene: (state) => {
      state.scene = Scene.NONE;
    },
    removePlayer: (state, action) => {
      state.players.splice(
        state.players.findIndex((player) => player.name === action.payload),
        1
      );
    },
    setScene: (state, action) => {
      state.scene = action.payload.scene;
      state.monsters = action.payload.monsters;
      state.npcs = action.payload.npcs;
      state.npcsWithQuestsAvailable = action.payload.npcsWithQuestsAvailable;
      state.players = action.payload.players;
      state.boss = action.payload.boss;
    },
  },
});

export const { addPlayer, clearScene, removePlayer, setScene } = sceneSlice.actions;

export default sceneSlice.reducer;
