import { DisplayGrid } from '../../components/Grid/DisplayGrid';
import { JButton } from '../../components/UI/JButton';
import JPanel from '../../components/UI/JPanel';
import { MultilineLabel } from '../../components/UI/MultilineLabel';
import { ItemLocation, ItemType } from '../../enums';
import { useAppSelector } from '../../hooks';
import { Item } from '../../components/Item';
import { DropZone } from '../../components/DropZone/DropZone';
import { useCallback, useEffect, useState } from 'react';
import { prompt } from '../../util/EventEmitter';
import { toServer } from '../../util/ServerSocket';
import { getItemType, isItemType } from '../../resources/Items';

const ENCHANT_TYPES = [ItemType.Weapon, ItemType.Belt, ItemType.Body, ItemType.Gloves, ItemType.Helm, ItemType.Shoes];

interface EnhanceInfo {
  success: boolean;
  valid: boolean;
}

export function Enchantment() {
  const item = useAppSelector((store) => store.inventory.items[store.inventory.locations[ItemLocation.Enchant]]);
  const stone = useAppSelector((store) => store.inventory.items[store.inventory.locations[ItemLocation.EnchantStone]]);
  const dragging = useAppSelector((state) => state.ui.dragging.item);

  const [valid, setValid] = useState(false);

  useEffect(() => {
    toServer('enchantGetInfo', {}, (info: EnhanceInfo) => setValid(info.valid));
  }, []);

  const onDrop = useCallback((uid: string) => {
    toServer('enchantSetItem', { uid, location: ItemLocation.Enchant }, (info: EnhanceInfo) => setValid(info.valid));
  }, []);

  const onDropStone = useCallback((uid: string) => {
    toServer('enchantSetItem', { uid, location: ItemLocation.EnchantStone }, (info: EnhanceInfo) => setValid(info.valid));
  }, []);

  const onAttempt = useCallback(() => {
    prompt('Enchant this item with selected Enchanting Stone?', () => {
      toServer('enchantAttempt', {}, (info: EnhanceInfo) => setValid(info.valid));
    });
  }, []);

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
            {item === undefined && dragging !== null && ENCHANT_TYPES.includes(getItemType(dragging)) && (
              <DropZone onDrop={onDrop} location={ItemLocation.Enchant} />
            )}
            {item && <Item item={item} />}
          </DisplayGrid>
        </JPanel>

        <JPanel size={{ width: 23, height: 23 }} position={{ x: 165, y: 62 }} background="UIResource.Compose.Add" />

        <MultilineLabel
          size={{ width: 132, height: 20 }}
          position={{ x: 217, y: 30 }}
          text="Enchanting Stone"
          style={{ textAlign: 'center' }}
        />

        <JPanel
          className="single-container"
          size={{ width: 46, height: 46 }}
          position={{ x: 260, y: 50 }}
          background="UIResource.Common.BigBG3">
          <DisplayGrid size={{ width: 1, height: 1 }} position={{ x: 5, y: 5 }}>
            {stone === undefined && dragging !== null && isItemType(dragging, ItemType.Enchantment) && (
              <DropZone onDrop={onDropStone} location={ItemLocation.EnchantStone} />
            )}
            {stone && <Item item={stone} />}
          </DisplayGrid>
        </JPanel>

        <MultilineLabel
          size={{ width: 160, height: 37 }}
          position={{ x: 204, y: 100 }}
          text="Put Enchanting Stone in for free attempt."
          style={{ textAlign: 'center' }}
        />
        <MultilineLabel size={{ width: 50, height: 17 }} position={{ x: 230, y: 130 }} text={`Result:`} style={{ textAlign: 'center' }} />
      </JPanel>

      <JButton
        size={{ width: 100, height: 22 }}
        position={{ x: 40, y: 185 - 26 }}
        text="Attempt"
        disabled={!valid}
        onClick={() => onAttempt()}
      />
      <JButton size={{ width: 100, height: 22 }} position={{ x: 235, y: 185 - 26 }} text="Instructions" disabled />
    </>
  );
}
