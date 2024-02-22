import './JButton.scss';
import * as React from 'react';
import useTranslator from '../../hooks/translate';
import { Position, Size } from '../interfaces/Interfaces';
import { NineSlice } from '../NineSlice';
import { Spinner } from '../Spinner';
import { CenterContainer } from '../CenterContainer/CenterContainer';
import DefaultButton from '../../assets/UILookAndFeel/Default/button.png';

enum State {
  DEFAULT = 'default',
  HOVER = 'hover',
  PRESSED = 'pressed',
  DISABLED = 'disabled',
}

interface Props {
  size?: Size;
  position?: Position;
  style?: React.CSSProperties;
  text?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  /** reference for position.x */
  x?: number;
  /** reference for position.y */
  y?: number;
}

export const JButton: React.FC<Props> = ({
  size = { width: 75, height: 25 },
  position,
  style,
  text = 'JButton',
  onClick,
  disabled = false,
  loading = false,
  children,
  className = '',
  x,
  y,
}) => {
  const t = useTranslator();
  const [state, setState] = React.useState(disabled ? State.DISABLED : State.DEFAULT);

  React.useEffect(() => {
    if (disabled && state !== State.DISABLED) {
      setState(State.DISABLED);
    }
  }, [state]);

  React.useEffect(() => {
    setState(disabled ? State.DISABLED : State.DEFAULT);
  }, [disabled]);

  if (x || y) {
    position = { x: 0, y: 0 };
    if (x) {
      position.x = x;
    }

    if (y) {
      position.y = y;
    }
  }

  let _style: React.CSSProperties = {
    ...style,
    width: size.width,
    height: size.height,
  };

  if (position) {
    _style = {
      ..._style,
      position: 'absolute',
      top: position.y,
      left: position.x,
    };
  }

  function updateState(e: React.MouseEvent, newState: State) {
    e.preventDefault();
    e.stopPropagation();

    setState(newState);
  }

  return (
    <div className={`button jbutton --${state} ${className}`} style={_style}>
      <NineSlice className={`button__background`} url={DefaultButton} slice={[5, 5]} />
      <button
        className="button__button text-shadow"
        onClick={
          disabled
            ? () => {}
            : (e) => {
                e.preventDefault();
                e.stopPropagation();

                onClick?.();
              }
        }
        onMouseEnter={(e) => updateState(e, State.HOVER)}
        onMouseLeave={(e) => updateState(e, State.DEFAULT)}
        onMouseDown={(e) => updateState(e, State.PRESSED)}
        onMouseUp={(e) => updateState(e, State.HOVER)}
        style={{ width: size.width, height: size.height }}
        disabled={state === State.DISABLED}>
        {loading ? (
          <CenterContainer>
            <Spinner width={12} />
          </CenterContainer>
        ) : (
          text
        )}
      </button>
      {children}
    </div>
  );
};
