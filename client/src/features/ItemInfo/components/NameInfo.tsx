import * as React from 'react';
import { getItemName } from '../../../resources/Items';
import { IItem } from '../../../slices/inventorySlice';
import useTranslator from '../../../hooks/translate';

const STAT: { [key: number]: string } = {
  1: 'Strong',
  2: 'Fast',
  3: 'Hearty',
  4: 'Tenacious',
  5: 'Ruining',
  6: 'Deft',
  7: 'Accurate',
  8: 'Life',
  9: 'Vivacious',
  10: 'Sharp',
  11: 'Savage',
  12: 'Speedy',
  13: 'Energy',
  14: 'Pneuma',
  15: 'Barbaric',
  16: 'Flexible',
  17: 'Guarding',
  18: 'Fatal',
  19: 'Sharp',
};

const COLORS: { [key: number]: string } = {
  0: 'rgba(255, 255, 255, 1)',
  1: 'rgba(30, 255, 0, 1)',
  2: 'rgba(0, 112, 221, 1)',
  3: 'rgba(163, 53, 238, 1)',
  4: 'rgba(255, 128, 0, 1)',
};

export const NameInfo: React.FC<{ item: IItem }> = ({ item }) => {
  const t = useTranslator();
  const name = t(`item__${item.iid}--name`);
  let { lines } = item.props || { lines: [] };

  if (lines === undefined) {
    lines = [];
  }

  const modifiedName = lines.map((line: any) => STAT[line.stat as number]).join(' ') + ' ' + name;

  return <div style={{ color: COLORS[lines.length], textAlign: 'center' }}>{modifiedName}</div>;
};
