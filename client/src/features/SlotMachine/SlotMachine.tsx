import './SlotMachine.scss';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import ImageButton from '../../components/Buttons/ImageButton';
import { CenterContainer } from '../../components/CenterContainer/CenterContainer';
import { useAppSelector } from '../../hooks';
import { setSlotFight } from '../../slices/uiSlice';
import { Handle } from './Handle';
import { Countdown } from '../MultiFightDisplay/Countdown';
import EventEmitter from '../../util/EventEmitter';
import { next, release } from '../../util/windowStack';
import { CDNImage } from '../../components/Elements/Image';
import { toServer } from '../../util/ServerSocket';

export function SlotMachine() {
  const dispatch = useDispatch();

  const slots = useAppSelector((state) => state.ui.slotFights);

  const [visible, setVisible] = useState(false);
  const [zIndex] = useState(next());

  useEffect(() => {
    return () => {
      release(zIndex);
    };
  }, []);

  function onClick() {
    toServer('slotRoll', {}, (roll: number[]) => {
      dispatch(setSlotFight(roll));
    });
  }

  function onFight() {
    toServer('slotFight');
  }

  return (
    <>
      <div className="slot-machine__icon">
        <ImageButton defaultImage="ui/SlotMachine/icon.png" onClick={() => setVisible(!visible)} />
      </div>
      {visible && (
        <CenterContainer className="slot-machine__container" zIndex={zIndex}>
          <Handle onClick={onClick} />
          <CDNImage className="slot-machine__frames" src="ui/SlotMachine/frames.png" />
          <div className="slot-machine__fighter-container">
            {slots.roll.map((slot, idx) => (
              <CDNImage key={idx} src={`icons/people/${slot[1]}.png`} width={50} />
            ))}
          </div>

          <ImageButton className="slot-machine__close-btn" defaultImage="ui/SlotMachine/close.png" onClick={() => setVisible(false)} />
          <ImageButton
            className="slot-machine__challenge-btn"
            defaultImage="ui/SlotMachine/StartButton.png"
            onClick={onFight}
            disabled={slots.roll.length === 0}>
            <div className="text-shadow slot-machine__challenge-btn-text">Challenge</div>
          </ImageButton>

          <div className={'text-outline display-1 slot-machine__countdown'}>
            {slots.nextRollAt > Date.now() ? (
              <Countdown
                initial={slots.nextRollAt}
                onFinish={() => {
                  EventEmitter.emit('slotPullReady');
                  dispatch(
                    setSlotFight({
                      roll: slots.roll,
                      nextRollAt: 0,
                    })
                  );
                }}
              />
            ) : (
              <span>READY</span>
            )}
          </div>
        </CenterContainer>
      )}
    </>
  );
}
