import * as React from 'react';
import { IItem } from '../slices/inventorySlice';

interface Context {
  item?: IItem;
}

const value: Context = {};

export const ItemContext = React.createContext(value);

export const ItemContextProvider: React.FC<Context> = ({ item, children }) => {
  const defaultValue = { ...value };

  if (item) {
    defaultValue.item = item;
  }

  return <ItemContext.Provider value={defaultValue}>{children}</ItemContext.Provider>;
};
