import Panel from '../../components/Panel/Panel';
import JPanel from '../../components/UI/JPanel';
import { JTabbedPane } from '../../components/UI/JTabbedPane';
import { SelectItemFromInventory } from './SelectItemFromInventory';
import { SellItems } from './Sellitems';
import { ForSale } from './ForSale';

enum Tab {
  MARKET = 'Market',
  SELL = 'Sell Items',
}

const tabs = [{ name: Tab.MARKET }, { name: Tab.SELL }];

export function MarketBoard({ onClose }: { onClose: () => void }) {
  return (
    <>
      <Panel name="Market" onClose={onClose}>
        <JPanel size={{ width: 563, height: 350 }}>
          <JTabbedPane size={{ width: 563, height: 350 }} tabs={tabs} active={Tab.MARKET}>
            <JTabbedPane.Tab name={Tab.MARKET}>
              <ForSale />
            </JTabbedPane.Tab>

            <JTabbedPane.Tab name={Tab.SELL}>
              <SellItems />
            </JTabbedPane.Tab>
          </JTabbedPane>
        </JPanel>
      </Panel>

      <SelectItemFromInventory />
    </>
  );
}
