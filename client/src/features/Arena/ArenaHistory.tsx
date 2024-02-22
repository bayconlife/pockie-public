import { CDNImage } from '../../components/Elements/Image';
import { JScrollPane } from '../../components/UI/JScollPane';
import { useAppSelector } from '../../hooks';
import useTranslator from '../../hooks/translate';

const ArenaHistory: React.FC<{}> = () => {
  const t = useTranslator();
  const arenaHistory = useAppSelector((state) => state.arena.history);
  const history = [...arenaHistory].reverse();

  return (
    <>
      <CDNImage src="scenes/arena/info-background.png" style={{ zIndex: 0 }} />

      <JScrollPane className="arena-history" size={{ width: 440, height: 140 }} position={{ x: 200, y: 40 }}>
        {history.map(([name, score, medals], id) => {
          score = score / 100;

          if (medals !== 0) {
            return (
              <p key={id + Date.now()}>
                You challenged <span className="name">{t(name)}</span> and {medals > 0 ? 'won' : 'lost'}! Score increased: +{score},
                obtained {Math.abs(medals)} medals.
              </p>
            );
          } else {
            if (score > 0) {
              return (
                <p key={id + Date.now()}>
                  <span className="name">{t(name)}</span> challenged you and lost! Score increased: +{score}.
                </p>
              );
            } else {
              return (
                <p key={id + Date.now()}>
                  <span className="name">{t(name)}</span> challenged you and won! Score decreased: {score}.
                </p>
              );
            }
          }
        })}
      </JScrollPane>
    </>
  );
};

export default ArenaHistory;
