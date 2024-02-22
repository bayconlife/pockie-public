import { useState } from 'react';
import { IItem } from '../../slices/inventorySlice';
import { ImageWithSpinner } from '../ImageWithSpinner';
import { AtLeast } from '../../types';
import { getItemSrc } from '../../resources/Items';
import { ItemInfo } from '../../features/ItemInfo/ItemInfo';

export function DisplayItem({ item }: { item: AtLeast<IItem, 'iid'> }) {
  const [hover, setHover] = useState(false);

  return (
    <div className="item-container" onMouseLeave={() => setHover(false)}>
      <div className={'item'} onMouseEnter={() => setHover(true)}>
        <ImageWithSpinner src={getItemSrc(item)} />

        {/* @ts-ignore */}
        {hover && <ItemInfo item={item} />}
      </div>
    </div>
  );
}
