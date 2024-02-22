import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IItem } from './inventorySlice';

interface Shop {
  lastRefresh: number;
  refreshCost: number;
  items: IItem[];
}

interface State {
  shops: { [key: string]: Shop };
}

const initialState: State = {
  shops: {
    normal: {
      lastRefresh: 0,
      refreshCost: 0,
      items: [],
    },
    pet: {
      lastRefresh: 0,
      refreshCost: 0,
      items: [],
    },
    food: {
      lastRefresh: 0,
      refreshCost: 0,
      items: [],
    },
    black: {
      lastRefresh: 0,
      refreshCost: 0,
      items: [],
    },
  },
};

export const shopSlice = createSlice({
  name: 'shops',
  initialState,
  reducers: {
    removeItemFromShop: (state, action: PayloadAction<{ shop: string; uid: string }>) => {
      state.shops[action.payload.shop].items = state.shops[action.payload.shop].items.filter((i) => i.uid !== action.payload.uid);
    },
    setShops: (state, action) => {
      state.shops = { ...state.shops, ...action.payload };
    },
  },
});

export const { removeItemFromShop, setShops } = shopSlice.actions;

export default shopSlice.reducer;
