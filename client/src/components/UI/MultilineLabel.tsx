import * as React from 'react';
import useTranslator from '../../hooks/translate';
import { Position, Size } from '../interfaces/Interfaces';

interface Props {
  size: Size;
  text?: string;
  position?: Position;
  style?: React.CSSProperties;
  title?: string;
  className?: string;
}

export const MultilineLabel: React.FC<Props> = ({ size, text = 'Multiline Label', position, style, children, title, className }) => {
  let _style: React.CSSProperties = {
    fontSize: 12,
    padding: 0,
    resize: 'none',
    border: 0,
    overflow: 'hidden',
    overflowY: 'auto',
    ...style,
    width: size.width,
    height: size.height,
    // background: 'red',
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
    <div className={className} style={_style} title={title}>
      <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: text }} />
      <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{children}</pre>
    </div>
  );
};
