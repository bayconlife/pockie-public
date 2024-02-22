import { useEffect, useRef, useState } from 'react';
import EventEmitter from '../../util/EventEmitter';
import Panel from '../../components/Panel/Panel';
import JPanel from '../../components/UI/JPanel';
import { JTabbedPane } from '../../components/UI/JTabbedPane';
import { useAppSelector } from '../../hooks';
import { Grid } from '../../components/Grid';
import { Item } from '../../components/Item';
import { getItemLocation, getItemPosition, isItemBound } from '../../resources/Items';

const tabs = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'].map((name) => ({
  name,
}));

export function SelectItemFromInventory() {
  const onAcceptRef = useRef<(uid: string | null) => void>();
  const [manualRefresh, setManualRefresh] = useState(0);

  useEffect(() => {
    const id = EventEmitter.on('selectItemFromInventory', (onAccept) => {
      onAcceptRef.current = onAccept;
      setManualRefresh(Math.random());
    });

    return () => {
      EventEmitter.off(id);
    };
  }, []);

  function onClick(uid: string) {
    onAcceptRef.current?.(uid);
    onAcceptRef.current = undefined;
    setManualRefresh(Math.random());
  }

  if (onAcceptRef.current === undefined) {
    return null;
  }

  return (
    <Panel
      moveable={false}
      onClose={() => {
        onAcceptRef.current?.(null);
        onAcceptRef.current = undefined;
        setManualRefresh(Math.random());
      }}>
      <JPanel size={{ width: 333, height: 200 }} />
      <JPanel size={{ width: 333, height: 200 }} position={{ x: 0, y: 0 }} background="UIResource.Common.BigBG1">
        <JTabbedPane
          size={{ width: 279, height: 196 }}
          position={{ x: 5, y: 0 }}
          tabs={tabs}
          active={'I'}
          background="UIResource.Common.BigBG1"
          tabWidth={17}>
          <JTabbedPane.Tab name="I">
            <Package id={0} onClick={onClick} />
          </JTabbedPane.Tab>

          <JTabbedPane.Tab name="II">
            <Package id={1} onClick={onClick} />
          </JTabbedPane.Tab>

          <JTabbedPane.Tab name="III">
            <Package id={2} onClick={onClick} />
          </JTabbedPane.Tab>

          <JTabbedPane.Tab name="IV">
            <Package id={3} onClick={onClick} />
          </JTabbedPane.Tab>

          <JTabbedPane.Tab name="V">
            <Package id={4} onClick={onClick} />
          </JTabbedPane.Tab>

          <JTabbedPane.Tab name="VI">
            <Package id={5} onClick={onClick} />
          </JTabbedPane.Tab>

          <JTabbedPane.Tab name="VII">
            <Package id={6} onClick={onClick} />
          </JTabbedPane.Tab>

          <JTabbedPane.Tab name="VIII">
            <Package id={7} onClick={onClick} />
          </JTabbedPane.Tab>

          <JTabbedPane.Tab name="IX">
            <Package id={8} onClick={onClick} />
          </JTabbedPane.Tab>

          <JTabbedPane.Tab name="X">
            <Package id={9} onClick={onClick} />
          </JTabbedPane.Tab>
        </JTabbedPane>
      </JPanel>
    </Panel>
  );
}

const Package: React.FC<{ id: number; onClick: (uid: string) => void }> = ({ id, onClick }) => {
  const items = useAppSelector((state) => state.inventory.items);

  return (
    <JPanel size={{ width: 271, height: 160 }} position={{ x: 5, y: 5 }}>
      <Grid numberOfTiles={60} tilesPerRow={10} location={id} />
      {Object.entries(items)
        .filter(([uid, item]) => getItemLocation(item) === id)
        .map(([uid, item]) => (
          <Item
            key={uid + '-' + getItemPosition(item)}
            item={item}
            onClick={() => {
              if (!isItemBound(item)) {
                onClick(uid);
              }
            }}
            style={{ filter: isItemBound(item) ? 'grayscale(1.0)' : undefined, cursor: isItemBound(item) ? 'default' : 'pointer' }}
          />
        ))}
    </JPanel>
  );
};
