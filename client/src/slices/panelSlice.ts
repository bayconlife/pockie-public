import { createSlice } from '@reduxjs/toolkit';

interface InitialState {
  armory: boolean;
  codex: boolean;
  kennel: boolean;
  npc: number | null;
  petTracing: boolean;
  collection: boolean;
  social: boolean;
}

const initialState: InitialState = {
  armory: false,
  codex: false,
  collection: false,
  kennel: false,
  npc: null,
  petTracing: false,
  social: false,
};

export const panelSlice = createSlice({
  name: 'panel',
  initialState,
  reducers: {
    hideArmory: (state) => {
      state.armory = false;
    },
    showArmory: (state) => {
      state.armory = true;
    },

    hideCollection: (state) => {
      state.collection = false;
    },
    showCollection: (state) => {
      state.collection = true;
    },

    hideKennel: (state) => {
      state.kennel = false;
    },
    showKennel: (state) => {
      state.kennel = true;
    },

    hideNPC: (state) => {
      state.npc = null;
    },
    showNPC: (state, action) => {
      state.npc = action.payload;
    },

    hidePetTracing: (state) => {
      state.petTracing = false;
    },
    showPetTracing: (state) => {
      state.petTracing = true;
    },

    hideSocial: (state) => {
      state.social = false;
    },
    showSocial: (state) => {
      state.social = true;
    },

    hideCodex: (state) => {
      state.codex = false;
    },
    showCodex: (state) => {
      state.codex = true;
    },
  },
});

export const {
  hideArmory,
  showArmory,
  hideCollection,
  showCollection,
  hideKennel,
  showKennel,
  hideNPC,
  showNPC,
  hidePetTracing,
  showPetTracing,
  hideSocial,
  showSocial,
  hideCodex,
  showCodex,
} = panelSlice.actions;

export default panelSlice.reducer;
