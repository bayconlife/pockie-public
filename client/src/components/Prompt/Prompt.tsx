import Panel from '../Panel/Panel';
import { JButton } from '../UI/JButton';
import JPanel from '../UI/JPanel';
import { JTextField } from '../UI/JTextField';

interface Props {
  message: string;
  onAccept: () => void;
  onReject: () => void;
}

export function Prompt({ message, onAccept, onReject }: Props) {
  return (
    <Panel moveable={false}>
      <JPanel size={{ width: 250, height: 100 }} background="UIResource.Common.SmallBG1">
        <JTextField size={{ width: 240, height: 70 }} position={{ x: 5, y: 5 }} text={message} />
        <JButton size={{ width: 75, height: 25 }} position={{ x: 15, y: 50 }} text="Accept" onClick={onAccept} />
        <JButton size={{ width: 75, height: 25 }} position={{ x: 150, y: 50 }} text="Deny" onClick={onReject} />
      </JPanel>
    </Panel>
  );
}
