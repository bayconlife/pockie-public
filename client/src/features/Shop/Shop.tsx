import * as React from 'react';
import { Grid } from '../../components/Grid';
import { Item } from '../../components/Item';
import Panel from '../../components/Panel/Panel';
import { JButton } from '../../components/UI/JButton';
import JPanel from '../../components/UI/JPanel';
import { JTabbedPane } from '../../components/UI/JTabbedPane';
import { MultilineLabel } from '../../components/UI/MultilineLabel';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Confirm } from './Confirm';
import { setShops } from '../../slices/shopSlice';
import { toServer } from '../../util/ServerSocket';

enum Tab {
  SHOP = 'Shop',
  BLACK_MARKET_2 = 'Black Market 2',
  PETS = 'Pets',
  FOOD = 'Food',
  BLACK_MARKET = 'Black Market',
}

const TAB_IDS = {
  [Tab.SHOP]: 1,
  [Tab.BLACK_MARKET_2]: 5,
  [Tab.PETS]: 3,
  [Tab.FOOD]: 4,
  [Tab.BLACK_MARKET]: 5,
};

const TABS = [{ name: Tab.SHOP }, { name: Tab.BLACK_MARKET }, { name: Tab.FOOD }];

export const Shop: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const shops = useAppSelector((store) => store.shops.shops);
  const stones = useAppSelector((state) => state.currency.stones);

  const [selectedItem, setSelectedItem] = React.useState(-1);
  const [serverTime, setServerTime] = React.useState(0);
  const [tab, setTab] = React.useState<Tab>(Tab.SHOP);

  let shopTab = 'normal';
  if (tab === Tab.PETS) shopTab = 'pet';
  if (tab === Tab.FOOD) shopTab = 'food';
  if (tab === Tab.BLACK_MARKET) shopTab = 'black';

  const shop = shops[shopTab];
  const items = shops.normal.items;
  const refreshCost = shops.normal.refreshCost;

  React.useEffect(() => {
    toServer('shop', {}, (time: number) => setServerTime(time));
  }, []);

  const refreshShop = () => {
    let newShops = JSON.parse(JSON.stringify(shops));
    newShops[shopTab].items = [];
    dispatch(setShops(newShops));
    setTimeout(() => toServer('refreshShop', TAB_IDS[tab]), 50);
  };

  return (
    <>
      <Panel name="Merchant Shop" onClose={onClose}>
        <JPanel size={{ width: 300, height: 422 }}>
          <JTabbedPane
            size={{ width: 300, height: 420 }}
            tabs={TABS}
            active={Tab.SHOP}
            background="UIResource.Common.BigBG1"
            onChange={(t) => setTab(t as Tab)}>
            <JTabbedPane.Tab name={Tab.SHOP}>
              <JPanel size={{ width: 292, height: 390 }} position={{ x: 4, y: 0 }}>
                <JPanel size={{ width: 288, height: 20 }} position={{ x: 2, y: 5 }} background="UIResource.Common.BigBG5">
                  <MultilineLabel size={{ width: 155, height: 20 }} position={{ x: 3, y: 2 }} text="NMpcShop_Time" />
                  <MultilineLabel size={{ width: 60, height: 20 }} position={{ x: 158, y: 2 }} text={`Cost: ${refreshCost}`} />
                  <JButton
                    size={{ width: 66, height: 20 }}
                    position={{ x: 222, y: 0 }}
                    text="Refresh"
                    onClick={refreshShop}
                    disabled={stones < refreshCost}
                  />
                </JPanel>

                <JPanel size={{ width: 282, height: 225 }} position={{ x: 5, y: 35 }} background="UIResource.Common.BigBG4">
                  <JPanel size={{ width: 269, height: 215 }} position={{ x: 6, y: 5 }}>
                    <Grid numberOfTiles={80} tilesPerRow={10} location={20} />
                    {items.map((item, idx) => (
                      <Item key={idx} item={item} onClick={() => setSelectedItem(idx)} />
                    ))}
                  </JPanel>
                </JPanel>

                <JPanel size={{ width: 282, height: 115 }} position={{ x: 5, y: 270 }} background="UIResource.Common.BigBG3">
                  <MultilineLabel size={{ width: 272, height: 105 }} position={{ x: 5, y: 5 }} text="Left click on an item to buy it" />
                </JPanel>
              </JPanel>
            </JTabbedPane.Tab>

            <JTabbedPane.Tab name={Tab.BLACK_MARKET}>
              <JPanel size={{ width: 292, height: 390 }} position={{ x: 4, y: 0 }}>
                <JPanel size={{ width: 288, height: 20 }} position={{ x: 2, y: 5 }} background="UIResource.Common.BigBG5">
                  <MultilineLabel size={{ width: 155, height: 20 }} position={{ x: 3, y: 2 }} text="NMpcShop_Time" />
                  <MultilineLabel size={{ width: 60, height: 20 }} position={{ x: 158, y: 2 }} text={`Cost: 28`} />
                  <JButton
                    size={{ width: 66, height: 20 }}
                    position={{ x: 222, y: 0 }}
                    text="Refresh"
                    onClick={refreshShop}
                    disabled={stones < refreshCost}
                  />
                </JPanel>

                <JPanel size={{ width: 282, height: 225 }} position={{ x: 5, y: 35 }} background="UIResource.Common.BigBG4">
                  <JPanel size={{ width: 269, height: 215 }} position={{ x: 6, y: 5 }}>
                    <Grid numberOfTiles={80} tilesPerRow={10} location={20} />
                    {shops.black.items?.map((item, idx) => (
                      <Item key={idx} item={item} onClick={() => setSelectedItem(idx)} />
                    ))}
                  </JPanel>
                </JPanel>

                <JPanel size={{ width: 282, height: 115 }} position={{ x: 5, y: 270 }} background="UIResource.Common.BigBG3">
                  <MultilineLabel size={{ width: 272, height: 105 }} position={{ x: 5, y: 5 }} text="Left click on an item to buy it" />
                </JPanel>
              </JPanel>
            </JTabbedPane.Tab>

            <JTabbedPane.Tab name={Tab.PETS}>
              <JPanel size={{ width: 292, height: 390 }} position={{ x: 4, y: 0 }}>
                <JPanel size={{ width: 288, height: 20 }} position={{ x: 2, y: 5 }} background="UIResource.Common.BigBG5">
                  <MultilineLabel size={{ width: 155, height: 20 }} position={{ x: 3, y: 2 }} text="NMpcShop_Time" />
                  <MultilineLabel size={{ width: 60, height: 20 }} position={{ x: 158, y: 2 }} text={`Cost: ${refreshCost}`} />
                  <JButton
                    size={{ width: 66, height: 20 }}
                    position={{ x: 222, y: 0 }}
                    text="Refresh"
                    onClick={refreshShop}
                    disabled={stones < refreshCost}
                  />
                </JPanel>

                <JPanel size={{ width: 282, height: 225 }} position={{ x: 5, y: 35 }} background="UIResource.Common.BigBG4">
                  <JPanel size={{ width: 269, height: 215 }} position={{ x: 6, y: 5 }}>
                    <Grid numberOfTiles={80} tilesPerRow={10} location={20} />
                    {shops.pet.items.map((item, idx) => (
                      <Item key={idx} item={item} onClick={() => setSelectedItem(idx)} />
                    ))}
                  </JPanel>
                </JPanel>

                <JPanel size={{ width: 282, height: 115 }} position={{ x: 5, y: 270 }} background="UIResource.Common.BigBG3">
                  <MultilineLabel size={{ width: 272, height: 105 }} position={{ x: 5, y: 5 }} text="Left click on an item to buy it" />
                </JPanel>
              </JPanel>
            </JTabbedPane.Tab>

            <JTabbedPane.Tab name={Tab.FOOD}>
              <JPanel size={{ width: 292, height: 390 }} position={{ x: 4, y: 0 }}>
                <JPanel size={{ width: 288, height: 20 }} position={{ x: 2, y: 5 }} background="UIResource.Common.BigBG5">
                  <MultilineLabel size={{ width: 155, height: 20 }} position={{ x: 3, y: 2 }} text="NMpcShop_Time" />
                  <MultilineLabel size={{ width: 60, height: 20 }} position={{ x: 158, y: 2 }} text={`Cost: ${refreshCost}`} />
                  <JButton
                    size={{ width: 66, height: 20 }}
                    position={{ x: 222, y: 0 }}
                    text="Refresh"
                    onClick={refreshShop}
                    disabled={stones < refreshCost}
                  />
                </JPanel>

                <JPanel size={{ width: 282, height: 225 }} position={{ x: 5, y: 35 }} background="UIResource.Common.BigBG4">
                  <JPanel size={{ width: 269, height: 215 }} position={{ x: 6, y: 5 }}>
                    <Grid numberOfTiles={80} tilesPerRow={10} location={20} />
                    {shops.food.items.map((item, idx) => (
                      <Item key={idx} item={item} onClick={() => setSelectedItem(idx)} />
                    ))}
                  </JPanel>
                </JPanel>

                <JPanel size={{ width: 282, height: 115 }} position={{ x: 5, y: 270 }} background="UIResource.Common.BigBG3">
                  <MultilineLabel size={{ width: 272, height: 105 }} position={{ x: 5, y: 5 }} text="Left click on an item to buy it" />
                </JPanel>
              </JPanel>
            </JTabbedPane.Tab>
          </JTabbedPane>

          {/* <JButton size={{ width: 76, height: 22 }} position={{ x: 20, y: 430 }} text="Buy All" disabled />
          <JButton size={{ width: 76, height: 22 }} position={{ x: 112, y: 430 }} text="Sell All" disabled />
          <JButton size={{ width: 76, height: 22 }} position={{ x: 205, y: 430 }} text="Repair All" disabled /> */}
        </JPanel>
      </Panel>

      {selectedItem !== -1 && (
        <Confirm
          tab={shopTab}
          shopId={TAB_IDS[tab]}
          item={shop.items[selectedItem]}
          onCancel={() => setSelectedItem(-1)}
          onConfirm={() => setSelectedItem(-1)}
        />
      )}
    </>
  );
};
