import { useAppSelector } from '../../hooks';

interface Props {
  className?: string;
  zIndex?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function CenterContainer({ className = '', zIndex = 990, style, children }: Props) {
  // const bounds = useAppSelector((store) => store.ui.bounds);

  return (
    <div
      className={className}
      style={{
        ...style,
        position: 'absolute',
        zIndex,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}>
      {children}
    </div>
  );
}
