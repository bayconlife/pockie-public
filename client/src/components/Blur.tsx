import { useAppSelector } from '../hooks';

export function Blur() {
  const bounds = useAppSelector((store) => store.ui.bounds);

  function preventClicks(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <div
      style={{
        height: bounds[3],
        width: bounds[2],
        position: 'absolute',
        inset: 0,
        marginLeft: 'auto',
        marginRight: 'auto',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
      }}
      onMouseEnter={(e) => preventClicks(e)}
      onMouseLeave={(e) => preventClicks(e)}
      onMouseDown={(e) => preventClicks(e)}
      onMouseUp={(e) => preventClicks(e)}
    />
  );
}
