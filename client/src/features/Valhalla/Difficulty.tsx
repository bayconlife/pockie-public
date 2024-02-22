import * as React from 'react';
import ImageButton from '../../components/Buttons/ImageButton';
import { useAppSelector } from '../../hooks';
import { SERVER_CONFIG } from '../../util/serverConfig';
import { CDNImage } from '../../components/Elements/Image';

interface Props {
  onClose: (info: any) => void;
  selected: number;
}

export const Difficulty: React.FC<Props> = ({ onClose, selected }) => {
  const bounds = useAppSelector((store) => store.ui.bounds);
  const [loaded, setLoaded] = React.useState(false);
  const GATE = SERVER_CONFIG.VALHALLA[selected];

  function onSelect(difficulty: number) {
    onClose({
      id: selected,
      difficulty,
      ...GATE,
      ...GATE.modes[difficulty],
    });
  }

  if (selected === -1) {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 990,
        left: bounds[0] + bounds[2] / 2,
        top: bounds[1] + bounds[3] / 2,
        transform: 'translate(-50%, -50%)',
        opacity: loaded ? 1 : 0,
      }}>
      <CDNImage src="scenes/valhalla/difficulty.png" onLoad={() => setLoaded(true)} />

      <div
        data-text="Difficulty Choice"
        className="valhalla__difficulty__name"
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          fontSize: '34px',
          transform: 'translate(-50%)',
          fontFamily: 'fantasy',
        }}
      />

      <div style={{ position: 'absolute', left: 66, top: 57 }}>
        <ImageButton defaultImage="scenes/valhalla/select.png" onClick={() => onSelect(0)} disabled={!(0 in GATE.modes)} />
        <div style={{ position: 'absolute', left: 21, top: 39, width: 92, textAlign: 'center' }}>Normal</div>
      </div>

      <div style={{ position: 'absolute', left: 66, top: 159 }}>
        <ImageButton defaultImage="scenes/valhalla/select.png" onClick={() => onSelect(1)} disabled={!(1 in GATE.modes)} />
        <div style={{ position: 'absolute', left: 21, top: 39, width: 92, textAlign: 'center' }}>Solo</div>
      </div>

      <ImageButton
        defaultImage="scenes/valhalla/close.png"
        onClick={() => onClose(null)}
        style={{ position: 'absolute', left: 422, top: 7 }}
      />
    </div>
  );
};
