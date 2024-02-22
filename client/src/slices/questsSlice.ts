import { createSlice } from '@reduxjs/toolkit';
import { QuestType } from '../enums';

interface Quest {
  id: number;
  level: number;
  acceptFrom: number;
  steps: {
    type: number;
    [key: string]: any;
  }[];
  step: number;
  completed: boolean;
  turnIn: QuestType;
}

interface State {
  inProgress: Quest[];
  available: Quest[];
  completed: number[];
  questToDisplay: any | null;
}

const initialState: State = {
  inProgress: [],
  available: [],
  completed: [],
  questToDisplay: null,
};

export const questsSlice = createSlice({
  name: 'quests',
  initialState,
  reducers: {
    addQuest: (state, action) => {
      state.inProgress.push(action.payload);
    },
    displayQuest: (state, action) => {
      state.questToDisplay = action.payload;
    },
    setQuests: (state, action) => {
      state.inProgress = action.payload.inProgress;
      state.available = action.payload.available;
      state.completed = action.payload.completed;
    },
  },
});

export const { addQuest, displayQuest, setQuests } = questsSlice.actions;

export default questsSlice.reducer;
