import { IItem } from '../../slices/inventorySlice';
import { LineBreak } from './components/LineBreak';
import { BaseInfo } from './components/BaseInfo';

interface Props {
  item: IItem;
}

export function DefaultInfo({ item }: Props) {
  const props = item.props || { level: 1, def: 0 };

  return (
    <div style={{ color: 'whitesmoke' }}>
      <BaseInfo item={item} />
      {Object.keys(props).length > 0 && (
        <>
          <LineBreak />
          {Object.keys(props).map((key) => (
            <div key={key}>
              {key}: {typeof props[key] === 'object' ? JSON.stringify(props[key]) : props[key]}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
