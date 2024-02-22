import * as React from 'react';
import { Grid } from '../../components/Grid';
import { Item } from '../../components/Item';
import Panel from '../../components/Panel/Panel';
import { JButton } from '../../components/UI/JButton';
import JPanel from '../../components/UI/JPanel';
import { JTabbedPane } from '../../components/UI/JTabbedPane';
import { getAvatarPose, getItemLocation, getItemPosition, getItemType, isItemType } from '../../resources/Items';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { equipItem, hideInventory, setItemPosition } from '../../slices/inventorySlice';
import { ItemType } from '../../enums';
import { Compose } from '../Compose/Compose';
import { dragItem } from '../../slices/uiSlice';
import { SERVER_CONFIG } from '../../util/serverConfig';
import useTranslator from '../../hooks/translate';
import { Spinner } from '../../components/Spinner';
import { MultiSell } from './MultiSell';
import { TooltipContainer } from '../../components/Tooltips/TooltipContainer';
import { CDNImage } from '../../components/Elements/Image';
import { toServer } from '../../util/ServerSocket';
import { JLayout } from '../../components/UI/JLayout';
import { hideCollection, showCollection } from '../../slices/panelSlice';
import { Collection } from '../Collection/Collection';
import store from '../../store';
import { shallowEqual } from 'react-redux';
import { closeDisplay, display } from '../../util/EventEmitter';
import { Bloodlines } from '../Bloodlines/Bloodlines';
import { Reroll } from '../Reroll/Reroll';

