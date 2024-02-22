import * as React from 'react';
import { NpcMenu } from '../../../components/NpcMenu/NpcMenu';
import { Scene } from '../../../enums';
import { useAppSelector } from '../../../hooks';
import { toServer } from '../../../util/ServerSocket';

export const NpcMenuHall: React.FC<{ onEnd: () => void }> = ({ onEnd }) => {
  const currentScene = useAppSelector((state) => state.scene.scene);
  const [talkId, setTalkId] = React.useState('');

  let content = (() => {
    switch (talkId) {
      case '1':
        return (
          <>
            <div className="clickable" onClick={() => toServer('villageSwap', 111, () => setTalkId(''))}>
              Fire Village
            </div>
            <div className="clickable" onClick={() => toServer('villageSwap', 211, () => setTalkId(''))}>
              Water Village
            </div>
            <div className="clickable" onClick={() => toServer('villageSwap', 311, () => setTalkId(''))}>
              Lightning Village
            </div>
            <div className="clickable" onClick={() => toServer('villageSwap', 411, () => setTalkId(''))}>
              Wind Village
            </div>
            <div className="clickable" onClick={() => toServer('villageSwap', 511, () => setTalkId(''))}>
              Earth Village
            </div>
            <div className="clickable" onClick={() => setTalkId('')}>
              Back
            </div>
          </>
        );
      default:
        return (
          <>
            <div key="lounge">Enter Lounge</div>
            <div key="hall">Enter Hall</div>
            <div
              className="clickable"
              onClick={() => {
                toServer('checkMissedAchievements');
                onEnd();
              }}>
              Check Missed Achievements
            </div>
            {currentScene === Scene.ANGEL_CITY && (
              <div className="clickable" onClick={() => setTalkId('1')}>
                Change Village
              </div>
            )}
          </>
        );
    }
  })();

  return (
    <NpcMenu
      onEnd={onEnd}
      npc={currentScene === Scene.ANGEL_CITY ? 16001 : 11001}
      imageOverride={currentScene === Scene.ANGEL_CITY ? 16001 : 10001 + Math.floor(currentScene / 100) * 1000}
      talkId={talkId === '1' ? '__village_swap' : ''}>
      {content}
    </NpcMenu>
  );
};
