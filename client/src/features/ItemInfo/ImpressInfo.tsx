import { ItemType } from '../../enums';
import useTranslator from '../../hooks/translate';
import { isItemType } from '../../resources/Items';
import { IItem } from '../../slices/inventorySlice';
import { BaseInfo } from './components/BaseInfo';
import { LineBreak } from './components/LineBreak';

interface Props {
  item: IItem;
}

export function ImpressInfo({ item }: Props) {
  const t = useTranslator();
  const props = item.props || { maxLevel: 99, rate: 5 };

  return (
    <div style={{ color: 'whitesmoke' }}>
      <BaseInfo item={item}></BaseInfo>
      <LineBreak />
      {isItemType(item, ItemType.Impress) && <div>Allows impress to be used on items level {props.maxLevel} and below.</div>}
      {isItemType(item, ItemType.ImpressRate) && <div>Increase the success chance of impress by 5% per crystal.</div>}
    </div>
  );
}
