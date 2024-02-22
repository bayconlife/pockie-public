import useTranslator from '../../hooks/translate';
import { IItem } from '../../slices/inventorySlice';
import { BaseInfo } from './components/BaseInfo';
import { LineBreak } from './components/LineBreak';

interface Props {
  item: IItem;
}

export const MULTIPLIERS: number[] = [9, 11, 12, 14];

export function GemInfo({ item }: Props) {
  const t = useTranslator();
  const props = item.props || { level: 1, stat: 0, value: 0 };

  return (
    <div style={{ color: 'whitesmoke' }}>
      <BaseInfo item={item}></BaseInfo>
      {/* <LineBreak />
      <div style={{ position: 'relative' }}>
        Required Item Level <span style={{ position: 'absolute', right: 0 }}>{props.level}</span>
      </div> */}
      <LineBreak />
      <div style={{ position: 'relative', color: '#388ee9' }}>
        {t(`stat__${props.stat}`)}
        <span style={{ position: 'absolute', right: 0 }}>+{format(props)}</span>
      </div>
    </div>
  );
}

function format(props: { [prop: string]: any }) {
  if (MULTIPLIERS.includes(props.stat)) {
    return (props.value / 10).toFixed(1) + '%';
  }

  return props.value;
}
