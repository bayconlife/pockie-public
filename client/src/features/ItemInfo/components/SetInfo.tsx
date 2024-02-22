import { useAppSelector } from '../../../hooks';
import useTranslator from '../../../hooks/translate';
import { SERVER_CONFIG } from '../../../util/serverConfig';

const MULTIPLIERS = [30];

export function SetInfo({ setId }: { setId: number }) {
  const t = useTranslator();
  const amount = useAppSelector((state) => state.stats.stats.sets?.[setId] ?? 0);

  const setInfo = SERVER_CONFIG.SETS[setId];

  if (setInfo === undefined || setInfo === null) {
    return null;
  }

  return (
    <>
      <div>
        {t(`set__${setId}`)} ({amount}/{setInfo.total})
      </div>
      {Object.keys(setInfo.bonus).map((needed) => (
        <div key={`set-${setId}-${needed}`} className={amount >= parseInt(needed, 10) ? 'set-active' : ''} style={{ position: 'relative' }}>
          {needed}: {t(`stat__${setInfo.bonus[needed][0]}`)}
          <span style={{ position: 'absolute', right: 0 }}>+{format(setInfo.bonus[needed])}</span>
        </div>
      ))}
    </>
  );
}

function format(line: any) {
  if (MULTIPLIERS.includes(line[0])) {
    return (line[1] / 10).toFixed(1);
  }

  return line[1];
}
