import { useState } from 'react';
import { DisplayGrid } from '../../components/Grid/DisplayGrid';
import { JButton } from '../../components/UI/JButton';
import JPanel from '../../components/UI/JPanel';
import { MultilineLabel } from '../../components/UI/MultilineLabel';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { ItemLocation, ItemType } from '../../enums';
import { DropZone } from '../../components/DropZone/DropZone';
import { Item } from '../../components/Item';
import { IItem } from '../../interfaces';
import { updateItem } from '../../slices/inventorySlice';
import { prompt } from '../../util/EventEmitter';
import { toServer } from '../../util/ServerSocket';
import { getItemType } from '../../resources/Items';

const REFINE_TYPES = [
  ItemType.Weapon,
  ItemType.Belt,
  ItemType.Body,
  ItemType.Gloves,
  ItemType.Helm,
  ItemType.Shoes,
  ItemType.Amulet,
  ItemType.Ring,
];
const TALISMAN_IDS = [161004];

export function Refine() {
  const dispatch = useAppDispatch();

  const item = useAppSelector((state) => state.inventory.items[state.inventory.locations[ItemLocation.Refine]]);
  const talisman = useAppSelector((state) => state.inventory.items[state.inventory.locations[ItemLocation.RefineTalisman]]);
  const dragging = useAppSelector((state) => state.ui.dragging.item);
  const [loading, setLoading] = useState(false);

  function onDrop(uid: string) {
    toServer('refineSetItem', { uid, location: ItemLocation.Refine });
  }

  function onDropTalisman(uid: string) {
    toServer('refineSetItem', { uid, location: ItemLocation.RefineTalisman });
  }

  return (
    <>
      <JPanel size={{ width: 373, height: 180 - 26 }} background="UIResource.Common.BigBG1">
        <JPanel
          className="single-container"
          size={{ width: 73, height: 115 }}
          position={{ x: 25, y: 10 }}
          background="UIResource.Common.BigBG3">
          <MultilineLabel size={{ width: 73, height: 20 }} position={{ x: 0, y: 2 }} text="Equipment" style={{ textAlign: 'center' }} />
          <DisplayGrid size={{ width: 2, height: 3 }} position={{ x: 5, y: 20 }}>
            {item === undefined && dragging !== null && REFINE_TYPES.includes(getItemType(dragging)) && (
              <DropZone onDrop={onDrop} location={ItemLocation.Refine} />
            )}
            {item && <Item item={item} />}
          </DisplayGrid>
        </JPanel>

        <JPanel size={{ width: 23, height: 23 }} position={{ x: 165, y: 62 }} background="UIResource.Compose.Add" />

        <MultilineLabel
          size={{ width: 132, height: 20 }}
          position={{ x: 217, y: 30 }}
          text="Refining Talisman"
          style={{ textAlign: 'center' }}
        />

        <JPanel
          className="single-container"
          size={{ width: 46, height: 46 }}
          position={{ x: 260, y: 50 }}
          background="UIResource.Common.BigBG3">
          <DisplayGrid size={{ width: 1, height: 1 }} position={{ x: 5, y: 5 }}>
            {talisman === undefined && dragging !== null && TALISMAN_IDS.includes(dragging.iid) && (
              <DropZone onDrop={onDropTalisman} location={ItemLocation.RefineTalisman} />
            )}
            {talisman && <Item item={talisman} />}
          </DisplayGrid>
        </JPanel>

        <MultilineLabel
          size={{ width: 160, height: 37 }}
          position={{ x: 204, y: 100 }}
          text="Put Refining Talisman in for free attempt."
          style={{ textAlign: 'center' }}
        />
      </JPanel>

      <JButton
        size={{ width: 100, height: 22 }}
        position={{ x: 40, y: 185 - 26 }}
        text="Attempt"
        disabled={item === undefined || loading}
        loading={loading}
        onClick={() => {
          setLoading(true);
          prompt(
            'Without a Refining Talisman this will cost 1000 stone.',
            () => {
              toServer('refineAttempt', {}, (updatedItem: IItem) => {
                dispatch(updateItem(updatedItem));
                setLoading(false);
              });
            },
            () => {
              setLoading(false);
            }
          );
        }}
      />
      <JButton size={{ width: 100, height: 22 }} position={{ x: 235, y: 185 - 26 }} text="Instructions" disabled />
    </>
  );
}
