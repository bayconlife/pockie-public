import { useAppDispatch, useAppSelector } from '../../hooks';
import { Core, setItemPosition } from '../../slices/inventorySlice';
import { dragItem } from '../../slices/uiSlice';

interface Props {
  onDrop: (uid: string) => void;
  location: number;
}

export function DropZone({ onDrop, location }: Props) {
  const dispatch = useAppDispatch();
  const draggedItem = useAppSelector((state) => state.ui.dragging.item);

  const style: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'green',
    filter: 'opacity(50%)',
  };

  function onClick(e: React.MouseEvent) {
    if (draggedItem === null) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    dispatch(setItemPosition({ uid: draggedItem.uid, position: draggedItem.core[Core.POSITION], location }));
    onDrop(draggedItem.uid ?? '');
    dispatch(dragItem(null));
  }

  return <div style={style} onClick={onClick} onMouseUp={onClick}></div>;
}
