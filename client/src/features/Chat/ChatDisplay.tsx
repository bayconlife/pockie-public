import { useAppDispatch, useAppSelector } from '../../hooks';
import { Tabs } from './ChatBox';
import { Message } from '../../slices/chatSlice';
import { toServer } from '../../util/ServerSocket';
import { ContextMenu } from '../../components/ContextMenu/ContextMenu';
import { useRef, useState } from 'react';
import { blockAccount } from '../../slices/characterSlice';
import { emojiMap } from './Emojis';

export const ChatDisplay: React.FC<{ tab: Tabs }> = ({ tab }) => {
  const global = useAppSelector((state) => state.chat.global);
  const party = useAppSelector((state) => state.chat.party);

  function onClick(accountId: number, serverId: number) {
    toServer('viewCharacter', { serverId, accountId });
  }

  if (tab === Tabs.GLOBAL) {
    return <>{compose(global, onClick, true)}</>;
  }

  if (tab === Tabs.PARTY) {
    return <>{compose(party, onClick)}</>;
  }

  return null;
};

function compose(messages: Message[], onClick: (id: number, serverId: number) => void, showServer = false) {
  return [...messages]
    .reverse()
    .map((message, idx) => <ChatMessage key={idx + '-' + Date.now()} message={message} onClick={onClick} showServer={showServer} />);
}

function ChatMessage({
  message,
  onClick,
  showServer = false,
}: {
  message: Message;
  onClick: (id: number, serverId: number) => void;
  showServer: boolean;
}) {
  const dispatch = useAppDispatch();

  const nameRef = useRef<HTMLSpanElement>(null);

  const myAccountId = useAppSelector((state) => state.account.id);

  const [showContextMenu, setShowContextMenu] = useState(false);

  function replaceEmojis(message: string) {
    const lines = message.split(/:(\d+):/g).map((word) => (emojiMap[word] ? <img src={emojiMap[word]} title={word} /> : word));

    return lines;
  }

  return (
    <div onMouseLeave={() => setShowContextMenu(false)}>
      {showServer && message.serverId && `[S${message.serverId.toString().padStart(2, '0')}]`}
      <span
        ref={nameRef}
        style={{ cursor: 'pointer', textDecoration: 'underline' }}
        onClick={() => onClick(message.id, message.serverId)}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();

          if (message.id === myAccountId) {
            return;
          }

          setShowContextMenu(true);
        }}>
        {message.user}
      </span>
      :<span>{replaceEmojis(message.message)} </span>
      {nameRef.current && showContextMenu && (
        <ContextMenu position={{ x: nameRef.current.getBoundingClientRect().right, y: nameRef.current.getBoundingClientRect().y - 15 }}>
          <ContextMenu.Item
            title="Block"
            onClick={() => {
              dispatch(blockAccount(message.id));
              toServer('blockAccount', message.id);
            }}
          />
        </ContextMenu>
      )}
    </div>
  );
}
