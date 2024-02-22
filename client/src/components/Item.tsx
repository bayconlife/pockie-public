import './Item.css';
import * as React from 'react';
import {
  getItemAmount,
  getItemLocation,
  getItemPosition,
  getItemPrice,
  getItemSize,
  getItemSrc,
  getItemType,
  isItemType,
} from '../resources/Items';
import { ItemInfo } from '../features/ItemInfo/ItemInfo';
import { useAppDispatch, useAppSelector } from '../hooks';
import { Core, IItem, addItem, removeItemFromInventory, setItemPosition, swapItems, updateItem } from '../slices/inventorySlice';
import { dragItem } from '../slices/uiSlice';
import { ContextMenu } from './ContextMenu/ContextMenu';
import { ImageWithSpinner } from './ImageWithSpinner';
import { ItemType } from '../enums';
import { Spinner } from './Spinner';
import { CharacterContext } from '../context/CharacterContext';
import { CDNImage } from './Elements/Image';
import { closeDisplay, display, prompt } from '../util/EventEmitter';
import { toServer } from '../util/ServerSocket';
import { PetSkillBook } from '../features/PetSkillBook/PetSkillBook';
import { batch } from 'react-redux';
import { addStones } from '../slices/currencySlice';

const OUTLINES: { [key: number]: string } = {
  0: 'rgba(255, 255, 255, 0.3)',
  1: 'rgba(30, 255, 0, 0.3)',
  2: 'rgba(0, 112, 221, 0.3)',
  3: 'rgba(163, 53, 238, 0.3)',
  4: 'rgba(255, 128, 0, 0.3)',
};

interface Props {
  item: IItem;
  onClick?: () => void;
  onSwap?: (uid: string) => void;
  style?: React.CSSProperties;
  noBackground?: boolean;
  perRow?: number;
  overridePosition?: number;
}

const EQUIP_ITEM_TYPES = [
  ItemType.Avatar,
  ItemType.Weapon,
  ItemType.Gloves,
  ItemType.Pet,
  ItemType.Ring,
  ItemType.Amulet,
  ItemType.Helm,
  ItemType.Body,
  ItemType.Belt,
  ItemType.Shoes,
];

