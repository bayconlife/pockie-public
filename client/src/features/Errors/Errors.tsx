import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../hooks';
import { endFight } from '../../slices/fightSlice';
import { cancelFromServer, fromServer } from '../../util/ServerSocket';

export function Errors() {
  const dispatch = useAppDispatch();
  const [messageList, setMessageList] = useState<string[]>([]);

  useEffect(() => {
    fromServer('error', (msg) => {
      console.error(msg);
      setMessageList([...messageList, msg]);
      dispatch(endFight());
    });

    return () => {
      cancelFromServer('error');
    };
  }, [messageList]);

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    if (messageList.length > 0) {
      timeout = setTimeout(() => {
        const newMessages = [...messageList];

        newMessages.shift();

        setMessageList(newMessages);
      }, 2000);
    }

    return () => {
      if (timeout !== null) {
        clearTimeout(timeout);
      }
    };
  }, [messageList]);

  if (messageList.length === 0) {
    return null;
  }

  return (
    <div style={{ position: 'fixed', bottom: 5, left: '50%', display: 'flex', flexDirection: 'column', gap: 5 }}>
      {messageList.map((message, idx) => (
        <div key={idx + '-' + Date.now()} style={{ background: '#FA3E3E', borderRadius: 10, padding: 5 }}>
          {message}
        </div>
      ))}
    </div>
  );
}
