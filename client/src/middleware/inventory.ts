import { Middleware } from '@reduxjs/toolkit';
import { showInventory } from '../slices/inventorySlice';
import { RootState } from '../store';

export const inventoryUpdater: Middleware<{}, RootState> = (store) => (next) => (action) => {
  if (action.type === showInventory.type) {
    // return getSocket?.().emit('inventory', {}, (data: { items: any[]; equipped: any[] }) => {
    //   store.dispatch(setItems(data.items));
    //   store.dispatch(setEquippedItems(data.equipped));
    //   next(action);
    // });
  }

  return next(action);
};
