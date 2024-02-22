import './LevelUp.css';
import * as React from 'react';
import { LevelUpScene } from './LevelUpScene';
import { useAppDispatch, useAppSelector } from '../../hooks';
import useTranslator from '../../hooks/translate';
import { addKnownSkills } from '../../slices/skillsSlice';
import { CenterContainer } from '../../components/CenterContainer/CenterContainer';
import { JButton } from '../../components/UI/JButton';
import { cancelFromServer, fromServer } from '../../util/ServerSocket';

const config = {
  scene: [LevelUpScene],
  parent: 'levelUpContainer',
  transparent: true,
  scale: {
    width: 665,
    height: 520,
    mode: Phaser.Scale.RESIZE,
  },
};

export const LevelUp: React.FC<{}> = () => {
  const dispatch = useAppDispatch();
  const [skillsGained, setSkillsGained] = React.useState<number[] | null>(null);

  React.useEffect(() => {
    fromServer('levelUp', (skills) => {
      setSkillsGained(skills);
      dispatch(addKnownSkills(skills));
    });

    return () => {
      cancelFromServer('levelUp');
    };
  }, []);

  if (skillsGained === null) {
    return null;
  }

  return (
    <CenterContainer>
      <Scene />
      <FadeInText skillsGained={skillsGained} />
      <JButton
        style={{ position: 'absolute', bottom: 25, left: '50%', transform: 'translateX(-50%) translateX(-20px)' }}
        onClick={() => setSkillsGained(null)}
        text="Close"
      />
    </CenterContainer>
  );
};

function Scene() {
  const gameRef = React.useRef<Phaser.Game>();

  const scale = useAppSelector((state) => state.ui.scale);

  const height = 520 * scale;
  const width = 665 * scale;

  React.useEffect(() => {
    if (gameRef.current === undefined) {
      gameRef.current = new Phaser.Game(config);
    }

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = undefined;
    };
  });

  return (
    <div style={{ width, height }}>
      <div id="levelUpContainer" />
    </div>
  );
}

const FadeInText: React.FC<{ skillsGained: number[] }> = ({ skillsGained }) => {
  const t = useTranslator();
  const scale = useAppSelector((state) => state.ui.scale);
  const [fadeProp, setFadeProp] = React.useState({ fade: 'hidden' });

  React.useEffect(() => {
    setFadeProp({ fade: 'fade-in' });
    return () => {};
  }, []);

  return (
    <div
      className={fadeProp.fade}
      style={{
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        top: 355 * scale,
        left: 160 * scale,
        width: 290 * scale,
        height: 45 * scale,
        textAlign: 'center',
        zIndex: 11,
        fontSize: 16 * scale,
      }}>
      <span style={{ width: '100%' }}>
        You discovered skill:{' '}
        <b style={{ color: 'blue', pointerEvents: 'none' }}>{skillsGained.map((id) => t(`skill__${id}--name`)).join(',')}</b>
      </span>
    </div>
  );
};
