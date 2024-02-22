import './Valhalla.css';

import * as React from 'react';
import GameContainer from '../../components/GameContainer';
import { useAppSelector } from '../../hooks';
import { BottomMenu } from '../BottomMenu/BottomMenu';
import { SmallMap } from '../SmallMap/SmallMap';
import { TopMenu } from '../TopMenu/TopMenu';
import Building from '../Village/Building';
import { Difficulty } from './Difficulty';
import { PlayerList } from '../../components/Players/PlayerList';
import useTranslator from '../../hooks/translate';
import { Challenge } from './Challenge';
import { OutfitDisplay } from './OutfitDisplay';
import { SERVER_CONFIG } from '../../util/serverConfig';

// prettier-ignore
const elements: [number, number][][] = [
  [[0, 145], [349, 317]],
  [[556, 138], [203, 40]],
  [[812, 475], [-190, 176]],
  [[882, 284], [8, -15]],
  [[1083, 424], [-33, 116]],
  [[1117, 265], [18, 156]],
  [[1319, 90], [-195, 42]],
  [[1348, 465], [75, 159]]
];

export const Valhalla: React.FC<{}> = () => {
  const t = useTranslator();

  const scale = useAppSelector((state) => state.ui.scale);

  const [showDifficulty, setShowDifficulty] = React.useState(false);
  const [selected, setSelected] = React.useState(-1);
  const [dungeonInfo, setDungeonInfo] = React.useState<any>(null);

  const GATES = SERVER_CONFIG.VALHALLA;
  const buildings: JSX.Element[] = [];

  elements.forEach((d, idx) => {
    if (idx in GATES) {
      buildings.push(
        <Building
          className={`valhalla element__${idx}`}
          key={idx}
          x={d[0][0]}
          y={d[0][1]}
          scale={scale}
          src={`scenes/valhalla/buildings/${idx}.png`}
          npc={50001}
          name={{ left: d[1][0], top: d[1][1], text: t(`dungeon__${idx}--name`) }}
          onClick={() => {
            setShowDifficulty(!showDifficulty);
            setSelected(idx);
          }}
        />
      );
    }
  });

  return (
    <GameContainer src={`scenes/valhalla/bg.png`} buildings={buildings}>
      <TopMenu />
      <SmallMap />
      <BottomMenu />
      <PlayerList />

      {showDifficulty && (
        <Difficulty
          onClose={(info: any) => {
            setDungeonInfo(info);
            setShowDifficulty(false);
          }}
          selected={selected}
        />
      )}
      {dungeonInfo !== null && <Challenge onClose={() => setDungeonInfo(null)} info={dungeonInfo} />}

      <OutfitDisplay sets={dungeonInfo?.sets ?? []} />
    </GameContainer>
  );
};
