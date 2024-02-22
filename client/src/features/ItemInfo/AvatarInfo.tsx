import * as React from 'react';
import useTranslator from '../../hooks/translate';
import { getItemName, getItemValue } from '../../resources/Items';
import { IItem } from '../../slices/inventorySlice';
import { LineBreak } from './components/LineBreak';
import useObjectTranslator from '../../hooks/objectTranslate';

export const AvatarInfo: React.FC<{ item: IItem }> = ({ item }) => {
  const objT = useObjectTranslator();
  const t = useTranslator();
  const { iid } = item;
  const props = item.props ?? { isv: [0, 0, 0] };
  const name = getItemName(iid);
  const level = item.props ? item.props.level || 0 : 0;

  const str = Math.floor(20 * props.isv[0] + 8 * props.isv[0] * level + props.isv[0] * level);
  const agi = Math.floor(20 * props.isv[1] + 8 * props.isv[1] * level + props.isv[1] * level);
  const sta = Math.floor(20 * props.isv[2] + 8 * props.isv[2] * level + props.isv[2] * level);

  return (
    <>
      <div style={{ color: 'teal' }}>
        {name} + {level}
      </div>
      <div style={{ color: 'whitesmoke' }}>
        {/* <div>Gender</div> */}
        {/* <div>Outfit</div>
        <div>Weapon Type: Any</div> */}
        <LineBreak />
        <div style={{ position: 'relative' }}>
          Required Level <span style={{ position: 'absolute', right: 0 }}>1</span>
        </div>
        <LineBreak />
        <div style={{ position: 'relative' }}>
          Synthesis Value <span style={{ position: 'absolute', right: 0 }}>{getItemValue(item)}</span>
        </div>
        <LineBreak />
        <div style={{ position: 'relative' }}>
          Strength{' '}
          <span style={{ position: 'absolute', right: 0 }}>
            {str} (+{props.isv[0]})
          </span>
        </div>
        <div style={{ position: 'relative' }}>
          Agility{' '}
          <span style={{ position: 'absolute', right: 0 }}>
            {agi} (+{props.isv[1]})
          </span>
        </div>
        <div style={{ position: 'relative' }}>
          Stamina{' '}
          <span style={{ position: 'absolute', right: 0 }}>
            {sta} (+{props.isv[2]})
          </span>
        </div>
        <LineBreak />
        <div>{t('tooltip__outfit--str-description').replace('${}', props.bmv[0])}</div>
        <div>Every {props.bmv[1]} points of Agililty increases speed by 1% and dodge by 1 point</div>
        <div>Every {props.bmv[2]} points of Stamina increases health and chakra by 1%</div>
        <LineBreak />
        {props.skills
          .filter((id: number) => ![7777].includes(id))
          .map((id: number) => (
            <div key={`skill-info-${id}`} style={{ color: 'skyblue', marginBottom: 5 }}>
              {objT(`outfit_skill__${id}`).map((line, idx) => (
                <div key={`skill-info-${id}-line-${idx}`}>{line}</div>
              ))}
            </div>
          ))}
      </div>
    </>
  );
};
