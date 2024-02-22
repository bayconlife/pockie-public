import { JObject } from '../../interfaces';

interface Props extends JObject {
  progress?: number;
  title?: string;
}

export function JProgressBar({ progress = 0, style, size, position, title }: Props) {
  let _style: React.CSSProperties = {
    ...style,
    width: size.width,
    height: size.height,
    accentColor: 'green',
  };

  if (position) {
    _style = {
      ..._style,
      position: 'absolute',
      top: position.y,
      left: position.x,
    };
  }

  return <progress max={100} value={progress} style={{ ..._style }} title={title} />;
}
