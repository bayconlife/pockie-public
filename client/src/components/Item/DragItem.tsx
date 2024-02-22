import { useEffect, useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useMousePosition } from '../../hooks/mousePosition';
import { getItemSrc } from '../../resources/Items';
import { dragItem } from '../../slices/uiSlice';
import { CDNImage } from '../Elements/Image';

export function DragItem() {
  const dragRef = useRef<boolean>(false);
  const { x, y } = useMousePosition();
  const dispatch = useAppDispatch();
  const draggedItem = useAppSelector((state) => state.ui.dragging.item);
  const src = useMemo(() => (draggedItem === null ? '' : getItemSrc(draggedItem)), [draggedItem]);

  dragRef.current = draggedItem !== null;

  useEffect(() => {
    const revertOnRightClick = (e: MouseEvent) => {
      if (dragRef.current) {
        e.preventDefault();
        e.stopPropagation();
      }

      dispatch(dragItem(null));
    };
    document.addEventListener('contextmenu', revertOnRightClick);

    return () => {
      document.removeEventListener('contextmenu', revertOnRightClick);
    };
  }, []);

  if (draggedItem === null) {
    return null;
  }

  return (
    <CDNImage
      src={src}
      style={{
        position: 'fixed',
        left: x!,
        top: y!,
        transform: 'translate(-50%, -50%)',
        zIndex: 10000,
        pointerEvents: 'none',
        opacity: '0.5',
      }}
    />
  );
}
