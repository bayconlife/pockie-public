import './ContextMenu.css';
import * as React from 'react';

interface Props {
  element: HTMLElement;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function ContextMenu({ element, style, children }: Props) {
  const rect = element.getBoundingClientRect();

  const imageStyle: React.CSSProperties = {
    borderWidth: '5px',
    borderStyle: 'solid',
    borderImage: `url(${process.env.REACT_APP_CDN_PATH}ui/UIResource/Common/SmallBG2.png) 5 fill`,
  };

  return (
    <div id="context-menu" style={{ ...imageStyle, ...style, position: 'fixed', top: rect.top, left: rect.right }}>
      {children}
    </div>
  );
}

function Item({ onClick, title }: { onClick: (e?: React.MouseEvent) => void; title: string }) {
  return (
    <div className="context-menu__item" onClick={onClick}>
      {title}
    </div>
  );
}

ContextMenu.Item = Item;
