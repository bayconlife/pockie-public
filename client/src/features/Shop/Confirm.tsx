import * as React from 'react';
import Panel from '../../components/Panel/Panel';
import { JButton } from '../../components/UI/JButton';
import JPanel from '../../components/UI/JPanel';
import { JTextField } from '../../components/UI/JTextField';
import { MultilineLabel } from '../../components/UI/MultilineLabel';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { IItem, addItem } from '../../slices/inventorySlice';
import { toServer } from '../../util/ServerSocket';
import { batch } from 'react-redux';
import { reduceStones } from '../../slices/currencySlice';
import { removeItemFromShop } from '../../slices/shopSlice';
import { getItemName } from '../../resources/Items';

const style: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 'bold',
  textAlign: 'end',
  marginTop: 2,
};

interface Props {
  tab: string;
  shopId: number;
  item: IItem;
  onConfirm: () => void;
  onCancel: () => void;
}

export const Confirm: React.FC<Props> = ({ tab, shopId, item, onCancel, onConfirm }) => {
  const dispatch = useAppDispatch();

  const stones = useAppSelector((state) => state.currency.stones);

  const name = getItemName(item.iid);
  const price = item.props.price;

  return (
    <Panel name="Confirm Purchase" onClose={onCancel} style={{ zIndex: 10000 }}>
      <JPanel size={{ width: 224, height: 150 }}>
        <JPanel size={{ width: 225, height: 124 }} position={{ x: 0, y: 0 }} background="UIResource.Common.BigBG1">
          <MultilineLabel size={{ width: 77, height: 20 }} position={{ x: 5, y: 8 }} text="Item Name:" style={style} />
          <JTextField size={{ width: 120, height: 20 }} position={{ x: 85, y: 7 }} text={name} />

          <MultilineLabel size={{ width: 77, height: 20 }} position={{ x: 5, y: 34 }} text="Total Cost:" style={style} />
          <JTextField size={{ width: 120, height: 20 }} position={{ x: 85, y: 34 }} text={price.toString()} style={{ marginLeft: 18 }} />
          <JPanel size={{ width: 15, height: 13 }} position={{ x: 90, y: 37 }} background="UIResource.Icon.Icon_Carpolite" />

          <JPanel size={{ width: 204, height: 2 }} position={{ x: 10, y: 61 }} background="UIResource.Common.PartitionYellow" />

          <MultilineLabel size={{ width: 120, height: 20 }} position={{ x: 5, y: 70 }} text="Purchase Quantity:" style={style} />
          <JTextField size={{ width: 60, height: 20 }} position={{ x: 128, y: 70 }} text={'1'} editable />

          <MultilineLabel size={{ width: 77, height: 20 }} position={{ x: 4, y: 97 }} text="Total Cost:" style={style} />
          <JTextField size={{ width: 120, height: 20 }} position={{ x: 85, y: 97 }} text={price.toString()} style={{ marginLeft: 18 }} />
          <JPanel size={{ width: 15, height: 13 }} position={{ x: 90, y: 100 }} background="UIResource.Icon.Icon_Carpolite" />
        </JPanel>

        <JButton
          size={{ width: 76, height: 20 }}
          position={{ x: 25, y: 130 }}
          text="Confirm"
          onClick={() => {
            toServer('buyItem', { shopId, uid: item.uid }, (_item) => {
              batch(() => {
                dispatch(reduceStones(price));
                dispatch(addItem(_item));
                dispatch(removeItemFromShop({ shop: tab, uid: item.uid }));
                onConfirm();
              });
            });
          }}
          disabled={stones < price}
        />
        <JButton size={{ width: 76, height: 20 }} position={{ x: 125, y: 130 }} text="Cancel" onClick={onCancel} />
      </JPanel>
    </Panel>
  );
};