export function Inventory() {
  const dispatch = useAppDispatch();

  const isCollectionOpen = useAppSelector((state) => state.panels.collection);

  const [active, setActive] = React.useState('I');
  const [showCompose, setShowCompose] = React.useState(false);
  const [showMultiSell, setShowMultiSell] = React.useState(false);

  // React.useEffect(() => {
  //   toServer('inventory', {}, (data: { items: any[]; equipped: any[] }) => {
  //     // dispatch(setItems(data.items));
  //     // dispatch(setEquippedItems(data.equipped));
  //   });
  // }, []);

  let timeout: NodeJS.Timeout;
  const tabs = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'].map((name) => ({
    name,
    events: {
      onDragOver: (e: React.DragEvent) => e.preventDefault(),
      onDrop: (e: React.DragEvent) => e.preventDefault(),
      onDragEnter: (e: React.DragEvent) => {
        e.preventDefault();
        clearTimeout(timeout);
        if (localStorage.getItem('dragUid') !== '-1') {
          timeout = setTimeout(() => setActive(name), 300);
        }
      },
      onDragLeave: (e: React.DragEvent) => {
        e.preventDefault();
        clearTimeout(timeout);
      },
    },
  }));

  return (
    <>
      <Panel onClose={() => dispatch(hideInventory())} name="Inventory">
        <JPanel size={{ width: 333 + 36, height: 467 }}>
          <JPanel size={{ width: 63, height: 262 }} background="UIResource.Equip.EquipBG">
            <JPanel size={{ width: 55, height: 55 }} position={{ x: 4, y: 4 }} background="UIResource.Equip.Avatar">
              <EquipmentSlot slot={ItemType.Avatar} />
            </JPanel>
            <JPanel size={{ width: 55, height: 83 }} position={{ x: 4, y: 61 }}>
              <EquipmentSlot slot={ItemType.Weapon} />
            </JPanel>
            <JPanel size={{ width: 55, height: 55 }} position={{ x: 4, y: 146 }} background="UIResource.Equip.Glove">
              <EquipmentSlot slot={ItemType.Gloves} />
            </JPanel>
            <JPanel size={{ width: 55, height: 55 }} position={{ x: 4, y: 203 }} background="UIResource.Equip.Pet">
              <EquipmentSlot slot={ItemType.Pet} />
            </JPanel>
          </JPanel>

          <JPanel size={{ width: 63, height: 262 }} position={{ x: 270 + 36, y: 0 }} background="UIResource.Equip.EquipBG">
            <JPanel size={{ width: 28, height: 28 }} position={{ x: 3, y: 3 }} background="UIResource.Equip.FingerRing">
              <EquipmentSlot slot={ItemType.Ring} />
            </JPanel>
            <JPanel size={{ width: 28, height: 28 }} position={{ x: 32, y: 3 }} background="UIResource.Equip.Amu">
              <EquipmentSlot slot={ItemType.Amulet} />
            </JPanel>
            <JPanel size={{ width: 55, height: 55 }} position={{ x: 4, y: 32 }} background="UIResource.Equip.Hat">
              <EquipmentSlot slot={ItemType.Helm} />
            </JPanel>
            <JPanel size={{ width: 55, height: 55 }} position={{ x: 4, y: 89 }} background="UIResource.Equip.Cloth">
              <EquipmentSlot slot={ItemType.Body} />
            </JPanel>
            <JPanel size={{ width: 55, height: 55 }} position={{ x: 4, y: 146 }} background="UIResource.Equip.Caestus">
              <EquipmentSlot slot={ItemType.Belt} />
            </JPanel>
            <JPanel size={{ width: 55, height: 55 }} position={{ x: 4, y: 203 }} background="UIResource.Equip.Shoes">
              <EquipmentSlot slot={ItemType.Shoes} />
            </JPanel>
          </JPanel>

          <JPanel size={{ width: 199, height: 218 }} position={{ x: 67 + 18, y: 43 }} background="UIResource.Equip.Peoplebg">
            <JPanel size={{ width: 173, height: 159 }} position={{ x: 11, y: 21 }}></JPanel> {/* ability*/}
            <JPanel size={{ width: 168, height: 200 }} position={{ x: 14, y: 11 }}>
              <Avatar />
            </JPanel>{' '}
            {/* avatar*/}
            <JPanel size={{ width: 150, height: 150 }} position={{ x: 25, y: 47 }}></JPanel> {/* effect*/}
            <JButton
              size={{ width: 45, height: 44 }}
              position={{ x: 4, y: 5 }}
              text="Blood Limit"
              onClick={() => display('bloodline', <Bloodlines onClose={() => closeDisplay('bloodline')} />)}
            />
            {/* "WrapSimpleButtonByLink": "UIResource.Common.ProgressHelpButton2" */}
          </JPanel>

          <JPanel size={{ width: 369, height: 200 }} position={{ x: 0, y: 267 }} background="UIResource.Common.BigBG1">
            <JTabbedPane
              size={{ width: 279, height: 196 }}
              position={{ x: 5, y: 0 }}
              tabs={tabs}
              active={active}
              background="UIResource.Common.BigBG1"
              tabWidth={17}>
              <JTabbedPane.Tab name="I">
                <Package id={0} />
              </JTabbedPane.Tab>

              <JTabbedPane.Tab name="II">
                <Package id={1} />
              </JTabbedPane.Tab>

              <JTabbedPane.Tab name="III">
                <Package id={2} />
              </JTabbedPane.Tab>

              <JTabbedPane.Tab name="IV">
                <Package id={3} />
              </JTabbedPane.Tab>

              <JTabbedPane.Tab name="V">
                <Package id={4} />
              </JTabbedPane.Tab>

              <JTabbedPane.Tab name="VI">
                <Package id={5} />
              </JTabbedPane.Tab>

              <JTabbedPane.Tab name="VII">
                <Package id={6} />
              </JTabbedPane.Tab>

              <JTabbedPane.Tab name="VIII">
                <Package id={7} />
              </JTabbedPane.Tab>

              <JTabbedPane.Tab name="IX">
                <Package id={8} />
              </JTabbedPane.Tab>

              <JTabbedPane.Tab name="X">
                <Package id={9} />
              </JTabbedPane.Tab>
            </JTabbedPane>

            <JPanel x={288}>
              <JButton y={28} text="Compose" onClick={() => setShowCompose(!showCompose)} />
              <JButton y={58} text="Multi-Sell" onClick={() => setShowMultiSell(!showMultiSell)} />
              <JButton y={88} text="Collection" onClick={() => dispatch(isCollectionOpen ? hideCollection() : showCollection())} />
              <JButton y={118} text="Wardrobe" disabled />
              <JButton y={148} text="Reroll" onClick={() => display(Reroll.name, <Reroll />)} />
            </JPanel>
          </JPanel>

          <JPanel size={{ width: 164, height: 36 }} position={{ x: 85 + 18, y: 3 }} background="UIResource.Common.BigBG7">
            <JPanel size={{ width: 160, height: 32 }} position={{ x: 2, y: 2 }}>
              <Title />
            </JPanel>
          </JPanel>
        </JPanel>
      </Panel>

      {showCompose && <Compose onClose={() => setShowCompose(false)} />}
      {showMultiSell && <MultiSell onClose={() => setShowMultiSell(false)} />}
      <Collection />
    </>
  );
}

function Package({ id }: { id: number }) {
  const dispatch = useAppDispatch();
  const container = useAppSelector((state) => state.inventory.containers[id] ?? {}, shallowEqual);

  function onDrop(_uid: string, _position: number, valid: boolean) {
    dispatch(dragItem(null));

    if (valid) {
      dispatch(setItemPosition({ uid: _uid, position: _position, location: id }));
      toServer('moveItem', { uid: _uid, location: id, position: _position });
    }
  }

  return (
    <JPanel size={{ width: 271, height: 160 }} position={{ x: 5, y: 5 }}>
      <Grid numberOfTiles={60} tilesPerRow={10} onDrop={onDrop} location={id} />
      {Object.entries(container).map(([location, uid]) => (
        <InventoryItem key={uid + '-' + location} uid={uid} />
      ))}
    </JPanel>
  );
}

