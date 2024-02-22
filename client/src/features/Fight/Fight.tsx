// import './Fight.css';
import Phaser from 'phaser';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { endFight, setFight } from '../../slices/fightSlice';

import EventEmitter from '../../util/EventEmitter';
import useObjectTranslator from '../../hooks/objectTranslate';
import DefaultScene from './Scenes/DefaultScene';
import { Blur } from '../../components/Blur';
import { CenterContainer } from '../../components/CenterContainer/CenterContainer';
import { Tooltip } from '../../components/Tooltips/Tooltip';
import { useEffect, useRef, useState } from 'react';
import { PreloadScene } from './Scenes/PreloadScene';
import { CombatPlayerScene } from './Scenes/CombatPlayerScene';
import { FightResult } from '../../components/Fight/components/FightResult';
import { ViewCharacters } from '../../components/Fight/components/ViewCharacters';
import Events from '../../util/EventEmitter';
import { cancelFromServer, fromServer, toServer } from '../../util/ServerSocket';

const config = {
  type: Phaser.WEBGL,
  height: 600,
  width: 1000,
  scene: [DefaultScene, CombatPlayerScene, PreloadScene],
  parent: 'fightContainer',
  scale: {
    mode: Phaser.Scale.CENTER_BOTH,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
  },
  dom: {
    createContainer: true,
  },
  fps: {
    target: 24,
    forceSetTimeOut: true,
  },
};

const Fight: React.FC<{ onClose?: () => void; onFinish?: () => void }> = ({ onClose, onFinish = () => {} }) => {
  const serverCallback = useRef<() => void>();
  const gameRef = useRef<Phaser.Game>();
  const dispatch = useAppDispatch();
  const bounds = useAppSelector((state) => state.ui.bounds);
  const fight = useAppSelector((state) => state.fight.fight);
  const serverId = useAppSelector((state) => state.account.serverId);

  useEffect(() => {
    if (!!serverId) {
      toServer('checkFight');
    }
  }, [serverId]);

  useEffect(() => {
    fromServer('fight', (data, cb) => {
      dispatch(setFight(data));

      serverCallback.current = () => {
        if (data.callback) {
          toServer(data.callback, data.callbackArgs);
        }

        cb?.();
      };
    });

    return () => {
      cancelFromServer('fight');
    };
  }, []);

  useEffect(() => {
    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current?.destroy(true);
    };
  }, []);

  useEffect(() => {
    if (fight !== null) {
      Events.emit('setFightData', { ...fight, onFinish: onFinish });
    }
  }, [fight]);

  function _onClose() {
    Events.emit('fightClose');
    (onClose || onCloseDefault)();
    serverCallback.current?.();
  }

  function onCloseDefault() {
    dispatch(endFight());
  }

  let style: React.CSSProperties = {
    position: 'fixed',
    zIndex: 20020,
  };

  if (fight === null) {
    style = {
      ...style,

      left: -10000 - bounds[0],
      top: -10000 - bounds[1],
      width: bounds[2],
      height: bounds[3],
    };
  } else {
    style = {
      ...style,

      left: bounds[0],
      top: bounds[1],
      width: bounds[2],
      height: bounds[3],
    };
  }

  return (
    <div style={style}>
      <Blur />
      <CenterContainer zIndex={20021}>
        <div id="fightContainer" style={{ width: 1000, height: 600 }}>
          {/* <button onClick={_onClose} style={{ position: 'absolute', bottom: 0, right: 0 }}>
            End
          </button> */}
          {fight !== null && <FightResult onClose={_onClose} />}
          {fight?.roles && <ViewCharacters characters={fight.roles} />}
          <EffectTooltip />
        </div>
      </CenterContainer>
    </div>
  );
};

function EffectTooltip() {
  const t = useObjectTranslator();
  const [id, setId] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const eventId = EventEmitter.on('effect-icon-enter', ({ id, x, y }: { id: string; x: number; y: number }) => {
      setId(id);
      setPosition({ x, y });
    });

    const leaveEventId = EventEmitter.on('effect-icon-leave', () => {
      setId('');
    });

    return () => {
      EventEmitter.off(eventId);
      EventEmitter.off(leaveEventId);
    };
  }, []);

  if (id === '') {
    return null;
  }

  return <Tooltip text={t(`effect__${id}`)} offsetX={position.x} offsetY={-600 + position.y} />;
}

export default Fight;
