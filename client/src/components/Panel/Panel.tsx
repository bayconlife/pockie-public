import './Panel.css';
import * as React from 'react';
import { useAppSelector } from '../../hooks';
import { next, release } from '../../util/windowStack';
import CloseButton from '../Buttons/CloseButton';
import { NineSlice } from '../NineSlice';
import { MinimizeButton } from '../Buttons/MinimizeButton';
import TextBG2 from '../../assets/UIResource/Common/TextBG2.png';

interface Props {
  onClose?: () => void;
  name?: string;
  minimizable?: boolean;
  moveable?: boolean;
  style?: React.CSSProperties;
}

const Panel: React.FC<Props> = ({ onClose, name, children, minimizable = false, moveable = true, style }) => {
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const topRef = React.useRef<HTMLDivElement | null>(null);
  const pos = React.useRef<{ x: number; y: number }>(
    (() => {
      if (name && moveable) {
        return JSON.parse(localStorage.getItem(`panel-${name}`) || '{ "x": -2000, "y": -2000 }');
      } else {
        return { x: -2000, y: -2000 };
      }
    })()
  );
  const zRelease = React.useRef(-1);

  const bounds = useAppSelector((state) => state.ui.bounds);

  const [isMinimized, setIsMinimized] = React.useState(false);
  const [zIndex, setZIndex] = React.useState(-1);

  React.useEffect(() => {
    setZIndex(next());

    return () => {
      localStorage.setItem(`panel-${name}`, JSON.stringify(pos.current));
      release(zRelease.current);
    };
  }, []);

  React.useEffect(() => {
    zRelease.current = zIndex;
  }, [zIndex]);

  React.useEffect(() => {
    if (!moveable) return;
    if (topRef === null || topRef.current === null) return;
    if (panelRef === null || panelRef.current === null) return;

    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    topRef.current.onmousedown = (e) => {
      e.preventDefault();

      pos3 = e.clientX;
      pos4 = e.clientY;

      const maxWidth = bounds[0] + bounds[2] - (panelRef.current?.clientWidth || 0) - 5;
      const maxHeight = bounds[1] + bounds[3] - (panelRef.current?.clientHeight || 0) - 26;

      document.onmouseup = () => {
        document.onmouseup = null;
        document.onmousemove = null;
      };

      document.onmousemove = (e) => {
        e.preventDefault();

        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        const y = Math.min(maxHeight, Math.max(bounds[1], panelRef.current!.offsetTop - pos2));
        const x = Math.min(maxWidth, Math.max(bounds[0], panelRef.current!.offsetLeft - pos1));

        panelRef.current!.style.top = y + 'px';
        panelRef.current!.style.left = x + 'px';

        pos.current = { x, y };
      };
    };

    topRef.current.ontouchstart = (e) => {
      e.preventDefault();

      pos3 = e.targetTouches[0].clientX;
      pos4 = e.targetTouches[0].clientY;

      const maxWidth = bounds[0] + bounds[2] - (panelRef.current?.clientWidth || 0) - 5;
      const maxHeight = bounds[1] + bounds[3] - (panelRef.current?.clientHeight || 0) - 26;

      document.ontouchend = () => {
        document.ontouchstart = null;
        document.ontouchmove = null;
      };

      document.ontouchcancel = () => {
        document.ontouchstart = null;
        document.ontouchmove = null;
      };

      document.ontouchmove = (e) => {
        e.preventDefault();

        pos1 = pos3 - e.targetTouches[0].clientX;
        pos2 = pos4 - e.targetTouches[0].clientY;
        pos3 = e.targetTouches[0].clientX;
        pos4 = e.targetTouches[0].clientY;

        const y = Math.min(maxHeight, Math.max(bounds[1], panelRef.current!.offsetTop - pos2));
        const x = Math.min(maxWidth, Math.max(bounds[0], panelRef.current!.offsetLeft - pos1));

        panelRef.current!.style.top = y + 'px';
        panelRef.current!.style.left = x + 'px';

        pos.current = { x, y };
      };
    };

    return () => {
      document.onmouseup = null;
      document.onmousemove = null;
    };
  }, [panelRef, topRef, bounds, moveable]);

  const onClick = React.useCallback((e) => {
    e.stopPropagation();
    release(zIndex);
    setZIndex(next());
  }, []);
  const _onMinimize = React.useCallback(() => setIsMinimized(!isMinimized), [isMinimized]);
  const onMouseDown = React.useCallback((e) => e.stopPropagation(), []);
  const onMouseUp = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();

    if (document.onmouseup !== null) {
      localStorage.setItem(`panel-${name}`, JSON.stringify(pos.current));
    }

    document.onmouseup = null;
    document.onmousemove = null;
  }, []);

  const paddingTop = minimizable && isMinimized ? 0 : 5;
  const paddingBottom = minimizable && isMinimized ? 0 : 2;

  let _top = -2000;
  let _left = bounds[0] + bounds[2] / 2;

  if (panelRef.current) {
    _top = bounds[1] + bounds[3] / 2 - (panelRef.current.getBoundingClientRect().height || 0) / 2;
    _left -= (panelRef.current?.getBoundingClientRect().width || 0) / 2;
  }

  if (pos.current.y !== -2000) {
    _top = pos.current.y;
  }

  if (pos.current.x !== -2000) {
    _left = pos.current.x;
  }

  if (_left + (panelRef.current?.clientWidth ?? 0) + 10 > document.body.clientWidth) {
    _left = document.body.clientWidth - (panelRef.current?.clientWidth ?? 0) - 10;
  }

  if (_top + (panelRef.current?.clientHeight ?? 0) + 26 > document.body.clientHeight) {
    _top = document.body.clientHeight - (panelRef.current?.clientHeight ?? 0) - 26;
  }

  if (_top < 0) {
    _top = 26;
  }

  return (
    <div
      className="panel"
      ref={panelRef}
      style={{
        position: 'fixed',
        top: _top,
        left: _left,
        paddingTop,
        paddingBottom,
        zIndex,
        ...style,
      }}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}>
      <div ref={topRef} className={`panel__top_bar ${moveable ? 'moveable' : ''}`}>
        {name && (
          <span className="panel__nameplate grid--overlap">
            <NineSlice className="panel__nameplate_background" url={TextBG2} slice={[10, 10]} />
            <b className="panel__name">{name}</b>
          </span>
        )}

        {onClose !== undefined && <CloseButton className="panel__close_btn" onClick={onClose} />}
        {minimizable && <MinimizeButton className="panel__minimize_btn" onClick={_onMinimize} />}
      </div>
      {minimizable && isMinimized ? null : children}
    </div>
  );
};

export default Panel;
