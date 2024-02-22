import { preventClicks } from '../../util/mouse';
import { CDNImage } from '../Elements/Image';
import './ImageButton.css';
import * as React from 'react';

interface Props {
  onClick: () => void;
  defaultImage: string;
  className?: string;
  style?: React.CSSProperties;
  imageStyle?: React.CSSProperties;
  disabled?: boolean;
  noCDN?: boolean;
}

enum State {
  DEFAULT = 'default',
  HOVER = 'hover',
  PRESSED = 'pressed',
  DISABLED = 'disabled',
}

const ImageButton: React.FC<Props> = ({
  onClick,
  defaultImage,
  className,
  style,
  imageStyle,
  disabled = false,
  children,
  noCDN = false,
}) => {
  const [state, setState] = React.useState(disabled ? State.DISABLED : State.DEFAULT);

  React.useEffect(() => {
    if (disabled && state !== State.DISABLED) {
      setState(State.DISABLED);
    }
  }, [state]);

  React.useEffect(() => {
    setState(disabled ? State.DISABLED : State.DEFAULT);
  }, [disabled]);

  function updateState(e: React.MouseEvent, newState: State) {
    preventClicks(e);

    if (!disabled) {
      setState(newState);
    }
  }

  return (
    <button
      className={`image_button --${state} ${className}`}
      style={{ cursor: disabled ? 'not-allowed' : 'pointer', ...style }}
      onClick={disabled ? () => {} : onClick}
      onMouseOver={(e) => updateState(e, State.HOVER)}
      onMouseLeave={(e) => updateState(e, State.DEFAULT)}
      onMouseDown={(e) => updateState(e, State.PRESSED)}
      onMouseUp={(e) => updateState(e, State.HOVER)}>
      {!noCDN && defaultImage !== '' && <CDNImage src={defaultImage} style={{ ...imageStyle }} />}
      {noCDN && defaultImage !== '' && <img src={defaultImage} style={{ ...imageStyle }} />}
      {children}
    </button>
  );
};

export default ImageButton;
