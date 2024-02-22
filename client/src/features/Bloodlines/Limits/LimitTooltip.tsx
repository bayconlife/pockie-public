import { Fragment } from 'react';
import { TooltipContainer } from '../../../components/Tooltips/TooltipContainer';
import useTranslator from '../../../hooks/translate';
import { SERVER_CONFIG } from '../../../util/serverConfig';
import { LineBreak } from '../../ItemInfo/components/LineBreak';
import { statValue } from '../utils';

export function LimitTooltip({ id }: { id: number }) {
  const t = useTranslator();

  const serverLimitData = SERVER_CONFIG.BLOODLINE.Limits;

  return (
    <TooltipContainer offsetX={27} offsetY={-4}>
      <div style={{ width: 250 }}>
        {t(`limit__${id}`)}
        <br />
        Required Level: {serverLimitData[id]?.level}
        <LineBreak />
        Str: {serverLimitData[id]?.stats[0]} <br />
        Agi: {serverLimitData[id]?.stats[1]} <br />
        Sta: {serverLimitData[id]?.stats[2]} <br />
        <LineBreak />
        {serverLimitData[id]?.bonus.map((row: [number, number], idx: number) => (
          <Fragment key={idx}>
            <span>
              {t(`stat__${row[0]}`)}: {statValue(row[0], row[1])}
            </span>
            <br />
          </Fragment>
        ))}
      </div>
    </TooltipContainer>
  );
}
