import { useEffect } from 'react';
import ImageButton from '../../components/Buttons/ImageButton';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Countdown } from './Countdown';
import { setMultiFight } from '../../slices/uiSlice';
import { toServer } from '../../util/ServerSocket';

export function MultiFightDisplay() {
  const dispatch = useAppDispatch();

  const bounds = useAppSelector((state) => state.ui.bounds);
  const time = useAppSelector((state) => state.ui.multiFight);

  useEffect(() => {
    toServer('getMultiFightInfo');
  }, []);

  if (time === null) {
    return null;
  }

  return (
    <div
      className="text-outline display-1"
      style={{
        position: 'fixed',
        top: bounds[1] + 35,
        left: bounds[0] + 220,
        fontSize: 14,
        width: 75,
        textAlign: 'center',
        color: 'whitesmoke',
      }}>
      <div style={{ textAlign: 'center' }}>
        <ImageButton
          defaultImage="ui/MultiFightDisplay/Icon.png"
          onClick={() => toServer('fieldFightMultiClaim')}
          style={{ margin: 'auto' }}
        />
      </div>
      {time <= Date.now() ? <div>READY</div> : <Countdown initial={time} onFinish={() => dispatch(setMultiFight(-1))} />}
    </div>
  );
}
