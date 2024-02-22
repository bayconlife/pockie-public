import './Field.css';

import * as React from 'react';
import GameContainer from '../../components/GameContainer';
import { Position } from '../../components/interfaces/Interfaces';
import JPanel from '../../components/UI/JPanel';
import { MultilineLabel } from '../../components/UI/MultilineLabel';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { BottomMenu } from '../BottomMenu/BottomMenu';
import { SmallMap } from '../SmallMap/SmallMap';
import useTranslator from '../../hooks/translate';
import { Scene } from '../../enums';
import { TopMenu } from '../TopMenu/TopMenu';
import Panel from '../../components/Panel/Panel';
import { JButton } from '../../components/UI/JButton';
import { batch } from 'react-redux';
import { JSelect } from '../../components/UI/JSelect';
import { ContextMenu } from '../../components/ContextMenu/ContextMenu';
import { Monster } from '../../slices/sceneSlice';
import { Exploration } from './Exploration';
import { ExplorationBuilding } from './ExplorationBuilding';
import { setExploration } from '../../slices/fieldSlice';
import { FieldBoss } from './FieldBoss';
import { FieldNpc } from './FieldNpc';
import { Hunt } from '../Hunt/Hunt';
import { FightState, setFightState } from '../../slices/fightSlice';
import { CDNImage } from '../../components/Elements/Image';
import { ExplorationV2 } from './ExplorationV2';
import { ExplorationCards } from './ExplorationCards';
import { cancelFromServer, fromServer, toServer } from '../../util/ServerSocket';
import { NinjaHouse } from './NinjaHouse';

const style: React.CSSProperties = {
  color: 'whitesmoke',
  textAlign: 'center',
};

export const Field: React.FC<{}> = () => {
  const dispatch = useAppDispatch();
  let scene = useAppSelector((state) => state.scene.scene);
  let monsters = useAppSelector((state) => state.scene.monsters);
  let npcs = useAppSelector((state) => state.scene.npcs);
  const boss = useAppSelector((state) => state.scene.boss);
  const [showExploration, setShowExploration] = React.useState(false);
  const [showNinjaHouse, setShowNinjaHouse] = React.useState(false);
  const [positions, setPositions] = React.useState<{ [scene: number]: number[] }>({});
  const [ninjaHousePositions, setNinjaHousePositions] = React.useState<{ [scene: number]: number[] }>({});

  React.useEffect(() => {
    fetch('json/exploration.json')
      .then((r) => r.json())
      .then((d) => setPositions(d));
    fetch('json/ninjaHouse.json')
      .then((r) => r.json())
      .then((d) => setNinjaHousePositions(d));
    fromServer('updateExploration', (partial) => dispatch(setExploration(partial)));
    toServer('exploreInfo');

    return () => {
      cancelFromServer('updateExploration');
    };
  }, []);

  if ([Scene.FIRE_VILLAGE, 211, 311, 411, 511].includes(scene)) {
    return null;
  }

  const outer = [
    boss && <FieldBoss key={`${scene}-npc-${boss}`} id={boss} />,
    ...npcs.map((npc, idx) => <FieldNpc key={`${scene}-npc-${npc}`} id={npc} />),
  ];

  const buildings = [
    <ExplorationBuilding
      key={'exploration'}
      x={positions[scene]?.[0] ?? -10000}
      y={positions[scene]?.[1] ?? -10000}
      src={`scenes/exploration/${scene}.png`}
      onClick={() => setShowExploration(!showExploration)}
    />,
    <ExplorationBuilding
      key={'ninjaHouse'}
      x={ninjaHousePositions[scene]?.[0] ?? -10000}
      y={ninjaHousePositions[scene]?.[1] ?? -10000}
      src={`scenes/ninjaHouse/${scene}.png`}
      onClick={() => setShowNinjaHouse(!showExploration)}
    />,
  ];

  return (
    <GameContainer src={`scenes/backgrounds/${scene}.png`} outer={outer} buildings={buildings}>
      <TopMenu />
      <JPanel
        size={{ width: 3 + 70 * monsters.length, height: 92 }}
        style={{ left: `calc(50% - ${(monsters.length * 70) / 2}px)`, top: 30 }}>
        {monsters.map((monster, idx) => (
          <MonsterBox key={idx} position={{ x: 2 + 70 * idx, y: 0 }} monster={monster} />
        ))}
      </JPanel>

      {/* {showExploration && <Exploration onClose={() => setShowExploration(false)} />} */}
      {showExploration && <ExplorationV2 onClose={() => setShowExploration(false)} />}
      <ExplorationCards />
      <Hunt />
      {showNinjaHouse && <NinjaHouse onClose={() => setShowNinjaHouse(false)} />}

      <SmallMap />
      <BottomMenu />
    </GameContainer>
  );
};

