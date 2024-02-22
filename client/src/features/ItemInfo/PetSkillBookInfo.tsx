import useObjectTranslator from '../../hooks/objectTranslate';
import { IItem } from '../../slices/inventorySlice';
import { BaseInfo } from './components/BaseInfo';
import { LineBreak } from './components/LineBreak';

interface Props {
  item: IItem;
}

export function PetSkillBookInfo({ item }: Props) {
  const t = useObjectTranslator();

  const lines = t(`skill__${item.props?.petSkill}--tooltip`).map((line, idx) => {
    if (line === '[break]') {
      return <div key={idx} className="tooltip-break" />;
    }

    return <div key={idx}>{line}</div>;
  });

  return (
    <div style={{ color: 'whitesmoke' }}>
      <BaseInfo item={item} />
      <LineBreak />
      {lines}
      <LineBreak />
      <div style={{ position: 'relative' }}>
        <div style={{ color: '#5df9ff' }}>Use from inventory to add a skill to a pet you own.</div>
      </div>
    </div>
  );
}
