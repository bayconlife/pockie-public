import Panel from '../../components/Panel/Panel';
import { JButton } from '../../components/UI/JButton';
import JPanel from '../../components/UI/JPanel';
import { JTabbedPane } from '../../components/UI/JTabbedPane';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { hideArmory } from '../../slices/panelSlice';
import { CreateSlot } from './CreateSlot';
import { Enhance } from './Enhance';
import { Enchantment } from './Enchantment';
import { Refine } from './Refine';
import { RemoveGem } from './RemoveGem';

enum Tab {
  Enhance = 'Enhance',
  Refine = 'Refine',
  Enchantment = 'Enchantment',
  Slot = 'Create Hole',
  Remove = 'Remove',
}

const tabs = [{ name: Tab.Enhance }, { name: Tab.Refine }, { name: Tab.Enchantment }, { name: Tab.Slot }, { name: Tab.Remove }];

export function Armory() {
  const dispatch = useAppDispatch();
  const show = useAppSelector((state) => state.panels.armory);

  if (!show) {
    return null;
  }

  return (
    <Panel name="Armory" onClose={() => dispatch(hideArmory())}>
      <JPanel size={{ width: 373, height: 212 }}>
        <JTabbedPane size={{ width: 373, height: 180 }} tabs={tabs} active={Tab.Enhance}>
          <JTabbedPane.Tab name={Tab.Enhance}>
            <Enhance />
          </JTabbedPane.Tab>

          <JTabbedPane.Tab name={Tab.Refine}>
            <Refine />
          </JTabbedPane.Tab>

          <JTabbedPane.Tab name={Tab.Enchantment}>
            <Enchantment />
          </JTabbedPane.Tab>

          <JTabbedPane.Tab name={Tab.Slot}>
            <CreateSlot />
          </JTabbedPane.Tab>

          <JTabbedPane.Tab name={Tab.Remove}>
            <RemoveGem />
          </JTabbedPane.Tab>
        </JTabbedPane>
      </JPanel>
    </Panel>
  );
}
