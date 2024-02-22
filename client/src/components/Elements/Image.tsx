import { ImgHTMLAttributes } from 'react';

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  imgref?: React.RefObject<HTMLImageElement>;
}

/**
 * A CDN pathed version of the <img /> element.
 */
export function CDNImage(props: Props) {
  return (
    <img
      {...props}
      crossOrigin={process.env.NODE_ENV === 'development' ? undefined : 'anonymous'}
      ref={props.imgref}
      src={`${process.env.REACT_APP_CDN_PATH ?? ''}${props.src}`}
    />
  );
}
