import { useEffect, useRef, useState } from 'react';
import { CenterContainer } from '../../../components/CenterContainer/CenterContainer';
import { JButton } from '../../../components/UI/JButton';
import { useAppSelector } from '../../../hooks';
import { AchievementScene } from './AchievementScene';
import useTranslator from '../../../hooks/translate';
import { cancelFromServer, fromServer } from '../../../util/ServerSocket';

const config = {
  scene: [AchievementScene],
  parent: 'achievementContainer',
  transparent: true,
  scale: {
    width: 675,
    height: 428,
    mode: Phaser.Scale.RESIZE,
  },
};

export function AchievementPopup() {
  const t = useTranslator();
  const [reloadNumber, setReloadNumber] = useState(0);
  const queue = useRef<any[]>([]);

  console.debug('Manual reload of achivement popup', reloadNumber);

  useEffect(() => {
    fromServer('achievement', (achievement) => {
      // Add achievement to queue
      queue.current.push(achievement);
      setReloadNumber(Date.now());
    });

    return () => {
      cancelFromServer('achievement');
    };
  }, []);

  return (
    <CenterContainer>
      <Scene queue={queue.current.length}>
        {queue.current.length !== 0 && (
          <>
            <FadeInText
              style={{
                position: 'absolute',
                top: '75%',
              }}>
              {t(`achievement__${queue.current[0].id}`)}
            </FadeInText>
          </>
        )}
      </Scene>
      {queue.current.length !== 0 && (
        <JButton
          style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translate(-50%, 100%)' }}
          onClick={() => {
            queue.current.splice(0, 1);
            setReloadNumber(Date.now());
          }}
          text="Close"
        />
      )}
    </CenterContainer>
  );
}

function Scene({ queue, children }: { queue: number; children?: React.ReactNode }) {
  const gameRef = useRef<Phaser.Game>();

  const scale = useAppSelector((state) => state.ui.scale);
  const [previousHidden, setPreviousHidden] = useState(queue);

  const height = config.scale.height * scale;
  const width = config.scale.width * scale;

  useEffect(() => {
    if (gameRef.current === undefined) {
      gameRef.current = new Phaser.Game(config);
    }

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = undefined;
    };
  }, []);

  if (previousHidden !== queue) {
    setPreviousHidden(queue);

    gameRef.current?.scene.stop('achievement');
    gameRef.current?.scene.start('achievement');
  }

  return (
    <div style={{ display: queue === 0 ? 'none' : '', width, height }}>
      <div id="achievementContainer"></div>
      {children}
    </div>
  );
}

function FadeInText({ style, children }: { style?: React.CSSProperties; children?: React.ReactNode }) {
  const [fadeProp, setFadeProp] = useState({ fade: 'hidden' });

  useEffect(() => {
    setFadeProp({ fade: 'fade-in' });
    return () => {};
  }, []);

  return (
    <div
      className={fadeProp.fade}
      style={{
        ...style,
        width: '100%',
        textAlign: 'center',
        fontSize: '1vw',
        fontFamily: 'KOMIKAK',
      }}>
      {children}
    </div>
  );
}
