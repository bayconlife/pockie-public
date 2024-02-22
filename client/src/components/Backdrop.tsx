import { useAppSelector } from '../hooks';

export function Backdrop() {
  const bounds = useAppSelector((store) => store.ui.bounds);

  function preventClicks(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <div
      style={{
        backgroundBlendMode: 'multiply',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        height: bounds[3],
        width: bounds[2],
        position: 'fixed',
        top: bounds[1],
        left: bounds[0],
        zIndex: 980,
      }}
      onMouseEnter={(e) => preventClicks(e)}
      onMouseLeave={(e) => preventClicks(e)}
      onMouseDown={(e) => preventClicks(e)}
      onMouseUp={(e) => preventClicks(e)}
    />
  );
}
