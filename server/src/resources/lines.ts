import { IConfig } from 'config';
import { Line } from '../interfaces';

interface Lines {
  [key: number]: Line;
}

export let itemLines: { [itemId: number]: number[] };
export let LINE_GROUPS: { [key: number]: number[] };
export let LINES: Lines = {};
export let Stat: { [key: string]: number } = {};
export let GENERIC_LINES: {
  [itemType: number]: {
    [level: number]: number[];
  };
} = {};

export default function lineLoader(config: IConfig) {
  itemLines = config.get('Lines.ItemLines');
  LINE_GROUPS = config.get('Lines.LineGroups');
  LINES = config.get('Lines.Lines');
  Stat = config.get('Lines.Stat');
  GENERIC_LINES = config.get('Lines.Generic');
}
