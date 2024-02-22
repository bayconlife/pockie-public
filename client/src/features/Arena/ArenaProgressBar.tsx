import * as React from 'react';
import { useAppSelector } from '../../hooks';
import { SERVER_CONFIG } from '../../util/serverConfig';
import useTranslator from '../../hooks/translate';
import { CDNImage } from '../../components/Elements/Image';

const ArenaProgressBar: React.FC<{}> = () => {
  const t = useTranslator();
  const rank = useAppSelector((state) => state.stats.stats.rank);
  const score = useAppSelector((state) => state.stats.stats.score);

  const expForCurrent = SERVER_CONFIG.RANKS?.[rank - 1] ?? 0;
  const expToNext = SERVER_CONFIG.RANKS?.[rank] ?? 9999999;
  const percentage = ((score - expForCurrent) / (expToNext - expForCurrent)) * 100;

  return (
    <div style={{ position: 'absolute', top: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 30 }}>
      <CDNImage src="ui/UIResource/Arena/ArenaTopBar/3.png" />
      <CDNImage
        src="ui/UIResource/Arena/ArenaTopBar/2.png"
        style={{ position: 'absolute', top: 7, left: 9, clipPath: `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)` }}
      />

      <span className="test-text" style={{ position: 'absolute', top: -15, left: 0 }}>
        Current Rank: {t(`rank__${rank}`)}
      </span>
      <span className="test-text" style={{ position: 'absolute', top: 35, left: '50%', transform: 'translateX(-50%)' }}>
        Rank Exp: {score / 100} / {expToNext / 100}
      </span>
      <span className="test-text" style={{ position: 'absolute', top: -15, right: 0 }}>
        Next Rank: {t(`rank__${rank + 1}`)}
      </span>
    </div>
  );
};

export default ArenaProgressBar;
