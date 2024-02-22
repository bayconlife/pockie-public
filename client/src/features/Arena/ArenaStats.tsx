import { CDNImage } from '../../components/Elements/Image';
import { JTextField } from '../../components/UI/JTextField';
import { useAppSelector } from '../../hooks';
import useTranslator from '../../hooks/translate';

const ArenaStats: React.FC<{}> = () => {
  const userMedals = useAppSelector((state) => state.arena.medals);
  const userName = useAppSelector((state) => state.character.displayName);
  const userLevel = useAppSelector((state) => state.stats.stats.level);
  const userRanking = useAppSelector((state) => state.arena.userRanking);
  const userScore = useAppSelector((state) => state.stats.stats.score);
  const userRank = useAppSelector((state) => state.stats.stats.rank);
  const t = useTranslator();

  return (
    <>
      <div style={{ position: 'absolute', top: -70, zIndex: 99 }}>
        <CDNImage src="scenes/arena/arena-stats-bg1.png" style={{ position: 'absolute', top: 0, left: -15 }} />
        <CDNImage src="scenes/arena/arena-stats-bg2.png" style={{ position: 'absolute', top: 15, left: 40, zIndex: 10 }} />
        <CDNImage src="scenes/arena/arena-stats-bg3.png" style={{ position: 'absolute', top: 5, left: 15 }} />
        <span
          className="text-outline"
          style={{ position: 'absolute', top: 0, left: 12, color: 'aquamarine', fontSize: 30, zIndex: 11 }}>{`${userName}`}</span>
        <div style={{ position: 'absolute', top: 48, left: 12, zIndex: 11, width: 70, display: 'flex', justifyContent: 'space-evenly' }}>
          <span className="test-text">{`Lv:`}</span>
          <span style={{ color: 'white' }}>{userLevel}</span>
        </div>
        <div style={{ position: 'absolute', top: 48, left: 100, zIndex: 11, width: 70, display: 'flex', justifyContent: 'space-evenly' }}>
          <span className="test-text">{`Ranking: `}</span>
          <span style={{ color: 'white' }}>{userRanking}</span>
        </div>
        <div style={{ position: 'absolute', top: 48, left: 200, zIndex: 11, width: 70, display: 'flex', justifyContent: 'space-evenly' }}>
          <span className="test-text">{`Score: `}</span>
          <span style={{ color: 'white' }}>{userScore / 100}</span>
        </div>
        <div style={{ position: 'absolute', top: 48, left: 300, zIndex: 11, width: 70, display: 'flex', justifyContent: 'space-evenly' }}>
          <span className="test-text">{`Medals: `}</span>
          <span style={{ color: 'white' }}>{userMedals}</span>
        </div>
        <div style={{ position: 'absolute', top: 48, left: 400, zIndex: 11, width: 70, display: 'flex', justifyContent: 'space-evenly' }}>
          <span className="test-text">{`Combos: `}</span>
          <span style={{ color: 'white' }}>{0}</span>
        </div>
        <span className="test-text" style={{ position: 'absolute', top: 25, left: 200, zIndex: 11, width: 170, color: 'cyan' }}>
          {t(`rank__${userRank}`)}
        </span>
      </div>
    </>
  );
};

export default ArenaStats;
