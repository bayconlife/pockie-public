import * as React from 'react';

interface Props {
  url: string;
  slice: number[];
  style?: React.CSSProperties;
  className?: string;
}

export const NineSlice: React.FC<Props> = ({ url, slice, style, className, children }) => {
  const _style = {
    borderStyle: 'solid',
    borderImageSource: `url(${url})`,
    borderImageSlice: `${slice.join(' ')} fill`,
    borderImageWidth: `${slice.join('px ')}px`,
  };

  return (
    <div className={`nine_slice ${className}`} style={{ ..._style, ...style }}>
      {children}
    </div>
  );
};
