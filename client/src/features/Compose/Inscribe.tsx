import { useCallback, useEffect, useState } from 'react';
import { batch } from 'react-redux';
import { Item } from '../../components/Item';
import { JButton } from '../../components/UI/JButton';
import JPanel from '../../components/UI/JPanel';
import { JTextField } from '../../components/UI/JTextField';
import { MultilineLabel } from '../../components/UI/MultilineLabel';
import { ItemLocation, ItemType } from '../../enums';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { DisplayGrid } from '../../components/Grid/DisplayGrid';
import { DropZone } from '../../components/DropZone/DropZone';
import { CDNImage } from '../../components/Elements/Image';
import { toServer } from '../../util/ServerSocket';
import { getItemAmount, getItemType, isItemType } from '../../resources/Items';
import { IItem, updateItem } from '../../slices/inventorySlice';

const INFO =
  '1. Weapon and armor can be inscribed. The highest inscription level is 12.<br/>' +
  "2. Inscription can raise equipment's basic attributes: min and max attack for weapons, defense for armors<br/>" +
  '3. Inscription needs Inscription Talisman and stones.<br/>' +
  "4. Inscription Talisman can be found in a zone's area slot machine.";

const inscribeTypes = [ItemType.Weapon, ItemType.Belt, ItemType.Body, ItemType.Gloves, ItemType.Helm, ItemType.Shoes];

interface InscribeInfo {
  item: IItem;
  result: boolean;
  chance: number;
  cost: number;
  failure: number;
  percentStat: number;
}

