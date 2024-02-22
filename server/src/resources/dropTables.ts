import { IConfig } from 'config';
import { DropTable } from '../types';

export interface DropTables {
  [key: number]: {
    roll?: number;
    amount: number;
    items: number[][];
  };
}

// [Item ID, Prop Count, Bound, %]
export let dropTables: DropTables = {};

export default function dropTableLoader(config: IConfig) {
  dropTables = config.get('DropTables');
}

export function serverLoaderDropTables(config: IConfig) {
  return {
    Tables: config.get('DropTables') as DropTables,
  };
}
