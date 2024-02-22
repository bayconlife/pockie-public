import * as React from 'react';
import { BottomMenu } from '../BottomMenu/BottomMenu';
import { useAppDispatch, useAppSelector } from '../../hooks';
import Building from './Building';
import GameContainer from '../../components/GameContainer';
import { SmallMap } from '../SmallMap/SmallMap';
import { Scene } from '../../enums';
import { TopMenu } from '../TopMenu/TopMenu';
import { NpcMenuLasNoches } from './Npc/NpcMenuLasNoches';
import { NpcMenuValhalla } from './Npc/NpcMenuValhalla';

const scenes: { [id: string]: string } = {
  [Scene.ANGEL_CITY]: 'angel',
  [Scene.Demon_City]: 'demon',
  [Scene.FIRE_VILLAGE]: 'fire',
};

export const DemonCity: React.FC<{}> = () => {
  const scale = useAppSelector((state) => state.ui.scale);
  const currentScene = useAppSelector((state) => state.scene.scene);
  const [showLasNochesMenu, setShowLasNochesMenu] = React.useState(false);
  const [showValhallaMenu, setShowValhallaMenu] = React.useState(false);

  const buildings = [
    <Building
      key={'las-noches'}
      x={754}
      y={465}
      name={{ top: 170, left: 0, text: 'Storming Las Noches' }}
      npc={17003}
      scale={scale}
      src={`scenes/village/demon/lasNoches.png`}
      onClick={() => setShowLasNochesMenu(!showLasNochesMenu)}
    />,
    <Building
      key={'valhalla'}
      x={603}
      y={208}
      name={{ top: 17, left: 178, text: 'Valhalla' }}
      npc={17001}
      scale={scale}
      src={`scenes/village/demon/valhalla.png`}
      onClick={() => setShowValhallaMenu(!showValhallaMenu)}
    />,
  ];

  return (
    <GameContainer src={`scenes/village/${scenes[currentScene]}/bg.png`} buildings={buildings}>
      <TopMenu />
      <SmallMap />
      <BottomMenu />

      {showLasNochesMenu && <NpcMenuLasNoches onEnd={() => setShowLasNochesMenu(false)} />}
      {showValhallaMenu && <NpcMenuValhalla onEnd={() => setShowValhallaMenu(false)} />}
    </GameContainer>
  );
};
