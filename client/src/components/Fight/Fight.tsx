import './Fight.css';
import * as React from 'react';
import Phaser from 'phaser';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { FightState, endFight, setFight } from '../../slices/fightSlice';
import { FightScene, CharacterDataLoader } from './Scenes';
import { setStats } from '../../slices/statSlice';
import { ViewCharacters } from './components/ViewCharacters';
import { FightResult } from './components/FightResult';
import { setBossFight, winFight } from '../../slices/arenaSlice';

import EventEmitter from '../../util/EventEmitter';
import useObjectTranslator from '../../hooks/objectTranslate';
import { Tooltip } from '../Tooltips/Tooltip';
import { Blur } from '../Blur';
import { CenterContainer } from '../CenterContainer/CenterContainer';
import { Spinner } from '../Spinner';
import { cancelFromServer, fromServer, toServer } from '../../util/ServerSocket';
import DefaultScene from '../../features/Fight/Scenes/DefaultScene';
import { CombatPlayerScene } from '../../features/Fight/Scenes/CombatPlayerScene';
import { PreloadScene } from '../../features/Fight/Scenes/PreloadScene';

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
  const serverCallback = React.useRef<() => void>();
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.fight.state);
  const fight = useAppSelector((state) => state.fight.fight);
  const serverId = useAppSelector((state) => state.account.serverId);

  React.useEffect(() => {
    if (!!serverId) {
      toServer('checkFight');
    }
  }, [serverId]);

  React.useEffect(() => {
    fromServer('fight', (data, cb) => {
      dispatch(setFight(data));
      // console.log(data);

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
  });

  React.useEffect(() => {
    if (fight === null) return;

    const game = new Phaser.Game(config);

    game.scene.start('characterDataLoader', { ...fight, onFinish: onFinish });

    return () => {
      game.destroy(true);
    };
  }, [fight]);

  const _onClose = React.useCallback(() => {
    (onClose || onCloseDefault)();
    serverCallback.current?.();
  }, [fight, onClose]);

  const onCloseDefault = React.useCallback(() => {
    dispatch(endFight());

    if (fight.exp) {
      dispatch(setStats({ exp: fight.exp }));
    }

    if (fight.fighterIndex) {
      dispatch(winFight(fight.fighterIndex));
    }
    if (fight.bossFight) {
      dispatch(setBossFight(fight.bossFight));
    }
  }, [fight]);

  if (state === FightState.LOADING) {
    return (
      <>
        <Blur />
        <CenterContainer zIndex={20020}>
          <div style={{ width: 1000, height: 600, background: 'black', color: 'whitesmoke' }}>
            <CenterContainer>
              <Spinner width={32} />
            </CenterContainer>
            Contacting Server...
          </div>
        </CenterContainer>
      </>
    );
  }

  if (fight === null) return null;

  return (
    <>
      <Blur />
      <CenterContainer zIndex={20020}>
        <div id="fightContainer" style={{ width: 1000, height: 600 }}>
          <button onClick={_onClose} style={{ position: 'absolute', bottom: 0, right: 0 }}>
            End
          </button>
          <FightResult onClose={_onClose} />
          <ViewCharacters characters={fight.roles} />
          <EffectTooltip />
        </div>
      </CenterContainer>
    </>
  );
};

function EffectTooltip() {
  const t = useObjectTranslator();
  const [id, setId] = React.useState('');
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
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
