import './ContextMenu.scss';
import * as React from 'react';
import { Position } from '../../interfaces';
import SmallBG2 from '../../assets/UIResource/Common/SmallBG2.png';

interface Props {
  position: Position;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function ContextMenu({ position, style, children }: Props) {
  const imageStyle: React.CSSProperties = {
    borderWidth: '5px',
    borderStyle: 'solid',
    borderImage: `url(${SmallBG2}) 5 fill`,
  };

  return (
    <div id="context-menu" style={{ ...imageStyle, ...style, position: 'fixed', top: position.y, left: position.x }}>
      {children}
    </div>
  );
}

function Item({ onClick, title, disabled = false }: { onClick: (e: React.MouseEvent) => void; title: string; disabled?: boolean }) {
  return (
    <div
      className={'context-menu__item ' + `${disabled ? 'disabled' : ''}`}
      onClick={(e) => {
        if (disabled) {
          return;
        }
        onClick(e);
      }}>
      {title}
    </div>
  );
}

ContextMenu.Item = Item;
