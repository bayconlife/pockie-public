import { IItem } from '../../../slices/inventorySlice';
import { LineBreak } from './LineBreak';
import useObjectTranslator from '../../../hooks/objectTranslate';

interface Props {
  item: IItem;
}

export function Details({ item }: Props) {
  const t = useObjectTranslator();

  const details = t(`item__${item.iid}--details`);
  if (details[0] === `item__${item.iid}--details`) {
    return null;
  }

  return (
    <>
      <LineBreak />
      <div style={{ position: 'relative' }}>
        <div style={{ color: '#5df9ff' }} dangerouslySetInnerHTML={{ __html: t(`item__${item.iid}--details`).join('\n') }} />
      </div>
    </>
  );
}
