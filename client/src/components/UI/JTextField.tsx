import * as React from 'react';
import useTranslator from '../../hooks/translate';
import { Position, Size } from '../interfaces/Interfaces';
import JPanel from './JPanel';

interface Props {
  size: Size;
  text?: string;
  position?: Position;
  style?: React.CSSProperties;
  title?: string;
  editable?: boolean;
  background?: string;
}

export const JTextField: React.FC<Props> = ({
  size,
  text = 'TextField',
  position,
  style,
  children,
  title,
  editable = false,
  background = 'UIResource.Common.TextBG2',
}) => {
  let _style: React.CSSProperties = {
    fontSize: 12,
    resize: 'none',
    padding: '3px 0 0 0px',
    border: 0,
    overflow: 'hidden',
    width: size.width - 3,
    height: size.height,
    textAlign: 'center',
    ...style,
  };

  return (
    <JPanel size={size} position={position} background={background}>
      <div style={_style} title={title ? title : text}>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{text}</pre>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{children}</pre>
      </div>
    </JPanel>
  );
};
