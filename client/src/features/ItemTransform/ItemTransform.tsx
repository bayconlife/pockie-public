import { Grid } from '../../components/Grid';
import Panel from '../../components/Panel/Panel';
import JPanel from '../../components/UI/JPanel';
import { JTabbedPane } from '../../components/UI/JTabbedPane';

const enum Tabs {
  I = 'I',
}

const tabs = [{ name: Tabs.I }, { name: 'II' }];

export function ItemTransform() {
  return (
    <Panel name="Item Transform">
      <JPanel size={{ width: 280, height: 185 }}>
        <JTabbedPane size={{ width: 280, height: 153 }} tabs={tabs} active={Tabs.I}>
          <JTabbedPane.Tab name={Tabs.I}>
            <JPanel size={{ width: 278, height: 123 }} position={{ x: 0, y: 0 }} background="UIResource.Common.BigBG1">
              <JPanel size={{ width: 73, height: 73 }} position={{ x: 20, y: 15 }} background="UIResource.Common.BigBG3">
                <Grid location={12} />
              </JPanel>
            </JPanel>
          </JTabbedPane.Tab>
        </JTabbedPane>
      </JPanel>
    </Panel>
  );
}
