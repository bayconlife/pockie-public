import { t } from 'i18next';
import { IItem } from '../../../slices/inventorySlice';
import useTranslator from '../../../hooks/translate';
import { LineBreak } from './LineBreak';

interface Props {
  item: IItem;
}

export function EnchantSlotInfo({ item }: Props) {
  const t = useTranslator();
  const enchantment_1 = item?.props?.stats?.['Enchantment_1'];
  const enchantment_2 = item?.props?.stats?.['Enchantment_2'];
  const enchantment_3 = item?.props?.stats?.['Enchantment_3'];

  return (
    <>
      {(!!enchantment_1 || !!enchantment_2 || !!enchantment_3) && <LineBreak />}
      {(!!enchantment_1 || !!enchantment_2 || !!enchantment_3) && <div>Enchantment:</div>}
      {enchantment_1 !== undefined && enchantment_1.roll > 0 && (
        <div style={{ position: 'relative' }}>
          {t(`stat__${enchantment_1.stat}`)}
          <span style={{ position: 'absolute', right: 0 }}>+{enchantment_1.roll}</span>
        </div>
      )}
      {enchantment_2 !== undefined && enchantment_2.roll > 0 && (
        <div style={{ position: 'relative' }}>
          {t(`stat__${enchantment_2.stat}`)}
          <span style={{ position: 'absolute', right: 0 }}>+{enchantment_2.roll}</span>
        </div>
      )}
      {enchantment_3 !== undefined && enchantment_3.roll > 0 && (
        <div style={{ position: 'relative' }}>
          {t(`stat__${enchantment_3.stat}`)}
          <span style={{ position: 'absolute', right: 0 }}>+{enchantment_3.roll}</span>
        </div>
      )}
    </>
  );
}
