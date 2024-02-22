import { useContext, useEffect, useRef, useState } from 'react';
import Panel from '../Panel/Panel';
import { JButton } from '../UI/JButton';
import JPanel from '../UI/JPanel';
import { JTextField } from '../UI/JTextField';
import useObjectTranslator from '../../hooks/objectTranslate';
import useTranslator from '../../hooks/translate';
import { cancelFromServer, fromServer } from '../../util/ServerSocket';

export function ServerPrompt() {
  const trans = useTranslator();
  const t = useObjectTranslator();
  const ref = useRef<(accepted: boolean) => void>();
  const [message, setMessage] = useState('');

  useEffect(() => {
    fromServer('prompt', (message: any, cb: (accepted: boolean) => void) => {
      ref.current = cb;

      if (typeof message === 'object') {
        setMessage(t(message.message).join('').replace('${}', message.args[0]));
      } else {
        setMessage(trans(message));
      }
    });

    return () => {
      cancelFromServer('prompt');
    };
  }, []);

  if (message === '') return null;

  return (
    <Panel moveable={false} style={{ zIndex: 2000 }}>
      <JPanel size={{ width: 250, height: 100 }}>
        <JTextField size={{ width: 240, height: 70 }} position={{ x: 5, y: 5 }} text={message} />
        <JButton
          size={{ width: 75, height: 25 }}
          position={{ x: 15, y: 75 }}
          text="Accept"
          onClick={() => {
            ref.current?.(true);
            setMessage('');
          }}
        />
        <JButton
          size={{ width: 75, height: 25 }}
          position={{ x: 150, y: 75 }}
          text="Deny"
          onClick={() => {
            ref.current?.(false);
            setMessage('');
          }}
        />
      </JPanel>
    </Panel>
  );
}
