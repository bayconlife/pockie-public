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

export const WishingPotInfo: React.FC<{ item: IItem }> = ({ item }) => {
  const t = useTranslator();
  const props = item.props || { level: 1, def: 0, boxType: 1 };

  const [content, weights] = (() => {
    switch (item.props?.boxType ?? 1) {
      case 1: // Random Outfit
      case 2: // Select Outfit
        return [[...item.props?.content[0], ...item.props?.content[1]], []];
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
          {content.map((line: any, idx: number) => (
            <li key={idx}>
              {`Lv. ${line[1]} ` + t(`item__${line[0]}--name`)}
              {item.props?.boxType === 4 ? (
                <span style={{ float: 'right' }}>{(((weights[idx] ?? 0) / total) * 100).toFixed(2)}%</span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
