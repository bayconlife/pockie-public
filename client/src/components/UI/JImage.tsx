import './JImage.scss';
import { Position } from '../../interfaces';
import { CDNImage } from '../Elements/Image';

interface Props {
  className?: string;
  src: string;
  position?: Partial<Position>;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function JImage({ className = '', src, position, style = {}, onClick }: Props) {
  const _style = { ...style };

  if (!!position) {
    _style.position = 'absolute';
  }

  position = { x: 0, y: 0, ...position };

  _style.left = position.x;
  _style.top = position.y;

  return <CDNImage className={`j-image ${className}`} src={src} style={_style} onClick={onClick} />;
}