const MonsterBox: React.FC<{ position: Position; monster: Monster }> = ({ position, monster }) => {
  const t = useTranslator();
  const dispatch = useAppDispatch();

  const ref = React.useRef<HTMLDivElement>(null);

  const [showContextMenu, setShowContextMenu] = React.useState<Position | null>(null);
  const [showMultiFight, setShowMultiFight] = React.useState(false);

  function onFight(e?: React.MouseEvent) {
    e?.preventDefault();
    e?.stopPropagation();

    dispatch(setFightState(FightState.LOADING));
    toServer('fightMonster', { id: monster.id }, (data: any) => {});
  }

  function onMultiFight(e?: React.MouseEvent) {
    e?.preventDefault();
    e?.stopPropagation();

    batch(() => {
      setShowMultiFight(true);
      setShowContextMenu(null);
    });
  }

  React.useEffect(() => {
    const autoFight = localStorage.getItem('autoInteract');

    if (autoFight !== null && autoFight === monster.id.toString()) {
      localStorage.removeItem('autoInteract');
      onFight();
    }
  });

  return (
    <div
      ref={ref}
      onClick={onFight}
      onContextMenu={(e) => {
        e.preventDefault();
        setShowContextMenu({ x: e?.pageX ?? 0, y: e?.pageY ?? 0 });
      }}
      onMouseLeave={() => setShowContextMenu(null)}
      style={{ position: 'absolute', width: 67, height: 86, top: position.y, left: position.x }}
      // title={`+${Math.pow(1.5, monster.level % 11).toFixed(2)}% item drop rate`}
    >
      <JPanel className="monster-box" size={{ width: 67, height: 86 }} background="UIResource.List.HobgoblinBG">
        <MultilineLabel
          className="monster_box__name"
          size={{ width: 66, height: 18 }}
          position={{ x: 2, y: 66 }}
          text={t(`monster__${monster.id}--name`)}
          title={t(`monster__${monster.id}--name`)}
        />

        <JPanel size={{ width: 51, height: 51 }} position={{ x: 8, y: 4 }}>
          <CDNImage src={`icons/monsters/${monster.avatar}.png`} width="50" height="50" />
          <button
            className="absolute button-no-style pointer"
            style={{ top: -4, right: -8 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              setShowContextMenu({ x: e.pageX ?? 0, y: e.pageY ?? 0 });
            }}>
            ⚙️
          </button>
        </JPanel>
        <MultilineLabel
          size={{ width: 55, height: 18 }}
          position={{ x: 8, y: 45 }}
          text={`Lv. ${monster.level}`}
          style={{ ...style, overflowY: 'hidden', color: 'gold' }}
        />
      </JPanel>

      {showContextMenu && ref.current && (
        <ContextMenu position={showContextMenu} style={{ width: 100 }}>
          <ContextMenu.Item onClick={onFight} title="Fight" />
          <ContextMenu.Item onClick={onMultiFight} title="Chain Attack" />
        </ContextMenu>
      )}

      {showMultiFight && <MultiFight id={monster.id} onClose={() => setShowMultiFight(false)} />}
    </div>
  );
};

const message =
  'Select how many of the monster you want to fight. You cannot do any other battles during this time or until you have canceled the fight.';

const INFO = 'Time: {}';

function MultiFight({ id, onClose }: { id: number; onClose: () => void }) {
  const [amount, setAmount] = React.useState(1);

  const time = new Date();

  time.setTime(0);
  time.setSeconds(amount * 180);

  let info = INFO.replace('{}', time.toISOString().substring(11, 19));

  return (
    <Panel name="Chain Attack" moveable={false}>
      <JPanel size={{ width: 400, height: 282 }}>
        <JPanel size={{ width: 400, height: 250 }} background="UIResource.Common.BigBG1">
          <JPanel size={{ width: 390, height: 100 }} position={{ x: 5, y: 5 }} background="UIResource.Common.BigBG3">
            <MultilineLabel size={{ width: 380, height: 90 }} position={{ x: 5, y: 5 }} text={message} />
          </JPanel>

          <JPanel size={{ width: 390, height: 30 }} position={{ x: 5, y: 110 }} background="UIResource.Common.BigBG5">
            <MultilineLabel size={{ width: 209, height: 20 }} position={{ x: 5, y: 5 }} text="Choose amount to chain attack:" />

            <JSelect
              size={{ width: 86, height: 20 }}
              position={{ x: 217, y: 5 }}
              onSelect={(e) => setAmount(parseInt(e, 10))}
              value={'' + amount}>
              {Array.apply(null, Array(30)).map((_, idx) => (
                <option key={idx}>{idx + 1}</option>
              ))}
            </JSelect>

            <JButton size={{ width: 80, height: 20 }} position={{ x: 305, y: 5 }} text="Max" onClick={() => setAmount(30)} />
          </JPanel>

          <JPanel size={{ width: 390, height: 100 }} position={{ x: 5, y: 145 }} background="UIResource.Common.BigBG3">
            <MultilineLabel size={{ width: 380, height: 90 }} position={{ x: 5, y: 5 }} text={info} />
          </JPanel>

          {/* <MultilineLabel size={{ width: 40, height: 20 }} position={{ x: 140, y: 83 }} text="Time: " />
          <MultilineLabel size={{ width: 60, height: 20 }} position={{ x: 180, y: 83 }} text={time.toISOString().substring(11, 19)} /> */}
        </JPanel>

        <JButton
          size={{ width: 76, height: 22 }}
          position={{ x: 60, y: 260 }}
          text="Fight"
          onClick={() => {
            toServer('fieldFightMulti', { id, amount });
            onClose();
          }}
        />
        <JButton size={{ width: 76, height: 22 }} position={{ x: 274, y: 260 }} text="Cancel" onClick={() => onClose()} />
      </JPanel>
    </Panel>
  );
}
