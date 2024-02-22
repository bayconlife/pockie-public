import * as React from 'react';
import Panel from '../../components/Panel/Panel';
import JPanel from '../../components/UI/JPanel';
import { JTabbedPane } from '../../components/UI/JTabbedPane';
import { JTextField } from '../../components/UI/JTextField';
import { PotShopItem } from './PotShopItem';
import { useAppSelector } from '../../hooks';
import { Pot } from './Pot';
import { IItem } from '../../slices/inventorySlice';
import { toServer } from '../../util/ServerSocket';
import { getItemSrc } from '../../resources/Items';

enum Tab {
  Jar = 'Popular Jars',
  Medal = 'Medals',
  Gold = 'Use Gold',
}

const Tabs = [{ name: Tab.Medal }];

export const PotShop: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const Pots = useAppSelector((state) => state.arena.shopPots);
  const Medals = useAppSelector((state) => state.arena.medals);

  const [PotItem, setPotItem] = React.useState<IItem | null>(null);
  const [tab, setTab] = React.useState<Tab>(Tab.Medal);

  const openPot = React.useCallback(
    (id: number) => {
      toServer('openPot', { id: id }, (cs: any) => {
        setPotItem(cs);
      });
    },
    [PotItem]
  );

  return (
    <>
      <Panel name="Jar Shop" onClose={onClose}>
        <JPanel size={{ width: 620, height: 300 }}>
          <JPanel size={{ width: 250, height: 20 }} position={{ x: 368, y: 5 }}>
            <JTextField
              size={{ width: 90, height: 20 }}
              position={{ x: 162, y: 2 }}
              text={`Medals: ${Medals}`}
              background="UIResource.Common.BigBG4"
            />
            {/* <JTextField size={{ width: 90, height: 20 }} position={{ x: 95, y: 2 }} text="Gold: 0" background="UIResource.Common.BigBG4" /> */}
            {/* <JButton size={{ width: 60, height: 20 }} position={{ x: 188, y: 2 }} text="Top-up" /> */}
          </JPanel>
          <JTabbedPane size={{ width: 530, height: 300 }} tabs={Tabs} onChange={(t) => setTab(t as Tab)} active={tab}>
            <JTabbedPane.Tab name={Tab.Jar}>
              <JPanel size={{ width: 525, height: 270 }} position={{ x: 4, y: 0 }}>
                <JPanel
                  size={{ width: 620, height: 270 }}
                  position={{ x: -4, y: 0 }}
                  background="UIResource.Common.BigBG4"
                  childrenStyle={{
                    display: 'grid',
                    gap: 5,
                    paddingTop: 10,
                    gridTemplateColumns: 'auto auto',
                    justifyContent: 'center',
                    width: 615,
                    height: 250,
                    overflowY: 'scroll',
                  }}>
                  {Object.values(Pots).map((pot, idx) => (
                    <PotShopItem pot={pot} key={idx} onOpen={() => openPot(pot.id)} />
                  ))}
                </JPanel>
              </JPanel>
            </JTabbedPane.Tab>

            <JTabbedPane.Tab name={Tab.Medal}>
              <JPanel
                size={{ width: 620, height: 270 }}
                background="UIResource.Common.BigBG4"
                childrenStyle={{
                  display: 'grid',
                  gap: 5,
                  marginTop: 10,
                  gridTemplateColumns: 'auto auto',
                  justifyContent: 'center',
                  width: 615,
                  height: 250,
                  overflowY: 'scroll',
                }}>
                {Object.values(Pots).map((pot, idx) => (
                  <PotShopItem pot={pot} key={idx} onOpen={() => openPot(pot.id)} />
                ))}
              </JPanel>
            </JTabbedPane.Tab>

            <JTabbedPane.Tab name={Tab.Gold}>
              <JPanel size={{ width: 525, height: 270 }} position={{ x: 4, y: 0 }}>
                <JPanel
                  size={{ width: 620, height: 270 }}
                  position={{ x: -4, y: 0 }}
                  background="UIResource.Common.BigBG4"
                  childrenStyle={{
                    display: 'grid',
                    gap: 5,
                    paddingTop: 10,
                    gridTemplateColumns: 'auto auto',
                    justifyContent: 'center',
                    width: 615,
                    height: 250,
                    overflowY: 'scroll',
                  }}>
                  {Object.values(Pots).map((pot, idx) => (
                    <PotShopItem pot={pot} key={idx} onOpen={() => openPot(pot.id)} />
                  ))}
                </JPanel>
              </JPanel>
            </JTabbedPane.Tab>
          </JTabbedPane>
        </JPanel>
      </Panel>
      {PotItem !== null && <Pot image={getItemSrc(PotItem)} onClose={() => setPotItem(null)} />}
    </>
  );
};
