import { useState } from 'react';
import useTranslator from '../../hooks/translate';
import JPanel from '../../components/UI/JPanel';
import { Countdown } from '../MultiFightDisplay/Countdown';
import { IItem } from '../../slices/inventorySlice';
import { ItemInfo } from '../ItemInfo/ItemInfo';

export interface MarketItem {
  account_id: number;
  id: number;
  data: IItem;
  price: number;
  expiration: number;
}

export function MarketItem({ item, commandButton }: { item: MarketItem; commandButton: React.ReactNode }) {
  const background = 'UIResource.Common.TextBG2';
  const padding = 3;

  return (
    <>
      <ItemName item={item} />
      <JPanel size={{ width: 46, height: 20 }} position={{ x: 138, y: 0 }} background={background} padding={padding}>
        {item.data.props?.level ?? '-'}
      </JPanel>
      <JPanel size={{ width: 46, height: 20 }} position={{ x: 186, y: 0 }} background={background} padding={padding}>
        1
      </JPanel>
      <JPanel size={{ width: 76, height: 20 }} position={{ x: 234, y: 0 }} background={background} padding={padding}>
        {item.price}
      </JPanel>
      <JPanel size={{ width: 76, height: 20 }} position={{ x: 312, y: 0 }} background={background} padding={padding}>
        -
      </JPanel>
      <JPanel size={{ width: 76, height: 20 }} position={{ x: 390, y: 0 }} background={background} padding={padding}>
        <Countdown initial={Date.now() + item.expiration} />
      </JPanel>
      <JPanel position={{ x: 468, y: 0 }}>{commandButton}</JPanel>
    </>
  );
}

function ItemName({ item }: { item: MarketItem }) {
  const t = useTranslator();
  const [isHovering, setIsHovering] = useState(false);
  return (
    <>
      <JPanel size={{ width: 136, height: 20 }} position={{ x: 0, y: 0 }} background="UIResource.Common.TextBG2" padding={3}>
        <div style={{ textDecoration: 'underline' }}>
          <span onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
            {t(`item__${item.data.iid}--name`)}
          </span>
        </div>
      </JPanel>
      {isHovering && <ItemInfo item={item.data} />}
    </>
  );
}
