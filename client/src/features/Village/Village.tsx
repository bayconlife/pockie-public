import * as React from 'react';
import { BottomMenu } from '../BottomMenu/BottomMenu';
import { useAppSelector } from '../../hooks';
import Building from './Building';
import GameContainer from '../../components/GameContainer';
import { SmallMap } from '../SmallMap/SmallMap';
import { Scene } from '../../enums';
import { NpcMenuHall } from './Npc/NpcMenuHall';
import { TopMenu } from '../TopMenu/TopMenu';
import { Shop } from '../Shop/Shop';
import { NpcMenuArena } from './Npc/NpcMenuArena';
import { NpcMenuShop } from './Npc/NpcMenuShop';
import { NpcMenuBlacksmith } from './Npc/NpcMenuBlacksmith';
import { Armory } from '../Armory/Armory';
import { Kennel } from '../Kennel/Kennel';
import { NpcMenuKennel } from './Npc/NpcMenuKennel';
import villages from './villages.json';
import { Hunt } from '../Hunt/Hunt';
import { JButton } from '../../components/UI/JButton';
import { TaskBoard } from './TaskBoard';
import { PetTracing } from '../Kennel/PetTracing';
import { MarketBoard } from '../Market/MarketBoard';
import { toServer } from '../../util/ServerSocket';
import { Collection } from '../Collection/Collection';

const scenes: { [id: string]: string } = {
  [Scene.ANGEL_CITY]: 'angel',
  [Scene.Demon_City]: 'demon',
  [Scene.FIRE_VILLAGE]: 'fire',
  [Scene.WATER_VILLAGE]: 'water',
  [Scene.LIGHTNING_VILLAGE]: 'lightning',
  [Scene.WIND_VILLAGE]: 'wind',
  [Scene.EARTH_VILLAGE]: 'earth',
};

interface npc {
  position: { x: number; y: number };
  name: { top: number; left: number; text: string };
  key: string;
  onClick: () => void;
}

enum villageNPC {
  Hall = 'hall',
  Blacksmith = 'blacksmith',
  ItemShop = 'shop',
  PetKennel = 'kennel',
  Arena = 'arena',
}

const Village: React.FC<{}> = () => {
  const scale = useAppSelector((state) => state.ui.scale);
  const currentScene = useAppSelector((state) => state.scene.scene);
  const npcs = useAppSelector((state) => state.scene.npcs);
  const villageScene = getVillageJson(currentScene);
  const bounds = useAppSelector((state) => state.ui.bounds);

  const [showHall, setShowHall] = React.useState(false);
  const [showArena, setShowArena] = React.useState(false);
  const [showNpcMenuShop, setShowNpcMenuShop] = React.useState(false);
  const [showBlacksmith, setShowBlacksmith] = React.useState(false);
  const [showShop, setShowShop] = React.useState(false);
  const [showKennel, setShowKennel] = React.useState(false);
  const [showTaskBoard, setShowTaskBoard] = React.useState(false);
  const [showMarket, setShowMarket] = React.useState(false);

  function setShowNpc(key: string) {
    switch (key) {
      case villageNPC.Hall:
        setShowHall(!showHall);
        break;
      case villageNPC.Blacksmith:
        setShowBlacksmith(!showBlacksmith);
        break;
      case villageNPC.ItemShop:
        setShowNpcMenuShop(!showNpcMenuShop);
        break;
      case villageNPC.PetKennel:
        setShowKennel(!showKennel);
        break;
      case villageNPC.Arena:
        setShowArena(!showArena);
        break;
      default:
    }
  }

  const npcMap = villageScene.reduce((accumulator: { [id: string]: npc }, currentEntry) => {
    // currentEntry will be the next value in the list you are iterating
    accumulator[currentEntry.id] = {
      ...currentEntry,
      onClick: () => setShowNpc(currentEntry.key),
    };

    return accumulator; // This is what will be passed into the next call as accumulator
  }, {}); // the {} is what is initially passed in as the first value of accumulator

  const buildings = npcs
    .filter((id) => id in npcMap)
    .map((id) => (
      <Building
        key={npcMap[id].key}
        x={npcMap[id].position.x}
        y={npcMap[id].position.y}
        name={npcMap[id].name}
        npc={id}
        scale={scale}
        src={`scenes/village/${scenes[currentScene]}/${npcMap[id].key}.png`}
        onClick={npcMap[id].onClick}
      />
    ));

  React.useEffect(() => {
    const autoTalk = localStorage.getItem('autoInteract');

    if (autoTalk !== null) {
      if (autoTalk in npcMap) {
        localStorage.removeItem('autoInteract');
        npcMap[autoTalk].onClick();
      } else if (autoTalk === 'open__taskboard') {
        localStorage.removeItem('autoInteract');
        setShowTaskBoard(true);
      }
    }
  });

  return (
    <GameContainer src={`scenes/village/${scenes[currentScene]}/bg.png`} buildings={buildings}>
      <TopMenu />

      {showHall && <NpcMenuHall onEnd={() => setShowHall(false)} />}
      {showArena && <NpcMenuArena onEnd={() => setShowArena(false)} />}
      {showNpcMenuShop && <NpcMenuShop onClick={() => setShowShop(true)} onEnd={() => setShowNpcMenuShop(false)} />}
      {showBlacksmith && <NpcMenuBlacksmith onEnd={() => setShowBlacksmith(false)} />}
      {showKennel && <NpcMenuKennel onEnd={() => setShowKennel(false)} />}

      <Kennel />
      <PetTracing />
      <Armory />
      <SmallMap />
      <BottomMenu />

      <JButton position={{ x: bounds[2] - 75, y: 90 }} text="Home" onClick={() => toServer('switchScene', 4101)} />
      <JButton position={{ x: bounds[2] - 75, y: 120 }} text="Market" onClick={() => setShowMarket(!showMarket)} />
      <JButton position={{ x: bounds[2] - 75, y: 150 }} text="Tasks" onClick={() => setShowTaskBoard(!showTaskBoard)} />

      {showShop && <Shop onClose={() => setShowShop(false)} />}
      {showTaskBoard && <TaskBoard onClose={() => setShowTaskBoard(false)} />}
      <Hunt />
      {showMarket && <MarketBoard onClose={() => setShowMarket(false)} />}
    </GameContainer>
  );
};

function getVillageJson(village: number) {
  switch (village) {
    case Scene.FIRE_VILLAGE:
      return villages['fire'];
    case Scene.WATER_VILLAGE:
      return villages['water'];
    case Scene.LIGHTNING_VILLAGE:
      return villages['lightning'];
    case Scene.WIND_VILLAGE:
      return villages['wind'];
    case Scene.EARTH_VILLAGE:
      return villages['earth'];
    default:
      return villages['fire'];
  }
}

export default Village;
