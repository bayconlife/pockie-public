import { useEffect, useState } from 'react';
import { JButton } from '../../components/UI/JButton';
import JPanel from '../../components/UI/JPanel';
import useTranslator from '../../hooks/translate';
import { useAppSelector } from '../../hooks';
import { JPagination } from '../../components/UI/JPagination';
import { prompt } from '../../util/EventEmitter';
import { MarketItem } from './MarketItem';
import { toServer } from '../../util/ServerSocket';

export function ForSale() {
  const t = useTranslator();

  const [items, setItems] = useState<MarketItem[]>([]);
  const [filter, setFilter] = useState({ name: '' });

  useEffect(() => {
    toServer('marketGetItemsForSale', null, setItems);
  }, []);

  return (
    <JPanel
      size={{ width: 542, height: 320 }}
      background="UIResource.Common.BigBG1"
      padding={4}
      style={{ textAlign: 'center', fontSize: 12, fontFamily: 'Arial' }}>
      <JButton
        size={{ width: 70, height: 23 }}
        position={{ x: 5, y: 5 }}
        text="Refresh"
        onClick={() => toServer('marketGetItemsForSale', null, setItems)}
      />
      <JPanel position={{ x: 0, y: 8 }}>
        <Filters onSearch={(name) => setFilter({ name })} />
      </JPanel>

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
          items={items.filter((item) => (filter.name === '' ? true : t(`item__${item.data.iid}--name`).includes(filter.name)))}
          render={(_items: MarketItem[], page) => {
            return _items
              .filter((item) => !!item && !!item.data)
              .map((item, idx) => (
                <JPanel key={item.data.uid} position={{ x: 0, y: 22 * idx }}>
                  {<ForSaleItem item={item} onPurchase={() => toServer('marketGetItemsForSale', null, setItems)} />}
                </JPanel>
              ));
          }}
          paginationStyle={{ position: 'absolute', top: 235 }}
        />
      </JPanel>
    </JPanel>
  );
}

function ForSaleItem({ item, onPurchase }: { item: MarketItem; onPurchase: () => void }) {
  const t = useTranslator();

  const accountId = useAppSelector((state) => state.account.id);
  const stones = useAppSelector((state) => state.currency.stones);

  const [loading, setLoading] = useState(false);

  return (
    <MarketItem
      item={item}
      commandButton={
        <JButton
          size={{ width: 54, height: 20 }}
          disabled={item.account_id === accountId || item.price > stones || loading}
          loading={loading}
          text={item.account_id === accountId ? 'Yours' : 'Buy'}
          onClick={() => {
            setLoading(true);
            prompt(
              `Would you like to purchase ${t(`item__${item.data.iid}--name`)} for ${item.price} stones.`,
              () => {
                toServer('marketBuyItem', item.id, () => {
                  setLoading(false);
                  onPurchase();
                });
              },
              () => {
                setLoading(false);
              }
            );
          }}
        />
      }
    />
  );
}

function Filters({ onSearch }: { onSearch: (name: string) => void }) {
  const [name, setName] = useState('');

  function _onSearch() {
    onSearch(name);
  }

  return (
    <>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            _onSearch();
          }
        }}
        style={{ position: 'absolute', left: 290, top: 0 }}
      />
      <JButton size={{ width: 56, height: 20 }} position={{ x: 472, y: 0 }} text="Search" onClick={_onSearch} />
    </>
  );
}
