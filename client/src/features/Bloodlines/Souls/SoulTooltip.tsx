import { TooltipContainer } from '../../../components/Tooltips/TooltipContainer';
import useTranslator from '../../../hooks/translate';
import { SERVER_CONFIG } from '../../../util/serverConfig';
import { LineBreak } from '../../ItemInfo/components/LineBreak';
import { statValue } from '../utils';

export function SoulTooltip({ id, level }: { id: number; level: number }) {
  const t = useTranslator();

  const serverBloodlineConfigData = SERVER_CONFIG.BLOODLINE.Config;
  const serverSoulData = SERVER_CONFIG.BLOODLINE.Souls;

  return (
    <TooltipContainer offsetX={27} offsetY={-4}>
      <div style={{ width: 250 }}>
        {t(`soul__${id}`)} Lv. {level}
        <br />
        Required Level: {serverBloodlineConfigData.soulLevelLimits[level]} <br />
        {id === 0 ? null : (
          <>
            <LineBreak />
            {t(`stat__${serverSoulData[id]?.stat}`)}: {statValue(serverSoulData[id]?.stat, serverSoulData[id]?.levels[level])}
          </>
        )}
      </div>
    </TooltipContainer>
  );
}
