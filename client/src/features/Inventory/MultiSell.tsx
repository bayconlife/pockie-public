import './MultiSell.css';

import { useState } from 'react';
import Panel from '../../components/Panel/Panel';
import { JButton } from '../../components/UI/JButton';
import { JLayout } from '../../components/UI/JLayout';
import JPanel from '../../components/UI/JPanel';
import { JSelect } from '../../components/UI/JSelect';
import { useAppSelector } from '../../hooks';
import { Item } from '../../components/Item';
import { DisplayGrid } from '../../components/Grid/DisplayGrid';
import { JPagination } from '../../components/UI/JPagination';
import { prompt } from '../../util/EventEmitter';
import { toServer } from '../../util/ServerSocket';
import { getItem, getItemLocation, getItemType } from '../../resources/Items';

const RARITIES = ['Gray', 'Green', 'Blue', 'Purple'];
const equipableItemTypes = [1, 2, 4, 5, 6, 7, 8, 9];

export function MultiSell({ onClose }: { onClose: () => void }) {
  const inventory = useAppSelector((state) => state.inventory.items);
  const [itemUIDsToSell, setItemUIDsToSell] = useState<string[]>([]);
  const [selling, setSelling] = useState(false);

  function onChange(value: string) {
    const soldItems = Object.entries(inventory)
      .filter(
        ([uid, item]) =>
          getItemLocation(item) >= 0 &&
          getItemLocation(item) < 10 &&
          equipableItemTypes.includes(getItemType(item)) &&
          (item.props?.lines ?? []).length < RARITIES.indexOf(value) + 1
      )
      .map((items) => items[0]);

    setItemUIDsToSell(soldItems);
  }

  return (
    <Panel name="Multi-Sell" onClose={onClose}>
      <JPanel size={{ width: 300, height: 285 }} background="UIResource.Common.BigBG1" padding={5} layout={<JLayout />}>
        <JSelect size={{ width: 290, height: 30 }} onSelect={onChange}>
          <option>Select Filter</option>
          {RARITIES.map((rarity, idx) => (
            <option key={idx} value={rarity}>
              Sell equipment {RARITIES[idx]} and below
            </option>
          ))}
        </JSelect>

        <JPagination
          perPage={8}
          items={itemUIDsToSell.map((uid) => inventory[uid])}
          render={(items) => (
            <JLayout horizontal>
              {items.map((item, idx) => (
                <DisplayGrid key={item?.uid + '-' + idx} size={{ width: 2, height: 3 }}>
                  {item && <Item item={item} style={{ position: 'relative', top: 0, left: 0 }} />}
                </DisplayGrid>
              ))}
            </JLayout>
          )}
        />

        <JButton
          text="Sell"
          onClick={() => {
            prompt(`Sell ${itemUIDsToSell.length} items?`, () => {
              setSelling(true);
              toServer('sellItems', itemUIDsToSell, () => {
                setItemUIDsToSell([]);
                setSelling(false);
              });
            });
          }}
          disabled={itemUIDsToSell.length === 0 || selling}
          loading={selling}
        />
      </JPanel>
    </Panel>
  );
}
