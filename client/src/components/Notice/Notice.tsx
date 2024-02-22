import { useContext, useEffect, useState } from 'react';
import Panel from '../Panel/Panel';
import { JButton } from '../UI/JButton';
import JPanel from '../UI/JPanel';
import { JTextField } from '../UI/JTextField';
import useTranslator from '../../hooks/translate';
import { cancelFromServer, fromServer } from '../../util/ServerSocket';

export function Notice() {
  const t = useTranslator();
  const [message, setMessage] = useState('');

  useEffect(() => {
    fromServer('notice', (msg) => {
      setMessage(msg);
    });

    return () => {
      cancelFromServer('notice');
    };
  }, []);

  if (message === '') {
    return null;
  }

  return (
    <Panel moveable={false} style={{ zIndex: 2000 }}>
      <JPanel size={{ width: 250, height: 100 }}>
        <JTextField size={{ width: 240, height: 70 }} position={{ x: 5, y: 5 }} text={t(message)} />
        <JButton size={{ width: 75, height: 25 }} position={{ x: 85, y: 75 }} text="Close" onClick={() => setMessage('')} />
      </JPanel>
    </Panel>
  );
}
