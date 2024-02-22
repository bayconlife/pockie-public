import './Chat.css';
import ImageButton from '../../components/Buttons/ImageButton';
import { NineSlice } from '../../components/NineSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { addGlobalMessage, addPartyMessage } from '../../slices/chatSlice';
import { ChatDisplay } from './ChatDisplay';
import { cancelFromServer, fromServer, toServer } from '../../util/ServerSocket';
import { useEffect, useRef, useState } from 'react';
import { EmojiButton } from './EmojiButton';

export enum Tabs {
  GLOBAL = 'global',
  PARTY = 'party',
}

export function ChatBox() {
  const dispatch = useAppDispatch();

  const party = useAppSelector((state) => state.party.party);
  const blockedAccountIds = useAppSelector((state) => state.character.social.blockedAccountIds);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [input, setInput] = useState('');
  const [height, setHeight] = useState(() => {
    if ((localStorage.getItem('chat-minimized') ?? 'false') === 'true') {
      return 38;
    }

    return Number(localStorage.getItem('chat-height') ?? '300');
  });
  const [width, setWidth] = useState(Number(localStorage.getItem('chat-width') ?? '500'));
  const [tab, setTab] = useState(Tabs.GLOBAL);
  const [outputChannel, setOutputChannel] = useState('global');
  const [isMinimized, setIsMinimized] = useState((localStorage.getItem('chat-minimized') ?? 'false') === 'true');

  useEffect(() => {
    fromServer('receiveMessage', (data) => {
      if (blockedAccountIds.includes(data.id)) {
        return;
      }

      if (data.channel === 'party') {
        dispatch(addPartyMessage(data));
      } else {
        dispatch(addGlobalMessage(data));
      }
    });

    return () => {
      cancelFromServer('receiveMessage');
    };
  }, [blockedAccountIds]);

  function sendMessage() {
    if (input !== '') {
      toServer('sendMessage', { channel: outputChannel, message: input });

      setInput('');

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  }

  return (
    <div
      ref={containerRef}
      id="chat-box"
      style={{
        position: 'absolute',
        bottom: 2,
        left: 5,
        zIndex: 21000,
        width,
        height,
        display: 'grid',
        gridTemplateRows: '1fr 36px',
      }}>
      <div style={{ position: 'absolute', top: -20, left: 4, display: 'flex', zIndex: 4 }}>
        <div
          className={`chat-tab ${tab === Tabs.GLOBAL && '--active'}`}
          onClick={() => {
            setTab(Tabs.GLOBAL);
            setOutputChannel(Tabs.GLOBAL);
            setIsMinimized(false);
            setHeight(Number(localStorage.getItem('chat-height') ?? '300'));
          }}>
          Global
        </div>
        {party !== undefined && (
          <div
            className={`chat-tab ${tab === Tabs.PARTY && '--active'}`}
            onClick={() => {
              setTab(Tabs.PARTY);
              setOutputChannel(Tabs.PARTY);
              setIsMinimized(false);
              setHeight(Number(localStorage.getItem('chat-height') ?? '300'));
            }}>
            Party
          </div>
        )}
      </div>

      {!isMinimized && (
        <ImageButton
          defaultImage="features/chat/82.png"
          onClick={() => {
            setIsMinimized(!isMinimized);
            setHeight(38);
            localStorage.setItem('chat-minimized', 'true');
          }}
          style={{ position: 'absolute', top: 2, right: 0 }}
          imageStyle={{ transform: 'translateY(-100%)' }}
          // disabled={chatSize === 3}
        />
      )}
      {isMinimized && (
        <ImageButton
          defaultImage="features/chat/77.png"
          onClick={() => {
            setIsMinimized(!isMinimized);
            setHeight(Number(localStorage.getItem('chat-height') ?? '300'));
            localStorage.setItem('chat-minimized', 'false');
          }}
          style={{ position: 'absolute', top: 2, right: 0 }}
          imageStyle={{ transform: 'translateY(-100%)' }}
          // disabled={chatSize === 3}
        />
      )}

      <div style={{ width: width, height: isMinimized ? 0 : height - 36 }}>
        <NineSlice
          className={`chat-background ${isMinimized ? '--minimized' : ''}`}
          url={`${process.env.REACT_APP_CDN_PATH}features/chat/3.png`}
          slice={[30, 30]}
          style={{ position: 'absolute', top: 0, left: 0, width: width - 5, height: height - 42, zIndex: 1 }}
        />

        <pre
          className={`chat-display`}
          style={{
            position: 'absolute',
            top: 5,
            left: 5,
            margin: 0,
            width: width - 9,
            height: isMinimized ? 0 : height - 48,
            zIndex: 2,
          }}>
          <ChatDisplay tab={tab} />
        </pre>
      </div>

      <div className="grid--overlap" style={{ padding: 5 }}>
        <NineSlice
          url={`${process.env.REACT_APP_CDN_PATH}features/chat/88.png`}
          slice={[5, 5]}
          style={{ position: 'absolute', bottom: 0, left: 0, width: width - 5, height: 31, zIndex: 1 }}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 30px 50px', zIndex: 2, gap: 5 }}>
          {/* <select id="channel-select" onChange={(e) => setOutputChannel(e.target.value)} value={outputChannel}>
            <option value={'global'}>Global</option>
            <option value={'party'}>Party</option>
          </select> */}

          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key.toLowerCase() !== 'enter') {
                return;
              }

              sendMessage();
            }}
            style={{
              borderStyle: 'solid',
              borderImageSource: `url(${process.env.REACT_APP_CDN_PATH}features/chat/104.png)`,
              borderImageSlice: `10 10 fill`,
              borderImageWidth: `10px`,
              width: '100%',
              padding: 0,
              border: 0,
            }}
          />
          <EmojiButton onSelect={(code) => setInput(input + ' :' + code + ':')} />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>

      {!isMinimized && (
        <PullTab
          containerRef={containerRef}
          setSize={(wMod, hMod) => {
            setWidth(Math.max(wMod + 5, 300));
            setHeight(Math.max(hMod + 5, 32 + 42));
          }}
        />
      )}
    </div>
  );
}

function PullTab({ containerRef, setSize }: { setSize: (x: number, y: number) => void; containerRef: React.RefObject<HTMLDivElement> }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref === null || ref.current === null) return;

    ref.current.onmousedown = (e) => {
      e.preventDefault();

      document.onmouseup = () => {
        if (document.onmouseup !== null) {
          const rect = containerRef.current?.getBoundingClientRect() ?? { width: 0, height: 0 };

          localStorage.setItem('chat-width', '' + rect.width);
          localStorage.setItem('chat-height', '' + rect.height);
        }

        document.onmouseup = null;
        document.onmousemove = null;
      };

      document.onmousemove = (e) => {
        e.preventDefault();

        const rect = containerRef.current?.getBoundingClientRect() ?? { x: 0, bottom: 0 };

        setSize(e.clientX - rect.x, rect.bottom - e.clientY);
      };
    };

    return () => {
      document.onmouseup = null;
      document.onmousemove = null;
    };
  }, []);

  return <div ref={ref} className="pull-tab"></div>;
}
