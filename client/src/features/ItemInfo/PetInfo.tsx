import * as React from 'react';
import useTranslator from '../../hooks/translate';
import { getItemName } from '../../resources/Items';
import { IItem } from '../../slices/inventorySlice';
import { LineBreak } from './components/LineBreak';
import useObjectTranslator from '../../hooks/objectTranslate';
import { BaseInfo } from './components/BaseInfo';
import { SkillIcon } from '../../components/SkillIcon/SkillIcon';
import { CDNImage } from '../../components/Elements/Image';

export const PetInfo: React.FC<{ item: IItem }> = ({ item }) => {
  const objT = useObjectTranslator();
  const t = useTranslator();
  const { iid } = item;
  const props = item.props;
  const name = getItemName(iid);
  const level = item.props ? item.props.level || 0 : 0;

  return (
    <>
      <div style={{ color: 'teal' }}>
        {name} + {level}
      </div>
      <BaseInfo item={item}></BaseInfo>
      <LineBreak />

      <div>
        Aura:{' '}
        {(props?.skills?.aura ?? []).map((id: number) => (
          <CDNImage key={id} src={`icons/skills/${id}.png`} style={{ marginRight: 5 }} />
        ))}
      </div>

      <div>
        Aid:{' '}
        {(props?.skills?.active ?? []).map((id: number) => (
          <CDNImage key={id} src={`icons/skills/${id}.png`} style={{ marginRight: 5 }} />
        ))}
      </div>

      <div>
        Passive:{' '}
        {(props?.skills?.passive ?? []).map((id: number) => (
          <CDNImage key={id} src={`icons/skills/${id}.png`} style={{ marginRight: 5 }} />
        ))}
      </div>
    </>
  );
};
