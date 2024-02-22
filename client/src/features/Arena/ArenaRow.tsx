import * as React from 'react';

import ArenaCard from './ArenaCard';
import { CDNImage } from '../../components/Elements/Image';
import ArenaMask from '../../assets/arena/_mask.png';

interface Props {
  backgroundImage: string;
  onClick: (id: string) => void;
  style?: any;
  row: { id: string; level: number; avatar: number; name?: string; win: boolean }[];
  cardRow: number;
}

const offset = [2, -1, -1, -1, -1, -1];

const ArenaRow: React.FC<Props> = ({ backgroundImage, onClick, style, row, cardRow }) => {
  return (
    <div style={{ position: 'relative', ...style }}>
      <CDNImage src={backgroundImage} style={{ filter: 'drop-shadow(0px 0px 5px rgba(0, 0, 0, 255))' }} />
      <div style={{ position: 'absolute', top: 3, left: 92 }}>
        <CDNImage src="scenes/arena/row.png" />
        <div style={{ display: 'flex', position: 'absolute', top: 0, left: 0 }}>
          {Object.values(row).map((el, index) => {
            return (
              <div key={index}>
                <CDNImage
                  className={el.win === true ? 'arena-fighter defeated' : 'arena-fighter'}
                  src={`scenes/arena/avatars/${el.avatar}.jpg`}
                  style={{
                    WebkitMaskImage: `url(${ArenaMask})`,
                    WebkitMaskRepeat: 'no-repeat',
                    marginLeft: `${offset[index]}px`,
                  }}
                  onClick={() => onClick(el.id)}
                />

                <p style={{ position: 'relative', top: -23, left: 5, fontSize: 12, color: 'white' }}>LV {el.level}</p>
              </div>
            );
          })}
        </div>
      </div>

      <ArenaCard row={row} cardRow={cardRow} />
      <CDNImage
        className="drop-shadow"
        src="ui/UIResource/Arena/ArenaFighter/Deco_Top.png"
        style={{ position: 'absolute', top: -8, left: 71, pointerEvents: 'none' }}
      />
      <CDNImage
        className="drop-shadow"
        src="ui/UIResource/Arena/ArenaFighter/Deco_Bottom.png"
        style={{ position: 'absolute', bottom: 5, left: 48, pointerEvents: 'none' }}
      />
    </div>
  );
};

export default ArenaRow;
