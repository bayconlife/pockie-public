import Panel from '../../components/Panel/Panel';
import JPanel from '../../components/UI/JPanel';
import { JTabbedPane } from '../../components/UI/JTabbedPane';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { hideCollection } from '../../slices/panelSlice';
import { AvatarCollection } from './AvatarCollection';

enum Tabs {
  AVATARS = 'Avatars',
}

const tabs = [{ name: Tabs.AVATARS }];

export function Collection() {
  const dispatch = useAppDispatch();
  const show = useAppSelector((state) => state.panels.collection);

  if (!show) {
    return null;
  }

  return (
    <Panel name="Collection" onClose={() => dispatch(hideCollection())}>
      <JPanel width={670} height={485}>
        <JTabbedPane size={{ width: 670, height: 490 }} tabs={tabs} active={Tabs.AVATARS}>
          <JTabbedPane.Tab name={Tabs.AVATARS}>
            <AvatarCollection />
          </JTabbedPane.Tab>
        </JTabbedPane>
      </JPanel>
    </Panel>
  );
}
