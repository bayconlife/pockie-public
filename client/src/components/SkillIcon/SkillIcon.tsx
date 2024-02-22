import { useState } from 'react';
import useObjectTranslator from '../../hooks/objectTranslate';
import { SkillTooltip } from '../Tooltips/SkillTooltip';
import { ImageWithSpinner } from '../ImageWithSpinner';

interface Props {
  id: number;
  hideHover?: boolean;
  style?: React.CSSProperties;
  onClick?: (e?: React.MouseEvent) => void;
}

export function SkillIcon({ id, hideHover = false, style, onClick }: Props) {
  const t = useObjectTranslator();
  const [hover, setHover] = useState(false);

  return (
    <>
      <ImageWithSpinner
        src={`icons/skills/${id}.png`}
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ ...style }}
      />
      {hover && !hideHover && <SkillTooltip id={id} text={t(`skill__${id}--tooltip`)} />}
    </>
  );
}
