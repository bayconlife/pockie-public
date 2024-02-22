import * as React from 'react';
import { getItemLocation, getItemPosition, getItemSize } from '../resources/Items';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useRef } from 'react';
import { useEffect } from 'react';
import { IItem } from '../slices/inventorySlice';
import PackageBack from '../assets/PackageBack.png';
import { dragItem } from '../slices/uiSlice';

interface Props {
  numberOfTiles?: number;
  tilesPerRow?: number;
  location: number;
  onDrop?: (uid: string, position: number, valid: boolean) => void;
  bg?: string;
  children?: React.ReactNode;
}

export const Grid: React.FC<Props> = ({ numberOfTiles = 0, tilesPerRow = 0, location, onDrop, bg = PackageBack, children }) => {
  const tileWidth = 26,
    tileHeight = 26,
    rowPadding = 1,
    colPadding = 1;

  const grid = [];
  for (let i = 0; i < numberOfTiles; i++) {
    const x = (i % tilesPerRow) * (tileWidth + colPadding);
    const y = Math.floor(i / tilesPerRow) * (tileHeight + rowPadding);

    grid[i] = <GridItem key={i} width={tileWidth} height={tileHeight} x={x} y={y} bg={bg} />;
  }

  return (
    <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
      {grid}
      {children}
      {onDrop && <DropZone numberOfTiles={numberOfTiles} tilesPerRow={tilesPerRow} onDrop={onDrop} location={location} />}
    </div>
  );
};

interface DropZoneProps {
  numberOfTiles: number;
  tilesPerRow: number;
  location: number;
  onDrop: (uid: string, position: number, valid: boolean) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ numberOfTiles, tilesPerRow, location, onDrop }) => {
  const items = useAppSelector((state) => state.inventory.items);
  const draggedItem = useAppSelector((state) => state.ui.dragging.item);

  if (draggedItem === null) {
    return null;
  }

  return (
    <Zone
      numberOfTiles={numberOfTiles}
      tilesPerRow={tilesPerRow}
      items={Object.keys(items)
        .filter((uid) => getItemLocation(items[uid]) === location)
        .map((uid) => items[uid])}
      onDrop={onDrop}
    />
  );
};

interface ZoneProps {
  items: IItem[];
  onDrop: (uid: string, position: number, valid: boolean) => void;
  numberOfTiles: number;
  tilesPerRow: number;
}

function Zone({ items, onDrop, numberOfTiles, tilesPerRow }: ZoneProps) {
  const dispatch = useAppDispatch();
  const mouseReadyRef = useRef<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = React.useState<number[]>([]);
  const [cellPosition, setCellPosition] = React.useState({ x: -1, y: -1 });
  const draggedItem = useAppSelector((state) => state.ui.dragging.item);

  useEffect(() => {
    mouseReadyRef.current = false;
  }, [draggedItem]);

  useEffect(() => {
    if (draggedItem === null) {
      return;
    }

    const newPositions: number[] = [];

    items.forEach((item) => {
      const { uid } = item;
      const position = getItemPosition(item);

      if (uid === draggedItem.uid) {
        return;
      }

      const x = position % tilesPerRow;
      const y = Math.floor(position / tilesPerRow);

      for (let dy = 0; dy < getItemSize(item).height; dy++) {
        for (let dx = 0; dx < getItemSize(item).width; dx++) {
          newPositions.push(x + dx + (y + dy) * tilesPerRow);
        }
      }
    });

    setPositions(newPositions);
  }, [items, draggedItem]);

  const size = React.useMemo(() => (draggedItem === null ? { width: 0, height: 0 } : getItemSize(draggedItem)), [draggedItem]);
  const valid = React.useMemo(() => {
    if (cellPosition.x < 0 || cellPosition.y < 0) {
      return false;
    }

    const dropPositions: number[] = [];

    for (let dy = 0; dy < size.height; dy++) {
      for (let dx = 0; dx < size.width; dx++) {
        dropPositions.push(cellPosition.x + dx + (cellPosition.y + dy) * tilesPerRow);
      }
    }

    return !positions.some((position) => dropPositions.includes(position));
  }, [cellPosition, positions, size]);

  const onMouseOver = React.useCallback(
    (e: React.MouseEvent) => {
      if (draggedItem === null || ref.current === null) {
        return;
      }

      setTimeout(() => (mouseReadyRef.current = true), 30);

      const bounds = ref.current.getBoundingClientRect();
      let cx = Math.round((e.clientX - bounds.x) / 27);
      let cy = Math.round((e.clientY - bounds.y) / 27);

      if (size.height > 1 || size.width > 1) {
        cx = Math.min(tilesPerRow - 1 - Math.round(size.width / 2), Math.max(0, cx - Math.floor(size.width / 2)));
        cy = Math.min(
          Math.floor(numberOfTiles / tilesPerRow) - 1 - Math.ceil(size.height / 2),
          Math.max(0, cy - Math.floor(size.height / 2))
        );
      } else {
        cx = Math.floor((e.clientX - bounds.x) / 27);
        cy = Math.floor((e.clientY - bounds.y) / 27);
      }

      if (cx !== cellPosition.x || cy !== cellPosition.y) {
        setCellPosition({ x: cx, y: cy });
      }
    },
    [draggedItem, cellPosition]
  );

  function onClick(e: React.MouseEvent) {
    if (draggedItem === null) {
      return;
    }

    if (mouseReadyRef.current === false) {
      dispatch(dragItem(null));
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    onDrop(draggedItem?.uid, cellPosition.x + cellPosition.y * tilesPerRow, valid);
  }

  function onMouseUp(e: React.MouseEvent) {
    if (mouseReadyRef.current) {
      onClick(e);
    }
  }

  return (
    <div
      ref={ref}
      style={{ position: 'absolute', width: '100%', height: '100%' }}
      onMouseMove={onMouseOver}
      onMouseUp={onMouseUp}
      onClick={onClick}>
      {valid && (
        <div
          style={{
            position: 'absolute',
            width: 27 * size.width - 2,
            height: 27 * size.height - 2,
            top: cellPosition.y * 27,
            left: cellPosition.x * 27,
            background: 'green',
            filter: 'opacity(50%)',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}

const GridItem: React.FC<{ width: number; height: number; x: number; y: number; bg: string }> = ({ width, height, x, y, bg }) => {
  let style: React.CSSProperties = {
    position: 'absolute',
    top: y,
    left: x,
  };

  return <img src={bg} width={width} height={height} style={style} />;
};