export const Item: React.FC<Props> = ({ item, onClick, onSwap, style = {}, noBackground = false, perRow = 10, overridePosition }) => {
  const dispatch = useAppDispatch();
  const ref = React.useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const [showContextMenu, setShowContextMenu] = React.useState(false);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const locations = useAppSelector((state) => state.inventory.locations);
  const draggedItem = useAppSelector((state) => state.ui.dragging.item);
  const { width, height } = getItemSize(item);

  const locationCopy = JSON.parse(JSON.stringify(locations));
  Array(10)
    .fill(null)
    .forEach((_, idx) => delete locationCopy[idx]);

  const isEquipped = noBackground || Object.values(locationCopy).includes(item.uid);

  React.useEffect(() => {
    if (draggedItem === null) {
      setHidden(false);
    }
  }, [draggedItem]);

  let hoverTimeout: NodeJS.Timeout | null = null;

  function _onClick(e: React.MouseEvent) {
    if (e.button === 2) {
      return;
    }

    if (onClick !== undefined) {
      onClick();
    } else if (draggedItem === null) {
      setHidden(true);
      dispatch(dragItem(item));
    } else {
      dispatch(dragItem(null));

      if (isItemType(draggedItem, ItemType.Gem)) {
        toServer('gemInsert', { uid: item.uid, gemUID: draggedItem.uid });
      } else {
        dispatch(swapItems({ uid: item.uid, targetUID: draggedItem.uid }));
      }

      toServer('swapItems', { itemUID: draggedItem.uid, targetUID: item.uid });
    }

    e.stopPropagation();
    e.preventDefault();
  }

  function onMouseEnter() {
    setHover(true);
  }

  function onMouseLeave() {
    setHover(false);
    setShowContextMenu(false);
  }

  function onMouseUp() {
    if (draggedItem === null) {
      return;
    }

    dispatch(dragItem(null));

    if (isItemType(draggedItem, ItemType.Gem)) {
      toServer('gemInsert', { uid: item.uid, gemUID: draggedItem.uid });
    } else {
      dispatch(swapItems({ uid: item.uid, targetUID: draggedItem.uid }));
    }

    toServer('swapItems', { itemUID: draggedItem.uid, targetUID: item.uid });
  }

  function onContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    hoverTimeout !== null && clearTimeout(hoverTimeout);
    setHover(false);
    setShowContextMenu(true);
  }

  function onSell() {
    const price = getItemPrice(item) * getItemAmount(item);

    setShowSpinner(true);

    prompt(
      `Sell ${getItemAmount(item)} [[item__${item.iid}--name]] for ${price}`,
      () => {
        toServer('sellItem', item.uid, () => {
          setHover(false);
          setShowContextMenu(false);
          setShowSpinner(false);
          batch(() => {
            dispatch(removeItemFromInventory(item.uid));
            dispatch(addStones(price));
          });
        });
      },
      () => {
        setHover(false);
        setShowContextMenu(false);
        setShowSpinner(false);
      }
    );
  }

  function onUse(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();

    setShowSpinner(true);

    if (isItemType(item, ItemType.PetSkillBook)) {
      display(
        'petSkillBook',
        <PetSkillBook
          item={item}
          onClose={() => {
            setShowSpinner(false);
            closeDisplay('petSkillBook');
          }}
        />
      );
    } else {
      toServer('useItem', item.uid, () => {
        setShowSpinner(false);
      });
    }

    setShowContextMenu(false);
  }

  function onSplit() {
    setShowSpinner(true);
    toServer('splitItem', { uid: item.uid }, ([newAmount, newItem]) => {
      const updatedItem = JSON.parse(JSON.stringify(item));

      updatedItem.core[Core.AMOUNT] = newAmount;

      dispatch(updateItem(updatedItem));
      dispatch(addItem(newItem));

      setShowSpinner(false);
    });
    setShowContextMenu(false);
  }

  const pos = overridePosition === undefined ? getItemPosition(item) : overridePosition;
  const x = pos % perRow;
  const y = Math.floor(pos / perRow);
  const src = getItemSrc(item);
  const props = item.props || { lines: [] };

  let _style: React.CSSProperties = {
    position: 'absolute',
    top: y * 27,
    left: x * 27,
    width: width * 26 + (width - 1),
    height: height * 26 + (height - 1),
    // border: isEquipped ? '' : `1px solid ${OUTLINES[item?.props?.lines.length || 0]}`,
    // boxSizing: 'border-box'
    background: isEquipped ? '' : `${OUTLINES[props.lines?.length || 0]}`,
    zIndex: 10,
    userSelect: 'none',
    ...style,
  };

  return (
    <div className="item-container" onMouseLeave={onMouseLeave}>
      <div
        className={hidden ? 'item item--hidden' : 'item'}
        ref={ref}
        style={_style}
        onMouseDown={_onClick}
        onMouseEnter={onMouseEnter}
        onMouseUp={onMouseUp}
        onContextMenu={onContextMenu}>
        <ImageWithSpinner src={src} />
        {getItemAmount(item) > 1 && (
          <div
            className="text-outline"
            style={{ fontSize: 12, color: 'whitesmoke', position: 'absolute', bottom: 0, right: 2, pointerEvents: 'none' }}>
            x{getItemAmount(item)}
          </div>
        )}

        {(hover || showContextMenu || (draggedItem !== null && isItemType(draggedItem, ItemType.Gem))) && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: width * 26 + (width - 1),
              height: height * 26 + (height - 1),
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 4,
            }}>
            {(item.props?.gems ?? []).some((uid: string) => uid !== null) && (
              <div
                style={{
                  background: 'rgba(200, 200, 200, 0.5)',
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  zIndex: 0,
                }}></div>
            )}
            {item.props?.gems?.map((gemUID: string, idx: null) => (
              <GemSlot key={`${item.uid}-gem-${idx}-${gemUID}`} uid={gemUID} />
            ))}
          </div>
        )}

        {showSpinner && <Spinner />}

        {hover && <ItemInfo item={item} />}
      </div>

      {showContextMenu && ref.current && !isEquipped && (
        <>
          {getItemLocation(item) < 10 ? (
            <ContextMenu
              position={{ x: ref.current.getBoundingClientRect().right, y: ref.current.getBoundingClientRect().y }}
              style={{ color: 'whitesmoke', zIndex: 20, minHeight: height * 26 }}>
              {getItemLocation(item) < 10 && (
                <>
                  {EQUIP_ITEM_TYPES.includes(getItemType(item)) && !isEquipped && (
                    <ContextMenu.Item
                      onClick={() => {
                        setShowSpinner(true);
                        toServer('equipItem', { uid: item.uid }, () => {
                          setShowSpinner(false);
                        });
                      }}
                      title="Equip"
                    />
                  )}
                  {[12, 45, 49, 450].includes(getItemType(item)) && <ContextMenu.Item onClick={(e) => onUse(e)} title="Use" />}
                  {getItemAmount(item) > 1 && <ContextMenu.Item onClick={onSplit} title="Split" />}
                  <ContextMenu.Item onClick={onSell} title="Sell" />
                </>
              )}
              {(item.props?.gems ?? []).some((uid: string) => uid !== null) && (
                <ContextMenu.Item
                  onClick={() => {
                    toServer('gemRemoveByUID', item.uid);
                    setShowContextMenu(false);
                  }}
                  title="Remove Gems"
                />
              )}
            </ContextMenu>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
};

function GemSlot({ uid }: { uid: string | null }) {
  const { character } = React.useContext(CharacterContext);
  let item = useAppSelector((state) => (uid === null ? null : state.inventory.items[uid]));

  if (!!character && !!uid) {
    item = character.items[uid];
  }

  return (
    <div className="grid--overlap" style={{ zIndex: 1 }}>
      <CDNImage src={'ui/Gems/Open.png'} style={{ margin: 'auto' }} />
      {!!item && <CDNImage src={getItemSrc(item)} width={24} height={24} style={{ margin: 'auto' }} />}
    </div>
  );
}
