import * as React from 'react';
import { NpcMenu } from '../../../components/NpcMenu/NpcMenu';
import { useAppSelector } from '../../../hooks';
import { toServer } from '../../../util/ServerSocket';

export const NpcMenuArena: React.FC<{ onEnd: () => void }> = ({ onEnd }) => {
  const enterArena = React.useCallback(() => toServer('switchScene', 2), []);
  const [talkId, setTalkId] = React.useState('');
  const server = useAppSelector((state) => state.account.serverId);

  let content = (() => {
    switch (talkId) {
      case '1':
        return (
          <>
            <div className="clickable" onClick={() => toServer('huntBegin')}>
              Begin Hunt
            </div>
            <div className="clickable" onClick={() => toServer('huntComplete')}>
              Finish Hunt
            </div>
            <div className="clickable" onClick={() => setTalkId('')}>
              Back
            </div>
          </>
        );
      default:
        return (
          <>
            <div className="clickable" onClick={enterArena}>
              Enter Arena
            </div>
            {server === 2 && (
              <div className="clickable" onClick={() => setTalkId('1')}>
                Hunt Monsters
              </div>
            )}
          </>
        );
    }
  })();

  return (
    <NpcMenu onEnd={onEnd} npc={11002} talkId={talkId}>
      {content}
    </NpcMenu>
  );
};
