import { Position, Size } from '../interfaces/Interfaces';
import JPanel from '../UI/JPanel';

interface GridProps {
  size: Size;
  position?: Position;
  children?: React.ReactNode;
  selected?: boolean;
  /** reference for position.x */
  x?: number;
  /** reference for position.y */
  y?: number;
  onClick?: () => void;
}

export function DisplayGrid({ size, position, children, selected, x, y, onClick }: GridProps) {
  return (
    <JPanel
      size={{ width: size.width * 27 + 10, height: size.height * 27 + 10 }}
      position={position}
      x={x}
      y={y}
      background="UIResource.Common.BigBG5"
      padding={5}
      onClick={onClick}>
      <JPanel size={{ width: size.width * 27, height: size.height * 27 }} childrenStyle={{ display: 'flex' }}>
        {Array.apply(null, Array(size.width * size.height)).map((_, idx) => (
          <JPanel
            key={idx}
            size={{ width: 26, height: 26 }}
            position={{ x: (idx % size.width) * 27, y: Math.floor(idx / size.width) * 27 }}
            background="UIResource.Icon.Grid_YellowBSD"
          />
        ))}
        <JPanel className="panel-child" size={{ width: size.width * 27, height: size.height * 27 }} padding={1}>
          {children}
        </JPanel>
        {selected && <div className="grid-overlay selected" />}
      </JPanel>
    </JPanel>
  );
}
