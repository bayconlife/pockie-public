import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { getItemLocation, getItemPosition, getItemType } from '../resources/Items';
import { ItemLocation } from '../enums';
import { RootState } from '../store';

export enum Core {
  BOUND,
  AMOUNT,
  LOCATION,
  POSITION,
  TYPE,
  SIZE,
}

export interface IItem {
  uid: string;
  iid: number;
  /* 
    use Core enum to access these

    [boundType, amount, location, position, type, size] 
  */
  core: [number, number, number, number, number, number];
  props: {
    [prop: string]: any;
  };
}

interface State {
  containers: { [location: number]: { [position: number]: string } };
  show: boolean;
  items: { [uid: string]: IItem };
  locations: { [location: string]: string };
  stones: number;
}

const initialState: State = {
  show: false,
  items: {},
  locations: {},
  stones: 0,
  containers: {},
};

export const InventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<IItem>) => {
      const item = action.payload;

      state.items[item.uid] = item;

      const location = getItemLocation(item);

      if (state.containers[location] === undefined) {
        state.containers[location] = {};
      }

      state.containers[location][getItemPosition(item)] = item.uid;
    },
    equipItem: (state, action) => {
      const uid = action.payload;
      const slot = getItemType(state.items[uid]);
      const equippedUID = state.locations[300 + slot];

      if (equippedUID in state.items) {
        state.items[equippedUID].core[Core.LOCATION] = state.items[uid].core[Core.LOCATION];
        state.items[equippedUID].core[Core.POSITION] = state.items[uid].core[Core.POSITION];
      }

      state.locations[300 + slot] = uid;
      state.items[uid].core[Core.LOCATION] = 300 + slot;
      state.items[uid].core[Core.POSITION] = 0;
    },
    hideInventory: (state) => {
      state.show = false;
    },
    moveItemToLocation: (state, action: PayloadAction<{ uid: string; location: ItemLocation }>) => {
      const location = action.payload.location;
      const i = state.items[action.payload.uid];
      const l = getItemLocation(i);
      const p = getItemPosition(i);

      delete state.items[action.payload.uid];
      delete state.locations[l];
      delete state.containers[l]?.[p];

      if (state.locations[location]) {
        state.locations[l] = state.locations[location];
      }

      state.locations[location] = action.payload.uid;
    },
    patchInventory: (state, action: PayloadAction<[number, ...any][]>) => {
      console.log(action.payload);
      action.payload.forEach((patch) => {
        console.log(patch);

        if (patch[0] === 0) {
          InventorySlice.caseReducers.addItem(state, { ...action, payload: patch[1] });
        }

        if (patch[0] === 1) {
          // Remove from inventory container
          const uid = patch[1];
          const location = state.items[uid].core[Core.LOCATION];
          const position = state.items[uid].core[Core.POSITION];

          delete state.items[uid];
          delete state.locations[location];
          delete state.containers[location]?.[position];
        }

        if (patch[0] === 2) {
          // Reduce item in inventory container
          const uid = patch[1];

          state.items[uid].core[Core.AMOUNT] -= patch[2];

          if (state.items[uid].core[Core.AMOUNT] <= 0) {
            const location = state.items[uid].core[Core.LOCATION];
            const position = state.items[uid].core[Core.POSITION];

            delete state.items[uid];
            delete state.locations[location];
            delete state.containers[location]?.[position];
          }
        }

        if (patch[0] === 3) {
          // Swap two items
          const uid = patch[1];
          const swapUID = patch[2];

          const firstLocation = state.items[uid].core[Core.LOCATION];
          const firstPosition = state.items[uid].core[Core.POSITION];

          const swapLocation = state.items[swapUID].core[Core.LOCATION];
          const swapPosition = state.items[swapUID].core[Core.POSITION];

          if (state.locations[firstLocation]) {
            state.locations[firstLocation] = swapUID;
          }

          if (state.locations[swapLocation]) {
            state.locations[swapLocation] = uid;
          }

          if (state.containers[firstLocation]?.[firstPosition]) {
            state.containers[firstLocation][firstPosition] = swapUID;
          }

          if (state.containers[swapLocation]?.[swapPosition]) {
            state.containers[swapLocation][swapPosition] = swapUID;
          }

          state.items[uid].core[Core.LOCATION] = swapLocation;
          state.items[uid].core[Core.POSITION] = swapPosition;

          state.items[swapUID].core[Core.LOCATION] = firstLocation;
          state.items[swapUID].core[Core.POSITION] = firstPosition;
        }

        if (patch[0] === 4) {
          // Set item location
          const uid = patch[1];

          console.log(uid);

          if (state.items[uid]) {
            const currentLocation = state.items[uid].core[Core.LOCATION];
            const currentPosition = state.items[uid].core[Core.POSITION];

            delete state.locations[currentLocation];
            delete state.containers[currentLocation]?.[currentPosition];

            state.items[uid].core[Core.LOCATION] = patch[2];
          }

          state.locations[patch[2]] = uid;
        }
      });
    },
    reduceItemInInventory: (state, action: PayloadAction<{ uid: string; amount: number }>) => {
      state.items[action.payload.uid].core[Core.AMOUNT] -= action.payload.amount;
    },
    removeItemFromInventory: (state, action: PayloadAction<string>) => {
      const i = state.items[action.payload];
      const l = getItemLocation(i);
      const p = getItemPosition(i);

      delete state.items[action.payload];
      delete state.locations[l];
      delete state.containers[l]?.[p];
    },
    setItemPosition: (state, action) => {
      const { uid, position, location } = action.payload;

      if (uid in state.items) {
        const i = state.items[uid];
        const currentLocation = getItemLocation(i);

        delete state.locations[currentLocation];
        delete state.containers[currentLocation]?.[getItemPosition(i)];

        state.items[uid].core[Core.POSITION] = position;
        state.items[uid].core[Core.LOCATION] = location;

        if (location > 10) {
          state.locations[location] = uid;
        }

        if (state.containers[location] === undefined) {
          state.containers[location] = {};
        }

        state.containers[location][position] = uid;
      }
    },
    setItems: (state, action) => {
      state.items = action.payload.items;
      state.locations = action.payload.locations;
      state.containers = action.payload.containers;
    },
    setStones: (state, action) => {
      state.stones = action.payload;
    },
    showInventory: (state) => {
      state.show = true;
    },
    swapItems: (state, action) => {
      const { uid, targetUID } = action.payload;

      if (getItemType(state.items[uid]) !== getItemType(state.items[targetUID])) {
        return;
      }

      delete state.locations[state.items[uid].core[Core.LOCATION]];
      delete state.locations[state.items[targetUID].core[Core.LOCATION]];

      const location = state.items[uid].core[Core.LOCATION];
      const position = state.items[uid].core[Core.POSITION];

      state.items[uid].core[Core.LOCATION] = state.items[targetUID].core[Core.LOCATION];
      state.items[uid].core[Core.POSITION] = state.items[targetUID].core[Core.POSITION];

      state.items[targetUID].core[Core.LOCATION] = location;
      state.items[targetUID].core[Core.POSITION] = position;

      state.locations[state.items[uid].core[Core.LOCATION]] = uid;
      state.locations[state.items[targetUID].core[Core.LOCATION]] = targetUID;
    },
    updateItem: (state, action) => {
      const item = action.payload;

      if (state.items[item.uid] === undefined) {
        console.error('Updating invalid item', item);
        return;
      }

      state.items[item.uid] = item;
    },
  },
});

export const {
  addItem,
  equipItem,
  hideInventory,
  patchInventory,
  reduceItemInInventory,
  removeItemFromInventory,
  setItemPosition,
  setItems,
  setStones,
  showInventory,
  swapItems,
  updateItem,
} = InventorySlice.actions;

export const getItemAtLocation = (location: ItemLocation) => (store: RootState) =>
  store.inventory.items[store.inventory.locations[location]];

export default InventorySlice.reducer;
