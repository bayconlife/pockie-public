import * as React from 'react';
import useTranslator from '../../hooks/translate';
import { IItem } from '../../slices/inventorySlice';
import { LineBreak } from './components/LineBreak';
import { NameInfo } from './components/NameInfo';
import { BaseInfo } from './components/BaseInfo';

interface Props {
  item: IItem;
}

export function PharmacyInfo({ item }: Props) {
  const t = useTranslator();
  const props = item.props || { level: 1, def: 0 };

  return (
    <div style={{ color: 'whitesmoke' }}>
      <BaseInfo item={item} />
      <LineBreak />
      {props.hp && <div>Heals {props.hp} hp.</div>}
      {props.mp && <div>Restores {props.mp} chakra.</div>}
      {props.energy && <div>Restores {props.energy} energy.</div>}
    </div>
  );
}
