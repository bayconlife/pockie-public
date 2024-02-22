// import './Building.css';
import * as React from 'react';
import JPanel from '../../components/UI/JPanel';
import EventEmitter from '../../util/EventEmitter';
import { useAppSelector } from '../../hooks';
import { QuestState, QuestType } from '../../enums';
import { getQuestIcon, getQuestIconSize } from '../../util/questInfo';
import { useNpcQuestState } from '../../hooks/questState';
import { NineSlice } from '../../components/NineSlice';
import { CDNImage } from '../../components/Elements/Image';
import BuildingName from '../../assets/UIResource/Common/BuildingName.png';

interface Props {
  x: number;
  y: number;
  src: string;
  npc: number;
  scale?: number;
  onClick?: () => void;
  name?: {
    top: number;
    left: number;
    text: string;
  };
  className?: string;
}

let timeout: NodeJS.Timeout | null = null;

const Building: React.FC<Props> = ({
  x,
  y,
  src,
  npc,
  scale = 1,
  onClick = () => {},
  name = { top: 0, left: 0, text: '' },
  className = '',
}) => {
  const ref = React.useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const questState = useNpcQuestState(npc);

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
      {/* <div className="building__name" style={{ position: 'absolute', left: name.left, top: name.top }}>
        {name.text}
      </div> */}
      {name.text !== '' && (
        <NineSlice
          url={BuildingName}
          slice={[5, 20]}
          className="building__name"
          style={{ position: 'absolute', left: name.left, top: name.top, paddingLeft: 15, paddingRight: 15 }}>
          <div style={{ marginTop: -5, whiteSpace: 'nowrap' }}>{name.text}</div>
        </NineSlice>
      )}

      {questState !== QuestState.NONE && (
        <JPanel
          className="building__quest"
          size={getQuestIconSize(questState)}
          background={getQuestIcon(questState)}
          style={{ transform: `scale(${1 / scale})` }}
        />
      )}
    </div>
  );
};

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

export default Building;
