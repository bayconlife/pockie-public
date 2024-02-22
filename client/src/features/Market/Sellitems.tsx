import { useEffect, useState } from 'react';
import Panel from '../../components/Panel/Panel';
import { JButton } from '../../components/UI/JButton';
import JPanel from '../../components/UI/JPanel';
import { useAppSelector } from '../../hooks';
import { selectItemFromInventory } from '../../util/EventEmitter';
import { Item } from '../../components/Item';
import { Label } from '../../components/UI/Label';
import { DisplayGrid } from '../../components/Grid/DisplayGrid';
import { JPagination } from '../../components/UI/JPagination';
import { MarketItem } from './MarketItem';
import { toServer } from '../../util/ServerSocket';

export function SellItems() {
  const items = useAppSelector((state) => state.inventory.items);
  const [selectedItemUID, setSelectedItemUID] = useState<string>();
  const [price, setPrice] = useState(1);
  const [is, setIs] = useState<MarketItem[]>([]);

  useEffect(() => {
    toServer('marketGetItemsIAmSelling', null, setIs);
  }, []);

  return (
    <>
      <JPanel
        size={{ width: 542, height: 320 }}
        background="UIResource.Common.BigBG1"
        padding={4}
        style={{ textAlign: 'center', fontSize: 12, fontFamily: 'Arial' }}>
        <JButton
          size={{ width: 150, height: 20 }}
          position={{ x: 542 / 2 - 75, y: 5 }}
          text="Select Item To Sell"
          onClick={() => selectItemFromInventory(setSelectedItemUID)}
        />

        <JPanel size={{ width: 522, height: 20 }} position={{ x: 5, y: 32 }}>
          <JPanel size={{ width: 136, height: 20 }} background="UIResource.Common.BigBG3" padding={3}>
            Name
          </JPanel>
          <JPanel size={{ width: 46, height: 20 }} position={{ x: 138, y: 0 }} background="UIResource.Common.BigBG3" padding={3}>
            Level
          </JPanel>
          <JPanel size={{ width: 46, height: 20 }} position={{ x: 186, y: 0 }} background="UIResource.Common.BigBG3" padding={3}>
            Count
          </JPanel>
          <JPanel size={{ width: 76, height: 20 }} position={{ x: 234, y: 0 }} background="UIResource.Common.BigBG3" padding={3}>
            Price
          </JPanel>
          <JPanel size={{ width: 76, height: 20 }} position={{ x: 312, y: 0 }} background="UIResource.Common.BigBG3"></JPanel>
          <JPanel size={{ width: 76, height: 20 }} position={{ x: 390, y: 0 }} background="UIResource.Common.BigBG3" padding={3}>
            Expiration
          </JPanel>
        </JPanel>

        <JPanel size={{ width: 522, height: 175 }} position={{ x: 5, y: 54 }}>
          <JPagination
            perPage={10}
            items={is}
            render={(_items: MarketItem[], page) => {
              return _items
                .filter((item) => !!item && !!item.data)
                .map((item, idx) => (
                  <JPanel key={item.data.uid} position={{ x: 0, y: 22 * idx }}>
                    <MarketItem
                      item={item}
                      commandButton={
                        <JButton
                          size={{ width: 54, height: 20 }}
                          text="Cancel"
                          onClick={() => {
                            toServer('marketCancelSell', item.id, () => toServer('marketGetItemsIAmSelling', null, setIs));
                          }}
                        />
                      }
                    />
                  </JPanel>
                ));
            }}
            paginationStyle={{ position: 'absolute', top: 235 }}
          />
        </JPanel>
      </JPanel>

      {selectedItemUID && (
        <Panel name="Sell Item" onClose={() => setSelectedItemUID(undefined)}>
          <JPanel size={{ width: 240, height: 135 }}>
            <JPanel size={{ width: 240, height: 105 }} background="UIResource.Common.BigBG1" padding={4}>
              <DisplayGrid size={{ width: 2, height: 3 }} position={{ x: 4, y: 4 }}>
                <Item item={items[selectedItemUID]} onClick={() => {}} />
              </DisplayGrid>
              <Label position={{ x: 75, y: 5 }} text="Price">
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={10000000000}
                  value={price}
                  onChange={(event) => setPrice(Math.max(1, Math.min(10000000000, Number(event.target.value.replace(/\D/, '')))))}
                  style={{ width: 100 }}
                />
              </Label>
            </JPanel>

            <JButton
              size={{ width: 75, height: 24 }}
              position={{ x: 240 / 2 - 75 / 2, y: 110 }}
              text="Sell"
              onClick={() =>
                toServer('marketSellItem', { uid: selectedItemUID, price }, () => {
                  setSelectedItemUID(undefined);
                  toServer('marketGetItemsIAmSelling', null, setIs);
                })
              }
            />
          </JPanel>
        </Panel>
      )}
    </>
  );
}
