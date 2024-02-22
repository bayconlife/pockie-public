import { JObject } from '../../interfaces';

interface Props extends JObject {
  onSelect: (selected: string) => void;
  value?: string;
}

export function JSelect({ size, position, onSelect, style, children, value }: Props) {
  let _style: React.CSSProperties = {
    fontSize: 12,
    ...style,
    resize: 'none',
    padding: '3px 0 0 4px',
    border: 0,
    overflow: 'hidden',
    width: size.width,
    height: size.height,
    background: 'lightgray',
  };

  if (position) {
    _style = {
      ..._style,
      position: 'absolute',
      top: position.y,
      left: position.x,
    };
  }

  return (
    <select style={{ ..._style }} onChange={(e) => onSelect(e.currentTarget.value)} value={value}>
      {children}
    </select>
  );
}
