import './Label.scss';
import useTranslator from '../../hooks/translate';
import { Position } from '../interfaces/Interfaces';

interface Props {
  className?: string;
  text: string;
  position?: Position;
  style?: React.CSSProperties;
  children?: React.ReactChild;
  /** reference for position.x */
  x?: number;
  /** reference for position.y */
  y?: number;
}

export function Label({ className, text, position, style, children, x, y }: Props) {
  const t = useTranslator();

  if (x !== undefined || y !== undefined) {
    position = { x: 0, y: 0 };

    if (x !== undefined) {
      position.x = x;
    }

    if (y !== undefined) {
      position.y = y;
    }
  }

  const _style: React.CSSProperties = position
    ? {
        position: 'absolute',
        top: position.y,
        left: position.x,
        ...style,
      }
    : { ...style };

  return (
    <div className={`label ${className}`} style={_style} title={t(text)}>
      {t(text) + ' '}
      {children}
    </div>
  );
}