function InventoryItem({ uid }: { uid: string }) {
  const item = useAppSelector((state) => state.inventory.items[uid]);

  return <Item item={item} />;
}

function EquipmentSlot({ slot }: { slot: ItemType }) {
  const dispatch = useAppDispatch();
  const item = useAppSelector((state) => state.inventory.items[state.inventory.locations[300 + slot]]);
  const draggedItem = useAppSelector((state) => state.ui.dragging.item);
  const level = useAppSelector((state) => state.stats.stats.level);

  let showValid = draggedItem !== null && getItemType(draggedItem) === slot;
  const underleveled = showValid && draggedItem && draggedItem.props?.level > level && getItemType(draggedItem) !== ItemType.Pet;

  function onClick(e: React.MouseEvent) {
    if (draggedItem === null) {
      return;
    }

    if (underleveled) {
      return;
    }

    if (getItemType(draggedItem) !== slot) {
      return;
    }

    dispatch(dragItem(null));

    if (item?.uid === draggedItem.uid) {
      return;
    }

    toServer('equipItem', { uid: draggedItem.uid, slot });
  }

  let style: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  };

  if (showValid) {
    style = {
      ...style,
      pointerEvents: item && item.uid !== draggedItem?.uid ? 'none' : 'auto',
      background: 'green',
      filter: 'opacity(50%)',
    };

    if (item && getItemType(item) !== ItemType.Avatar && underleveled) {
      style.background = 'red';
    }
  }

  const preventAvatar = !!item && getItemType(item) === ItemType.Avatar ? () => {} : undefined;

  return (
    <>
      {item && <Item item={item} style={{ top: 2, left: 2 }} onSwap={(uid) => dispatch(equipItem(uid))} onClick={preventAvatar} />}
      <div style={style} onDragOver={(e) => e.preventDefault()} onDragEnter={(e) => e.preventDefault()} onMouseUp={onClick} />
    </>
  );
}

function Avatar() {
  const equippedAvatar = useAppSelector((state) => state.inventory.items[state.inventory.locations[300]]);
  const activateBloodlines = useAppSelector((state) => state.character.bloodlines.active);
  const style: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transformOrigin: 'left bottom',
    transform: 'scale(0.6) translateX(-50%)',
  };
  const bloodlineStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transformOrigin: 'left bottom',
    transform: 'translateX(-50%) translateY(-25%)',
  };

  return (
    <>
      {equippedAvatar && (
        <>
          {!!activateBloodlines[0] && <CDNImage src={`icons/bloodlines/bg/${activateBloodlines[0]}.png`} style={bloodlineStyle} />}
          <CDNImage src={getAvatarPose(equippedAvatar)} style={style} />
        </>
      )}
    </>
  );
}

function Title() {
  const t = useTranslator();
  const currentTitle = useAppSelector((state) => state.stats.stats.title ?? 0);
  const knownTitles = useAppSelector((state) => state.character.titles.unlocked);
  const [hover, setHover] = React.useState(false);
  const [selected, setSelected] = React.useState('' + currentTitle);
  const [isLoading, setIsLoading] = React.useState(false);

  const options = knownTitles.map((id) => (
    <option key={id} value={id}>
      {t(`title__${id}`)}
    </option>
  ));

  function removeSelectText() {
    const selectElement = document.getElementById('title-select') as HTMLSelectElement;

    if (selectElement) {
      selectElement.value = '';
    }
  }

  React.useEffect(removeSelectText);

  const tooltip = SERVER_CONFIG.TITLES[selected]?.map((line: any, idx: number) => (
    <div key={`title-tooltip-line${idx}`}>
      {t(`stat__${line[0]}`)} +{line[1]}
    </div>
  ));

  return (
    <>
      {!isLoading && (
        <CDNImage
          src={`titles/${selected}.gif`}
          style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}
          alt={`Title ${selected}`}
        />
      )}

      {isLoading && (
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: 32, height: '100%' }}>
          <Spinner />
        </div>
      )}

      <select
        id="title-select"
        style={{ width: '100%', height: '100%', background: 'none', cursor: 'pointer' }}
        onChange={(e) => {
          setIsLoading(true);
          const id = e.target.value;

          toServer('setTitle', id, () => {
            setIsLoading(false);
            setSelected(id);
            removeSelectText();
          });
        }}
        onMouseDown={() => setHover(false)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}>
        {options}
      </select>

      {hover && (
        <TooltipContainer>
          <div style={{ width: 150 }}>{tooltip}</div>
        </TooltipContainer>
      )}
    </>
  );
}
