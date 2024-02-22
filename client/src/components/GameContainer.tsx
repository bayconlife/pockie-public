import './GameContainer/GameContainer.css';
import './GameContainer/Building.css';

import * as React from 'react';
import { ChatBox } from '../features/Chat/ChatBox';
import { LevelUp } from '../features/LevelUp/LevelUp';
import { Party } from '../features/Party/Party';
import { QuestInformation } from '../features/QuestInformation/QuestInformation';
import { SlotMachine } from '../features/SlotMachine/SlotMachine';
import { MapContainer } from '../features/SmallMap/MapContainer';
import { WishingPot } from '../features/WishingPot/WishingPot';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setBounds, setScale } from '../slices/uiSlice';
import EventEmitter from '../util/EventEmitter';
import Fight from './Fight/Fight';
import { Notice } from './Notice/Notice';
import { ServerPrompt } from './Prompt/ServerPrompt';
import { MultiFightDisplay } from '../features/MultiFightDisplay/MultiFightDisplay';
import { DragItem } from './Item/DragItem';
import { CardReward } from '../features/CardRewards/CardReward';
import { LoadState } from '../slices/accountSlice';
import { ViewCharacter } from '../features/ViewCharacter/ViewCharacter';
import { Hunt } from '../features/Hunt/Hunt';
import { Errors } from '../features/Errors/Errors';
import { AchievementPopup } from '../features/Achievements/AchievementPopup/AchievementPopup';
import { InternalPrompt } from './Prompt/InternalPrompt';
import { CDNImage } from './Elements/Image';
import { PlayerList } from './Players/PlayerList';

const slotScenes = [2601, 2602, 2603, 2604, 2605, 2701, 2702, 2703, 2704, 2801, 2802, 2803, 2804];

interface Props {
  src: string;
  outer?: React.ReactNode;
  buildings?: JSX.Element[];
}

const GameContainer: React.FC<Props> = ({ src, children, outer, buildings }) => {
  const dispatch = useAppDispatch();
  const scene = useAppSelector((state) => state.scene.scene);
  const loadState = useAppSelector((state) => state.account.loading);

  React.useEffect(() => {
    const updateBounds = () => {
      const container = document.getElementById('game-container');

      if (container === null) {
        return;
      }

      const bounds = container.getBoundingClientRect();

      dispatch(setScale(bounds.width / 1920));
      dispatch(setBounds([bounds.left, bounds.top, bounds.width, bounds.height]));
    };

    updateBounds();

    window.addEventListener('resize', updateBounds);

    return () => {
      window.removeEventListener('resize', updateBounds);
    };
  }, []);

  return (
    <main style={{ background: 'black' }}>
      <div id="game-container" className="grid--overlap">
        <CDNImage id={'background'} src={src} style={{ maxWidth: '100%', maxHeight: '100vh', margin: 'auto', display: 'block' }} />

        {loadState === LoadState.LOADED && (
          <>
            <WishingPot />
            <MultiFightDisplay />

            {slotScenes.includes(scene) && (
              <>
                <SlotMachine />
                {/* <PlayerList /> */}
              </>
            )}
            <Notice />
            <LevelUp />
            <QuestInformation />
            <CardReward />
            <ServerPrompt />
            <AchievementPopup />
            <MapContainer />

            <Fight />
            {/* <Fight /> */}
            <ChatBox />

            <div onMouseMove={(e) => EventEmitter.emit('mouseMove', e)}>{buildings}</div>
            {outer}
            {children}

            <DragItem />
            <Party />
            <ViewCharacter />
            <Errors />
            <InternalPrompt />
          </>
        )}
      </div>

      <div id="tooltip" style={{ position: 'absolute', zIndex: 22000, pointerEvents: 'none', color: 'whitesmoke', fontSize: '0.75rem' }} />
    </main>
  );
};

export default GameContainer;
