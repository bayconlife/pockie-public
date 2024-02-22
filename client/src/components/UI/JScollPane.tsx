import * as React from 'react';

interface Props {
  size: {
    width: number;
    height: number;
  };
  position?: {
    x: number;
    y: number;
  };
  background?: string;
  style?: React.CSSProperties;
  className?: string;
  hidden?: boolean;
}

export const JScrollPane: React.FC<Props> = ({ size, position, background, children, style, className, hidden = false }) => {
  let parentStyle: React.CSSProperties = {
    width: size.width,
    height: size.height,
    position: 'relative',
    overflowY: 'scroll',
    overflowX: 'hidden',
    ...style,
  };

  let imageStyle: React.CSSProperties = {
    width: size.width,
    height: size.height,
  };

  if (position) {
    parentStyle = {
      ...parentStyle,
      position: 'absolute',
      top: position.y,
      left: position.x,
    };
  }

  if (hidden) {
    delete parentStyle.overflow;

    return (
      <div style={{ ...parentStyle, overflow: 'hidden' }}>
        <div
          className={className}
          style={{
            ...imageStyle,
            position: 'relative',
            overflowY: 'scroll',
            overflowX: 'hidden',
            paddingRight: 70,
          }}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={parentStyle}>
      {/* <div style={{position: 'absolute', top: 0, left: 0, width: size.width, height: size.height}}> */}
      {children}
      {/* </div> */}
    </div>
  );
};
