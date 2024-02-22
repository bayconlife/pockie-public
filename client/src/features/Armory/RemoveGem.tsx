import { DisplayGrid } from '../../components/Grid/DisplayGrid';
import { JButton } from '../../components/UI/JButton';
import JPanel from '../../components/UI/JPanel';
import { MultilineLabel } from '../../components/UI/MultilineLabel';
import { ItemLocation, ItemType } from '../../enums';
import { useAppSelector } from '../../hooks';
import { DropZone } from '../../components/DropZone/DropZone';
import { Item } from '../../components/Item';
import { toServer } from '../../util/ServerSocket';
import { getItemType } from '../../resources/Items';

const REMOVE_GEMS_TYPES = [
  ItemType.Weapon,
  ItemType.Belt,
  ItemType.Body,
  ItemType.Gloves,
  ItemType.Helm,
  ItemType.Shoes,
  ItemType.Amulet,
  ItemType.Ring,
];

export function RemoveGem() {
  const item = useAppSelector((state) => state.inventory.items[state.inventory.locations[ItemLocation.GemRemove]]);
  const dragging = useAppSelector((state) => state.ui.dragging.item);

  function onDrop(uid: string) {
    toServer('gemSetItem', { uid, location: ItemLocation.GemRemove });
  }

  return (
    <>
      <JPanel size={{ width: 373, height: 180 - 26 }} background="UIResource.Common.BigBG1">
        <JPanel
          className="single-container"
          size={{ width: 73, height: 115 }}
          position={{ x: 145, y: 10 }}
          background="UIResource.Common.BigBG3">
          <MultilineLabel size={{ width: 73, height: 20 }} position={{ x: 0, y: 2 }} text="Equipment" style={{ textAlign: 'center' }} />
          <DisplayGrid size={{ width: 2, height: 3 }} position={{ x: 5, y: 20 }}>
            {item === undefined && dragging !== null && REMOVE_GEMS_TYPES.includes(getItemType(dragging)) && (
              <DropZone onDrop={onDrop} location={ItemLocation.GemRemove} />
            )}
            {item && <Item item={item} />}
          </DisplayGrid>
        </JPanel>
      </JPanel>

      <JButton
        size={{ width: 100, height: 22 }}
        position={{ x: 40, y: 185 - 26 }}
        text="Remove Gems"
        disabled={item === undefined}
        onClick={() => toServer('gemRemove')}
      />
      <JButton size={{ width: 100, height: 22 }} position={{ x: 235, y: 185 - 26 }} text="Instructions" disabled />
    </>
  );
}
