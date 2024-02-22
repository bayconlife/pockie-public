import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { inventoryUpdater } from './middleware/inventory';
import arenaSlice from './slices/arenaSlice';
import chatSlice from './slices/chatSlice';
import dungeonSlice from './slices/dungeonSlice';
import fightSlice from './slices/fightSlice';
import inventorySlice from './slices/inventorySlice';
import mapSlice from './slices/mapSlice';
import panelSlice from './slices/panelSlice';
import questsSlice from './slices/questsSlice';
import sceneSlice from './slices/sceneSlice';
import shopSlice from './slices/shopSlice';
import skillsSlice from './slices/skillsSlice';
import stateSlice from './slices/stateSlice';
import statSlice from './slices/statSlice';
import uiSlice from './slices/uiSlice';
import partySlice from './slices/partySlice';
import accountSlice from './slices/accountSlice';
import fieldSlice from './slices/fieldSlice';
import settingsSlice from './slices/settingsSlice';
import characterSlice from './slices/characterSlice';
import currencySlice from './slices/currencySlice';
import bloodlineSlice from './slices/bloodlineSlice';
import { bloodlineUpdater } from './middleware/bloodline';

const rootReducer = combineReducers({
  account: accountSlice,
  arena: arenaSlice,
  bloodline: bloodlineSlice,
  chat: chatSlice,
  character: characterSlice,
  currency: currencySlice,
  dungeon: dungeonSlice,
  field: fieldSlice,
  fight: fightSlice,
  inventory: inventorySlice,
  map: mapSlice,
  panels: panelSlice,
  party: partySlice,
  quests: questsSlice,
  scene: sceneSlice,
  settings: settingsSlice,
  shops: shopSlice,
  skills: skillsSlice,
  state: stateSlice,
  stats: statSlice,
  ui: uiSlice,
});
const store = configureStore({
  reducer: rootReducer,
  middleware: [bloodlineUpdater, inventoryUpdater],
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export default store;
