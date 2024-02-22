// import './Building.css';
import * as React from 'react';
import JPanel from '../../components/UI/JPanel';
import EventEmitter from '../../util/EventEmitter';
import { useAppSelector } from '../../hooks';
import ReadyImage from '../../assets/UIResource/Notice/NotAccepted.png';
import { CDNImage } from '../../components/Elements/Image';

interface Props {
  x: number;
  y: number;
  src: string;
  onClick?: () => void;
  className?: string;
}

let timeout: NodeJS.Timeout | null = null;

export function ExplorationBuilding({ x, y, src, onClick = () => {}, className = '' }: Props) {
  const ref = React.useRef<HTMLImageElement>(null);
  const scale = useAppSelector((state) => state.ui.scale);
  const scene = useAppSelector((state) => state.scene.scene);
  const kills = useAppSelector((state) => state.character.exploration.scenes[scene]?.normal[0]) ?? 0;
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    if (ref.current === null) return;

    const img = ref.current;

    const canvas = document.createElement('canvas');
    const width = (canvas.width = img.naturalWidth);
    const height = (canvas.height = img.naturalHeight);
    const ctx = canvas.getContext('2d');

    if (ctx === null || width === 0 || height === 0) return;

    ctx.drawImage(img, 0, 0);

    const img_data = ctx.getImageData(0, 0, width, height);
    const pixels = new Uint32Array(img_data.data.buffer);

    const mouseMoveId = EventEmitter.on('mouseMove', (evt: MouseEvent) => {
      const bbox = img.getBoundingClientRect();

      if (evt.clientX > bbox.right || evt.clientX < bbox.left || evt.clientY > bbox.bottom || evt.clientY < bbox.top) {
        img.classList.toggle('highlighted', false);
        return;
      }

      const { _x, _y } = getRelativeCoords(evt, bbox, width, height);
      const px_index = _y * width + _x;

      if (_x < 0 || _y < 0) return;

      if (timeout !== null) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => img.classList.toggle('highlighted', pixels[px_index] !== 0), 3);
    });

    return () => {
      EventEmitter.off(mouseMoveId);
    };
  }, [ref, isLoaded]);

  return (
    <div
      className={`${className} grid--overlap`}
      style={{
        position: 'absolute',
        userSelect: 'none',
        transformOrigin: 'top left',
        transform: `scale(${scale}) translateX(${x}px) translateY(${y}px)`,
        pointerEvents: 'auto',
      }}>
      <CDNImage
        imgref={ref}
        className="building"
        src={src}
        onLoad={() => setIsLoaded(true)}
        onClick={() => {
          if (ref.current?.classList.contains('highlighted')) {
            onClick();
          }
        }}
        onMouseLeave={() => {
          if (timeout !== null) {
            clearTimeout(timeout);
          }
          ref.current?.classList.toggle('highlighted', false);
        }}
      />

      {kills >= 10 && (
        <img
          src={ReadyImage}
          style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}
        />
      )}
    </div>
  );
}

function getRelativeCoords(mouseevt: any, bbox: any, original_width: number, original_height: number) {
  // the position relative to the element
  const elem_x = mouseevt.clientX - bbox.left;
  const elem_y = mouseevt.clientY - bbox.top;
  // the ratio by which the image is shrinked/stretched
  const ratio_x = original_width / bbox.width;
  const ratio_y = original_height / bbox.height;
  // the real position in the the image's data
  const _x = Math.round(elem_x * ratio_x);
  const _y = Math.round(elem_y * ratio_y);

  return { _x, _y };
}
