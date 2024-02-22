import * as React from 'react';
import BigBG1 from '../../assets/UIResource/Common/BigBG1.png';
import BigBG2 from '../../assets/UIResource/Common/BigBG2.png';
import BigBG3 from '../../assets/UIResource/Common/BigBG3.png';
import BigBG4 from '../../assets/UIResource/Common/BigBG4.png';
import { JLayout } from './JLayout';

interface Props {
  size?: {
    width: string | number;
    height: string | number;
  };
  position?: {
    x: number;
    y: number;
  };
  background?: string;
  style?: React.CSSProperties;
  className?: string;
  childrenStyle?: React.CSSProperties;
  padding?: number;
  layout?: React.ReactElement<typeof JLayout>;
  /** reference for size.width */
  width?: number;
  /** reference for size.height */
  height?: number;
  /** reference for position.x */
  x?: number;
  /** reference for position.y */
  y?: number;
  onClick?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  divRef?: React.RefObject<HTMLDivElement>;
}

export const border: { [key: string]: number } = {
  'UIResource.Achievement.AchievementBG4': 30,
  'UIResource.Common.BigBG1': 24,
  'UIResource.Common.BigBG2': 24,
  'UIResource.Common.BigBG3': 5,
  'UIResource.Common.BigBG4': 5,
  'UIResource.Common.BigBG5': 5,
  'UIResource.Common.BigBG6': 5,
  'UIResource.Common.BigBG7': 5,
  'UIResource.Common.EspecialBG8': 3,
  'UIResource.Common.SmallBG1': 5,
  'UIResource.Common.SmallBG2': 5,
  'UIResource.Common.TextBG1': 3,
  'UIResource.Common.TextBG2': 5,
  'UIResource.Equip.EquipBG': 5,
  'UIResource.OutSearch.StarBG': 10,
  'UIResource.SkillTree.BG': 2,
  'UIResource.SkillTree.TextBG': 1,
  'UIResource.Icon.Grid_Base1': 10,
  'UIResource.Icon.Grid_YellowBSD': 3,
};

export const bakedImages: { [key: string]: string } = {
  'UIResource.Common.BigBG1': BigBG1,
  'UIResource.Common.BigBG2': BigBG2,
  'UIResource.Common.BigBG3': BigBG3,
};

const JPanel: React.FC<Props> = ({
  size = { width: '', height: '' },
  position,
  background,
  children,
  style,
  className = '',
  childrenStyle,
  padding = 0,
  layout,
  width,
  height,
  x,
  y,
  onClick,
  onContextMenu,
  divRef,
}) => {
  const backupRef = React.useRef<HTMLDivElement>(null);
  const [initialLoad, setInitialLoad] = React.useState(false);
  const ref = divRef ?? backupRef;

  if (width) {
    size.width = width;
  }

  if (height) {
    size.height = height;
  }

  if (x || y) {
    position = { x: 0, y: 0 };

    if (x) {
      position.x = x;
    }

    if (y) {
      position.y = y;
    }
  }

  let parentStyle: React.CSSProperties = {
    width: size.width,
    height: size.height,
    position: 'relative',
    ...style,
  };

  let imageStyle: React.CSSProperties = {
    width: size.width,
    height: size.height,
  };

  if (background) {
    const url =
      background in bakedImages ? bakedImages[background] : `${process.env.REACT_APP_CDN_PATH}ui/${background.replaceAll('.', '/')}.png`;

    if (background in border) {
      const borderWidth = background in border ? border[background] : '5px';

      imageStyle = {
        width: size.width,
        height: size.height,
        // borderStyle: 'solid',
        borderImageWidth: `${borderWidth}px ${borderWidth}px ${borderWidth}px ${borderWidth}px`,
        borderImageRepeat: 'stretch stretch',
        borderImageOutset: '0px 0px 0px 0px',
        borderImageSlice: `${borderWidth} ${borderWidth} ${borderWidth} ${borderWidth} fill`,
        borderImageSource: `url(${url})`,
      };
    } else {
      imageStyle = {
        ...imageStyle,
        backgroundImage: `url(${url})`,
      };
    }
  }

  if (position) {
    parentStyle = {
      ...parentStyle,
      position: 'absolute',
      top: position.y,
      left: position.x,
    };
  }

  if (typeof size.width === 'number') {
    childrenStyle = {
      width: size.width - padding * 2,
      ...childrenStyle,
    };
  } else {
    if (ref.current) {
      imageStyle = {
        ...imageStyle,
        width: ref.current.clientWidth + padding * 2,
      };

      parentStyle = {
        ...parentStyle,
        width: ref.current.clientWidth + padding * 2,
      };
    }
  }

  if (typeof size.height === 'number') {
    childrenStyle = {
      height: size.height - padding * 2,
      ...childrenStyle,
    };
  } else {
    if (ref.current) {
      imageStyle = {
        ...imageStyle,
        height: ref.current.clientHeight + padding * 2,
      };

      parentStyle = {
        ...parentStyle,
        height: ref.current.clientHeight + padding * 2,
      };
    }
  }

  React.useEffect(() => {
    if (ref.current && (typeof size.height === 'string' || typeof size.width === 'string')) {
      setInitialLoad(true); // Hacky way to reload the component if we are trying to do auto size measurements, might be better to do dom manip
    }
  }, []);

  return (
    <div className={`${className} j-panel`} style={parentStyle} onClick={onClick} onContextMenu={onContextMenu}>
      <div style={{ position: 'absolute', top: 0, left: 0, ...imageStyle }}></div>
      <div
        ref={ref}
        style={{
          position: 'absolute',
          top: padding,
          left: padding,
          ...childrenStyle,
        }}>
        {/* 
        // @ts-ignore */}
        {layout !== undefined ? React.cloneElement(layout, { children: children }) : children}
      </div>
    </div>
  );
};

export default JPanel;
