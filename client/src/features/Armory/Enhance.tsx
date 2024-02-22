import { JButton } from '../../components/UI/JButton';
import JPanel from '../../components/UI/JPanel';
import { MultilineLabel } from '../../components/UI/MultilineLabel';
import { ItemLocation, ItemType } from '../../enums';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { DisplayGrid } from '../../components/Grid/DisplayGrid';
import { DropZone } from '../../components/DropZone/DropZone';
import { useCallback, useEffect, useState } from 'react';
import { Item } from '../../components/Item';
import { prompt } from '../../util/EventEmitter';
import { toServer } from '../../util/ServerSocket';
import { getItemType } from '../../resources/Items';
import { IItem, updateItem } from '../../slices/inventorySlice';

const ENHANCE_TYPES = [ItemType.Weapon, ItemType.Belt, ItemType.Body, ItemType.Gloves, ItemType.Helm, ItemType.Shoes];
const TALISMAN_IDS = [161060];

interface EnhanceInfo {
  rate: number;
  success: boolean;
  valid: boolean;
  item: IItem;
}

export function Enhance() {
  const dispatch = useAppDispatch();
  const item = useAppSelector((store) => store.inventory.items[store.inventory.locations[ItemLocation.Enhance]]);
  const talisman = useAppSelector((store) => store.inventory.items[store.inventory.locations[ItemLocation.EnhanceTalisman]]);
  const dragging = useAppSelector((state) => state.ui.dragging.item);

  const [rate, setRate] = useState(0);
  const [result, setResult] = useState<boolean | null>(null);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    toServer('enhanceGetInfo', {}, (info: EnhanceInfo) => {
      setRate(info.rate);
      setValid(info.valid);
    });
  }, []);

  useEffect(() => {
    if (item === undefined) {
      setRate(0);
      setValid(false);
      setResult(null);
    }
  }, [item]);

  const onDrop = useCallback((uid: string) => {
    toServer('enhanceSetItem', { uid, location: ItemLocation.Enhance }, (info: EnhanceInfo) => {
      setRate(info.rate);
      setValid(info.valid);
    });
  }, []);

  const onDropTalisman = useCallback((uid: string) => {
    toServer('enhanceSetItem', { uid, location: ItemLocation.EnhanceTalisman }, (info: EnhanceInfo) => {
      setRate(info.rate);
      setValid(info.valid);
    });
  }, []);

  const onAttempt = useCallback(() => {
    prompt('Without an Enhancement Talisman this will cost 80 stone.', () => {
      toServer('enhanceAttempt', {}, (info: EnhanceInfo) => {
        setRate(info.rate);
        setValid(info.valid);
        setResult(info.success);
        dispatch(updateItem(info.item));
      });
    });
  }, []);

  const resultText = useCallback(() => {
    switch (result) {
      case true:
        return 'Success';
      case false:
        return 'Failed';
      case null:
      default:
        return '';
    }
  }, [result]);

  console.log(item);

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
            {item === undefined && dragging !== null && ENHANCE_TYPES.includes(getItemType(dragging)) && (
              <DropZone onDrop={onDrop} location={ItemLocation.Enhance} />
            )}
            {item && <Item item={item} />}
          </DisplayGrid>
        </JPanel>

        <JPanel size={{ width: 110, height: 22 }} position={{ x: 6, y: 126 }} background="UIResource.Common.BigBG4">
          <MultilineLabel
            size={{ width: 110, height: 20 }}
            position={{ x: 0, y: 3 }}
            text={`Rate: ${rate}%`}
            style={{ textAlign: 'center' }}
          />
        </JPanel>

        <JPanel size={{ width: 23, height: 23 }} position={{ x: 165, y: 62 }} background="UIResource.Compose.Add" />

        <MultilineLabel
          size={{ width: 132, height: 20 }}
          position={{ x: 217, y: 30 }}
          text="Enhancement Talisman"
          style={{ textAlign: 'center' }}
        />
        <JPanel
          className="single-container"
          size={{ width: 46, height: 46 }}
          position={{ x: 260, y: 50 }}
          background="UIResource.Common.BigBG3">
          <DisplayGrid size={{ width: 1, height: 1 }} position={{ x: 5, y: 5 }}>
            {talisman === undefined && dragging !== null && TALISMAN_IDS.includes(dragging.iid) && (
              <DropZone onDrop={onDropTalisman} location={ItemLocation.EnhanceTalisman} />
            )}
            {talisman && <Item item={talisman} />}
          </DisplayGrid>
        </JPanel>

        <MultilineLabel
          size={{ width: 160, height: 37 }}
          position={{ x: 204, y: 100 }}
          text="Put Enhancement Talisman in for free attempt."
          style={{ textAlign: 'center' }}
        />

        <MultilineLabel size={{ width: 50, height: 17 }} position={{ x: 230, y: 130 }} text={`Result:`} style={{ textAlign: 'center' }} />
        <MultilineLabel size={{ width: 50, height: 17 }} position={{ x: 285, y: 130 }} text={resultText()} style={{ textAlign: 'left' }} />
      </JPanel>

      <JButton
        size={{ width: 100, height: 22 }}
        position={{ x: 40, y: 185 - 26 }}
        text="Attempt"
        disabled={!valid}
        onClick={() => {
          onAttempt();
          setResult(null);
        }}
      />
      <JButton size={{ width: 100, height: 22 }} position={{ x: 235, y: 185 - 26 }} text="Instructions" disabled />
    </>
  );
}
