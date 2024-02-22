import { useMemo } from 'react';
import Arena from '../Arena/Arena';
import { useAppSelector } from '../../hooks';
import Village from '../Village/Village';
import { Field } from '../Field/Field';
import { NewPlayer } from '../NewPlayer/NewPlayer';
import { Scene } from '../../enums';
import { DemonCity } from '../Village/DemonCity';
import { LasNoches } from '../LasNoches/LasNoches';
import { LasNochesPartOne } from '../LasNoches/LasNochesPartOne';
import { Valhalla } from '../Valhalla/Valhalla';
import { Dungeon } from '../Valhalla/Dungeon';
import { Home } from '../Home/Home';

const GameStateFactory: React.FC<{}> = () => {
  const scene = useAppSelector((state) => state.scene.scene);

  function getContent() {
    switch (scene) {
      case Scene.NEW_PLAYER:
        return <NewPlayer />;
      case Scene.ARENA:
        return <Arena />;
      case Scene.ANGEL_CITY:
      case Scene.FIRE_VILLAGE:
      case Scene.WATER_VILLAGE:
      case Scene.LIGHTNING_VILLAGE:
      case Scene.WIND_VILLAGE:
      case Scene.EARTH_VILLAGE:
        return <Village />;
      case Scene.Demon_City:
        return <DemonCity />;
      case Scene.Valhalla:
        return <Valhalla />;
      case Scene.Dungeon:
        return <Dungeon />;
      case Scene.Las_Noches:
        return <LasNoches />;
      case Scene.LAS_NOCHES_PART_ONE:
        return <LasNochesPartOne />;
      case Scene.Home:
        return <Home />;
      default:
        return <Field />;
    }
  }

  const content = useMemo(getContent, [scene]);

  return content;
};

export default GameStateFactory;
