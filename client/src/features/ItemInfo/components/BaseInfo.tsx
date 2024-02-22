import * as React from 'react';
import { getItemSrc, getItemType, getItemValue, isItemBound } from '../../../resources/Items';
import { IItem } from '../../../slices/inventorySlice';
import useTranslator from '../../../hooks/translate';
import { CDNImage } from '../../../components/Elements/Image';
import { ItemType } from '../../../enums';

const statItemTypes = [
  ItemType.Amulet,
  ItemType.Belt,
  ItemType.Body,
  ItemType.Gloves,
  ItemType.Helm,
  ItemType.Ring,
  ItemType.Shoes,
  ItemType.Weapon,
];
const lineValues = [14, 22, 31, 39, 46];

export const BaseInfo: React.FC<{ item: IItem }> = ({ item, children }) => {
  const t = useTranslator();

  let sv = getItemValue(item);

  if (statItemTypes.includes(getItemType(item))) {
    sv = lineValues[item.props?.lines?.length ?? 0];
  }

  return (
    <div style={{ display: 'grid', gridAutoFlow: 'column' }}>
      <div>
        {isItemBound(item) ? 'Bound' : 'Unbound'}
        {children}
        <div style={{ position: 'relative' }}>
          Synthesis Value <span style={{ position: 'absolute', right: 0 }}>{sv}</span>
        </div>
        <div>Item Type: {t(`item_type__${getItemType(item)}`)}</div>
        {item.props?.dailyLimit && <div>Daily Limit: {item.props?.dailyLimit}</div>}
      </div>

      <div>
        <CDNImage src={getItemSrc(item)} style={{ float: 'right' }} />
      </div>
    </div>
  );
};
