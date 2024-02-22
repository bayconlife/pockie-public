import * as React from 'react';
import { io, Socket } from 'socket.io-client';
import { IItem } from '../slices/inventorySlice';

interface Context {
  character?: {
    items: { [uid: string]: IItem };
    locations: { [location: string]: string };
  };
}

const value: Context = {};

export const CharacterContext = React.createContext(value);

export const CharacterContextProvider: React.FC<Context> = ({ character, children }) => {
  const defaultValue = { ...value };

  if (character) {
    defaultValue.character = character;
  }

  return <CharacterContext.Provider value={defaultValue}>{children}</CharacterContext.Provider>;
};
