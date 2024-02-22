import { useEffect, useRef, useState } from 'react';
import { CDNImage } from './Elements/Image';

export function ImageWithSpinner({ src, ...props }: { src: string; [prop: string]: any }) {
  const spinnerDelayStatus = useRef(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!spinnerDelayStatus.current) {
        setLoaded(false);
      }
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      {loaded === false && <div className="loader" />}
      <CDNImage
        className="img__image"
        src={src}
        onLoad={() => {
          spinnerDelayStatus.current = true;
          setLoaded(true);
        }}
        {...props}
      />
    </>
  );
}