export function Inscribe() {
  const dispatch = useAppDispatch();
  const dragging = useAppSelector((state) => state.ui.dragging.item);
  const item = useAppSelector((state) => state.inventory.items[state.inventory.locations[ItemLocation.Inscribe]]);
  const items = useAppSelector((state) => state.inventory.items);

  const [result, setResult] = useState<boolean | null>(null);
  const [chance, setChance] = useState(0);
  const [cost, setCost] = useState(0);
  const [percent, setPercent] = useState(0);
  const [talismanAmount, setTalismanAmount] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item === undefined) {
      return;
    }

    toServer('inscribeGetInfo', {}, (info: InscribeInfo) => {
      batch(() => {
        setChance(info.chance ?? 0);
        setCost(info.cost ?? 0);
        setPercent(info.percentStat ?? 0);
      });
    });
  }, []);

  useEffect(() => {
    if (item === undefined) {
      batch(() => {
        setResult(null);
        setChance(0);
        setCost(0);
        setPercent(0);
      });
    }
  }, [item]);

  const onDrop = useCallback((uid: string) => {
    toServer('inscribeSetItem', { uid, location: ItemLocation.Inscribe }, (info: InscribeInfo) => {
      batch(() => {
        setChance(info.chance);
        setCost(info.cost);
        setPercent(info.percentStat);
      });
    });
  }, []);

  const onAttempt = useCallback(() => {
    setLoading(true);
    toServer('inscribeAttempt', talismanAmount, (info: InscribeInfo) => {
      batch(() => {
        setResult(info.result);
        setChance(info.chance ?? 0);
        setCost(info.cost ?? 0);
        setPercent(info.percentStat ?? 0);
        setLoading(false);
        dispatch(updateItem(info.item));
      });
    });
  }, [talismanAmount]);

  const lowSeals = Object.entries(items).reduce((sum, [key, item]) => (item.iid === 161008 ? (sum += getItemAmount(item)) : sum), 0);

  return (
    <>
      <JPanel size={{ width: 366, height: 350 - 26 }} background="UIResource.Common.BigBG1">
        <JPanel size={{ width: 356, height: 90 }} position={{ x: 5, y: 5 }} background="UIResource.Common.BigBG3">
          <MultilineLabel size={{ width: 348, height: 82 }} position={{ x: 4, y: 4 }} text={INFO} />
        </JPanel>

        <JPanel size={{ width: 356, height: 90 }} position={{ x: 5, y: 100 }} background="UIResource.Common.BigBG4">
          <JPanel size={{ width: 110, height: 20 }} position={{ x: 15, y: 5 }} background="UIResource.Common.BigBG5">
            <MultilineLabel
              size={{ width: 110, height: 20 }}
              position={{ x: 0, y: 2 }}
              text={`Current Lvl: ${item?.props?.inscribe ?? 0}`}
              style={{ textAlign: 'center' }}
            />
            {item !== undefined && isItemType(item, ItemType.Weapon) && (
              <div className="text" style={{ position: 'absolute', top: 25, width: 110, fontSize: 12 }}>
                <div>
                  Min Attack<span style={{ position: 'absolute', right: 0 }}>+ {item.props?.stats['Inscribe_1']?.roll ?? 0}</span>
                </div>
                <div>
                  Max Attack<span style={{ position: 'absolute', right: 0 }}>+ {item.props?.stats['Inscribe_2']?.roll ?? 0}</span>
                </div>
              </div>
            )}
            {item !== undefined && !isItemType(item, ItemType.Weapon) && (
              <div className="text" style={{ position: 'absolute', top: 25, width: 110, fontSize: 12 }}>
                Defense<span style={{ position: 'absolute', right: 0 }}>+ {item.props?.stats['Inscribe_1']?.roll ?? 0}</span>
              </div>
            )}
          </JPanel>

          <JPanel size={{ width: 100, height: 20 }} position={{ x: 128, y: 65 }} background="UIResource.Common.BigBG4">
            <MultilineLabel
              size={{ width: 100, height: 20 }}
              position={{ x: 0, y: 2 }}
              text={result === null ? 'Result' : result ? 'Success' : 'Failure'}
              style={{ textAlign: 'center' }}
            />
          </JPanel>

          <JPanel size={{ width: 46, height: 20 }} position={{ x: 155, y: 35 }} background="UIResource.Compose.Direction" />

          <JPanel size={{ width: 110, height: 20 }} position={{ x: 231, y: 5 }} background="UIResource.Common.BigBG5">
            <MultilineLabel
              size={{ width: 110, height: 20 }}
              position={{ x: 0, y: 2 }}
              text="After Success"
              style={{ textAlign: 'center' }}
            />
            {item !== undefined && isItemType(item, ItemType.Weapon) && (
              <div className="text" style={{ position: 'absolute', top: 25, width: 110, fontSize: 12 }}>
                <div>
                  Min Attack
                  <span style={{ position: 'absolute', right: 0 }}>+ {Math.ceil(((item.props?.attack[0] ?? 0) * percent) / 100)}</span>
                </div>
                <div>
                  Max Attack
                  <span style={{ position: 'absolute', right: 0 }}>+ {Math.ceil(((item.props?.attack[1] ?? 0) * percent) / 100)}</span>
                </div>
              </div>
            )}
            {item !== undefined && !isItemType(item, ItemType.Weapon) && (
              <div className="text" style={{ position: 'absolute', top: 25, width: 110, fontSize: 12 }}>
                Defense<span style={{ position: 'absolute', right: 0 }}>+ {Math.ceil(((item.props?.defense ?? 0) * percent) / 100)}</span>
              </div>
            )}
          </JPanel>
        </JPanel>

        <JPanel size={{ width: 356, height: 126 }} position={{ x: 5, y: 194 }} background="UIResource.Common.BigBG4">
          {/* Radio buttons? */}
        </JPanel>

        <JPanel className="single-container" size={{ width: 63, height: 90 }} position={{ x: 30, y: 200 }}>
          <DisplayGrid size={{ width: 2, height: 3 }}>
            {item === undefined && dragging !== null && inscribeTypes.includes(getItemType(dragging)) && (
              <DropZone onDrop={onDrop} location={ItemLocation.Inscribe} />
            )}
            {item !== undefined && (
              <Item item={item} style={{ position: 'relative', margin: 'auto', background: '' }} overridePosition={0} />
            )}
          </DisplayGrid>
        </JPanel>

        <JPanel size={{ width: 36, height: 36 }} position={{ x: 190, y: 230 }}>
          <DisplayGrid size={{ width: 1, height: 1 }} />

          <CDNImage
            className={lowSeals === 0 ? 'grayscale' : ''}
            src="icons/items/etc/lowseal.png"
            style={{ position: 'absolute', top: 6, left: 6 }}
          />
          <div className="text-outline" style={{ fontSize: 12, color: 'whitesmoke', position: 'absolute', bottom: 4, right: 6 }}>
            {lowSeals.toString()}
          </div>
        </JPanel>

        <JPanel size={{ width: 36, height: 36 }} position={{ x: 290, y: 230 }}>
          <DisplayGrid size={{ width: 1, height: 1 }} />

          <CDNImage className="grayscale" src="icons/items/etc/highseal.png" style={{ position: 'absolute', top: 6, left: 6 }} />
          <div className="text-outline" style={{ fontSize: 12, color: 'whitesmoke', position: 'absolute', bottom: 4, right: 6 }}>
            {0}
          </div>
        </JPanel>

        <JPanel size={{ width: 100, height: 20 }} position={{ x: 10, y: 295 }} background="UIResource.Common.BigBG4">
          <MultilineLabel
            size={{ width: 100, height: 20 }}
            position={{ x: 0, y: 2 }}
            text={`Rate: ${chance === 0 ? 0 : Math.min(chance + 3 * talismanAmount, 100)}%`}
            style={{ textAlign: 'center' }}
          />
        </JPanel>

        <MultilineLabel size={{ width: 80, height: 20 }} position={{ x: 168, y: 212 }} text="Low Level" style={{ textAlign: 'center' }} />
        <MultilineLabel size={{ width: 80, height: 20 }} position={{ x: 267, y: 212 }} text="Advanced" style={{ textAlign: 'center' }} />

        <MultilineLabel size={{ width: 70, height: 20 }} position={{ x: 110, y: 272 }} text="Use:" style={{ textAlign: 'right' }} />
        {/* <JTextField size={{ width: 135, height: 20 }} position={{ x: 190, y: 270 }} text="1" /> */}
        <input
          type="number"
          min={1}
          max={5}
          value={talismanAmount}
          onKeyDown={(e) => e.preventDefault()}
          onChange={(e) => {
            let amount = Math.min(Math.max(Number(e.target.value), 1), 5);

            while (chance + 3 * (amount - 1) > 100) {
              amount -= 1;
            }

            setTalismanAmount(amount);
          }}
          style={{ position: 'absolute', left: 190, top: 270, width: 135, height: 16 }}
        />

        <MultilineLabel size={{ width: 70, height: 20 }} position={{ x: 110, y: 297 }} text="Stones:" style={{ textAlign: 'right' }} />
        <MultilineLabel size={{ width: 135, height: 20 }} position={{ x: 190, y: 297 }} text={cost.toString()} />
      </JPanel>

      <JButton
        size={{ width: 76, height: 22 }}
        position={{ x: 149, y: 330 }}
        text={'Attempt'}
        disabled={item === undefined || lowSeals === 0 || chance === 0}
        onClick={onAttempt}
      />
    </>
  );
}
