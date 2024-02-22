import { TooltipContainer } from './TooltipContainer';
import { useAppSelector } from '../../hooks';

interface Props {
  text: string[];
  width?: number;
  offsetX?: number;
  offsetY?: number;
  children?: React.ReactNode;
}

export function Tooltip({ text, width = 250, offsetX = 0, offsetY = 0, children }: Props) {
  const stats = useAppSelector((state) => state.stats.stats);

  const lines = text.map((line, idx) => {
    if (line === '[break]') {
      return <div key={idx} className="tooltip-break" />;
    }

    return <div key={idx}>{line}</div>;
  });

  return (
    <TooltipContainer offsetX={offsetX} offsetY={offsetY}>
      <div style={{ width }}>{lines}</div>
      {children}
    </TooltipContainer>
  );
}
