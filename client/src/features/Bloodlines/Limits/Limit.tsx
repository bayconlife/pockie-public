import { Fragment, useState } from 'react';
import { JImage } from '../../../components/UI/JImage';
import useTranslator from '../../../hooks/translate';
import { SERVER_CONFIG } from '../../../util/serverConfig';
import { TooltipContainer } from '../../../components/Tooltips/TooltipContainer';
import { LineBreak } from '../../ItemInfo/components/LineBreak';
import { statValue } from '../utils';
import { LimitTooltip } from './LimitTooltip';

export function Limit({ id, disabled = false }: { id: number; disabled?: boolean }) {
  const [isContextMenuShowing, setIsContextMenuShowing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      onMouseLeave={() => {
        setIsContextMenuShowing(false);
        setIsHovering(false);
      }}
      onMouseEnter={() => setIsHovering(true)}>
      <JImage className={disabled ? 'gray' : 'clickable'} src={`icons/bloodlines/limits/${id}.png`} />
      {!isContextMenuShowing && isHovering && <LimitTooltip id={id} />}
    </div>
  );
}
