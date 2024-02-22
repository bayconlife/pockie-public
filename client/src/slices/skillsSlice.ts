import { createSlice } from '@reduxjs/toolkit';

interface State {
  show: boolean;
  equipped: any[];
  known: any[];
}

const initialState: State = {
  show: false,
  equipped: [],
  known: [],
};

export const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    addKnownSkills: (state, action) => {
      state.known.push(action.payload);
    },
    showSkills: (state, action) => {
      state.show = action.payload;
    },
    setEquippedSkills: (state, action) => {
      state.equipped = [...action.payload];

      while (state.equipped.length < 10) {
        state.equipped.push(null);
      }
    },
    setKnownSkills: (state, action) => {
      state.known = action.payload;
    },
  },
});

export const { addKnownSkills, showSkills, setEquippedSkills, setKnownSkills } = skillsSlice.actions;

export default skillsSlice.reducer;
