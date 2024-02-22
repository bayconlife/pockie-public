import ImageButton from './ImageButton';
import DefaultImage from '../../assets/UILookAndFeel/Default/minimize.png';

export function MinimizeButton({ onClick, className, style }: { onClick: () => void; className?: string; style?: any }) {
  return (
    <ImageButton className={className} onClick={onClick} defaultImage={''} style={style}>
      <img src={DefaultImage} />
    </ImageButton>
  );
}
