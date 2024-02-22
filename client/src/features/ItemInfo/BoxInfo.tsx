import * as React from 'react';
import useTranslator from '../../hooks/translate';
import { IItem } from '../../slices/inventorySlice';
import { Details } from './components/Details';
import { LineBreak } from './components/LineBreak';
import { NameInfo } from './components/NameInfo';
import { BaseInfo } from './components/BaseInfo';

const BoxType = {
  RandomOutfit: 1,
  SelectOutfit: 2,
  RandomItem: 3,
  RandomItemWeighted: 4,
};

export const BoxInfo: React.FC<{ item: IItem }> = ({ item }) => {
  const t = useTranslator();
  const props = item.props || { level: 1, def: 0, boxType: 1 };

  const [content, weights] = (() => {
    switch (item.props?.boxType ?? 1) {
      case 1: // Random Outfit
      case 2: // Select Outfit
        const con: number[] = [];
        item.props?.content.forEach((tab: [number, number][]) => con.push(...tab.map((line) => line[0])));
        return [[...con], []];
      case 3: // Random Item
        return [item.props?.content, []];
      case 4:
        return [
          item.props?.content.map(([item, weight]: [number, number]) => item),
          item.props?.content.map(([item, weight]: [number, number]) => weight) ?? [],
        ];
    }
  })() ?? [[], []];

  const total = weights.reduce((prev: number, next: number) => (prev += next), 0);

  return (
    <>
      <div style={{ color: 'whitesmoke' }}>
        <BaseInfo item={item} />
        <LineBreak />
        Contains:
        <ul>
          {item.props?.boxType === 5 && (
            <li>
              {t(`bag_type__${props.content?.[0]}`)}: {props.content?.[1]}
            </li>
          )}
          {content.map((id: any, idx: number) => (
            <li key={idx} style={{ display: 'flex' }}>
              <div style={{ overflowX: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t(`item__${id}--name`)}</div>
              {item.props?.boxType === 4 ? (
                <span style={{ marginLeft: 'auto' }}>{(((weights[idx] ?? 0) / total) * 100).toFixed(3)}%</span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
