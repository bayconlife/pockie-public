import * as React from 'react';
import { IItem } from '../../slices/inventorySlice';
import { BaseInfo } from './components/BaseInfo';
import { LineBreak } from './components/LineBreak';
import useTranslator from '../../hooks/translate';

export const EnchantmentInfo: React.FC<{ item: IItem }> = ({ item }) => {
  const t = useTranslator();
  const props = item.props || { level: 1, stats: [], types: [] };

  return (
    <>
      <div style={{ color: 'whitesmoke' }}>
        <BaseInfo item={item} />
        <LineBreak />
        <div style={{ position: 'relative' }}>
          Required Item Level <span style={{ position: 'absolute', right: 0 }}>{props.level}</span>
        </div>
        <LineBreak />
        Apply to {props.types.map((type: number) => t(`item_type__${type}`))} for the following bonus:
        {props.stats.map((line: any, idx: number) => (
          <div key={idx} style={{ position: 'relative', color: '#388ee9' }}>
            {t(`stat__${line.stat}`)}
            <span style={{ position: 'absolute', right: 0 }}>+{format(line.value)}</span>
          </div>
        ))}
      </div>
    </>
  );
};

const MULTIPLIERS: number[] = [9, 11, 12, 14];

function format(value: any) {
  if (MULTIPLIERS.includes(value)) {
    value = (value / 10).toFixed(1);
  }

  return value;
}
