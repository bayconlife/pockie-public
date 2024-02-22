import Panel from '../Panel/Panel';
import { JButton } from '../UI/JButton';
import JPanel from '../UI/JPanel';
import { JTextField } from '../UI/JTextField';
import useTranslator from '../../hooks/translate';
import { useAppSelector } from '../../hooks';
import { Backdrop } from '../Backdrop';

export function InternalNotice({ message, onClose }: { message: string; onClose: () => void }) {
  const t = useTranslator();
  const bounds = useAppSelector((state) => state.ui.bounds);

  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 30020,
        left: bounds[0],
        top: bounds[1],
        width: bounds[2],
        height: bounds[3],
      }}>
      <Backdrop />

      <Panel moveable={false} style={{ zIndex: 2000 }} onClose={onClose}>
        <JPanel size={{ width: 250, height: 75 }}>
          <JTextField size={{ width: 240, height: 70 }} position={{ x: 5, y: 5 }} text={t(message)} />
        </JPanel>
      </Panel>
    </div>
  );
}
