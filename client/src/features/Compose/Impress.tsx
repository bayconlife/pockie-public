import { useEffect, useState } from 'react';
import { DropZone } from '../../components/DropZone/DropZone';
import { DisplayGrid } from '../../components/Grid/DisplayGrid';
import { Item } from '../../components/Item';
import { JButton } from '../../components/UI/JButton';
import JPanel from '../../components/UI/JPanel';
import { MultilineLabel } from '../../components/UI/MultilineLabel';
import { ItemLocation, ItemType } from '../../enums';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { toServer } from '../../util/ServerSocket';
import { getItemType, isItemType } from '../../resources/Items';
import { updateItem } from '../../slices/inventorySlice';

const IMPRESS_TYPES = [
  ItemType.Amulet,
  ItemType.Belt,
  ItemType.Body,
  ItemType.Gloves,
  ItemType.Helm,
  ItemType.Ring,
  ItemType.Shoes,
  ItemType.Weapon,
];
const INFO =
  '1. You can impress weapons and armor to improve their power.<br/>' +
  '2. Use an impress blade to to add an Affix to an item up to 4 Affixes.<br/>' +
  '3. Use impress crystals to increase the chance of success.<br/>';

export function Impress() {
  const dispatch = useAppDispatch();
  const dragging = useAppSelector((state) => state.ui.dragging.item);
  const item = useAppSelector((state) => state.inventory.items[state.inventory.locations[ItemLocation.ImpressItem]]);
  const blade = useAppSelector((state) => state.inventory.items[state.inventory.locations[ItemLocation.ImpressBlade]]);
  const stone = useAppSelector((state) => state.inventory.items[state.inventory.locations[ItemLocation.ImpressStone]]);
  const [rate, setRate] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    toServer('getImpressRate', null, setRate);
  }, []);

  return (
    <>
      <JPanel size={{ width: 366, height: 350 - 26 }} background="UIResource.Common.BigBG1">
        <JPanel size={{ width: 356, height: 138 }} position={{ x: 5, y: 5 }} background="UIResource.Common.BigBG3">
          <MultilineLabel size={{ width: 346, height: 128 }} position={{ x: 5, y: 5 }} text={INFO} />
        </JPanel>

        <JPanel size={{ width: 356, height: 173 }} position={{ x: 5, y: 146 }} background="UIResource.Common.BigBG4">
          <MultilineLabel size={{ width: 73, height: 18 }} position={{ x: 25, y: 14 }} text="Main Item" style={{ textAlign: 'center' }} />
          <JPanel className="single-container" size={{ width: 73, height: 100 }} position={{ x: 25, y: 28 }} padding={5}>
            <DisplayGrid size={{ width: 2, height: 3 }}>
              {item === undefined && dragging !== null && IMPRESS_TYPES.includes(getItemType(dragging)) && (
                <DropZone onDrop={() => toServer('impressSetItem', dragging.uid, setRate)} location={ItemLocation.Refine} />
              )}
              {item && <Item item={item} />}
            </DisplayGrid>
          </JPanel>

          <JPanel size={{ width: 23, height: 23 }} position={{ x: 120, y: 65 }} background="UIResource.Compose.Add" />

          <MultilineLabel size={{ width: 46, height: 18 }} position={{ x: 160, y: 44 }} text="Blade" style={{ textAlign: 'center' }} />
          <JPanel className="single-container" size={{ width: 46, height: 46 }} position={{ x: 160, y: 58 }} padding={5}>
            <DisplayGrid size={{ width: 1, height: 1 }}>
              {blade === undefined && dragging !== null && isItemType(dragging, ItemType.Impress) && (
                <DropZone onDrop={() => toServer('impressSetItem', dragging.uid, setRate)} location={ItemLocation.ImpressBlade} />
              )}
              {blade && <Item item={blade} />}
            </DisplayGrid>
          </JPanel>

          <JPanel size={{ width: 23, height: 23 }} position={{ x: 220, y: 65 }} background="UIResource.Compose.Add" />

          <MultilineLabel size={{ width: 56, height: 18 }} position={{ x: 255, y: 44 }} text="Crystals" style={{ textAlign: 'center' }} />
          <JPanel className="single-container" size={{ width: 46, height: 46 }} position={{ x: 260, y: 58 }} padding={5}>
            <DisplayGrid size={{ width: 1, height: 1 }}>
              {stone === undefined && dragging !== null && isItemType(dragging, ItemType.ImpressRate) && (
                <DropZone onDrop={() => toServer('impressSetItem', dragging.uid, setRate)} location={ItemLocation.ImpressStone} />
              )}
              {stone && <Item item={stone} />}
            </DisplayGrid>
          </JPanel>

          <JPanel size={{ width: 150, height: 20 }} position={{ x: 366 / 2 - 75, y: 140 }} background="UIResource.Common.BigBG3">
            <MultilineLabel
              size={{ width: 138, height: 20 }}
              position={{ x: 0, y: 2 }}
              text={`Rate: ${rate}%`}
              style={{ textAlign: 'center' }}
            />
          </JPanel>
        </JPanel>
      </JPanel>

      <JButton
        size={{ width: 76, height: 22 }}
        position={{ x: 149, y: 330 }}
        text={'Attempt'}
        disabled={item === undefined || blade === undefined || rate === 0 || (item !== undefined && item.props?.lines?.length >= 4)}
        loading={loading}
        onClick={() => {
          setLoading(true);
          toServer('impressAttempt', null, (newItem) => {
            dispatch(updateItem(newItem));

            toServer('getImpressRate', null, (rate: number) => {
              setLoading(false);
              setRate(rate);
            });
          });
        }}
      />
    </>
  );
}
