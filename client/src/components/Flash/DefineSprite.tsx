import * as React from 'react';
import { Position } from '../interfaces/Interfaces';
import { CDNImage } from '../Elements/Image';

export const DefineSprite: React.FC<{ src: string; position: Position }> = ({ src, position }) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    top: position.y,
    left: position.x,
  };

  return <CDNImage src={src} style={style} />;
};
