import { useEffect, useRef, useState } from 'react';
import Panel from '../Panel/Panel';
import { JButton } from '../UI/JButton';
import JPanel from '../UI/JPanel';
import { JTextField } from '../UI/JTextField';
import EventEmitter from '../../util/EventEmitter';
import useTranslator from '../../hooks/translate';

interface Props {
  message: string;
  onAccept: () => void;
  onReject: () => void;
}

export function InternalPrompt() {
  const t = useTranslator();
  const onAcceptRef = useRef<() => void>(() => {});
  const onDeclineRef = useRef<() => void>(() => {});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const id = EventEmitter.on('prompt', (message, onAccept, onDecline) => {
      onDeclineRef.current?.();

      onAcceptRef.current = onAccept;
      onDeclineRef.current = onDecline;

      setMessage(t(message));
    });

    return () => {
      EventEmitter.off(id);
    };
  }, []);

  if (message === '') {
    return null;
  }

  return (
    <Panel moveable={false} style={{ zIndex: 21100 }}>
      <JPanel size={{ width: 250, height: 110 }} background="UIResource.Common.BigBG1">
        <JTextField size={{ width: 240, height: 70 }} position={{ x: 5, y: 5 }} text={message} />
        <JButton
          size={{ width: 75, height: 25 }}
          position={{ x: 15, y: 80 }}
          text="Accept"
          onClick={() => {
            onAcceptRef.current();
            onAcceptRef.current = () => {};
            onDeclineRef.current = () => {};

            setMessage('');
          }}
        />
        <JButton
          size={{ width: 75, height: 25 }}
          position={{ x: 250 - 75 - 15, y: 80 }}
          text="Deny"
          onClick={() => {
            onDeclineRef.current?.();
            onAcceptRef.current = () => {};
            onDeclineRef.current = () => {};

            setMessage('');
          }}
        />
      </JPanel>
    </Panel>
  );
}
