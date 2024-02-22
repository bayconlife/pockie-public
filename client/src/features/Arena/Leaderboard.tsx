import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setRankings } from '../../slices/arenaSlice';
import { MultilineLabel } from '../../components/UI/MultilineLabel';
import { CDNImage } from '../../components/Elements/Image';
import { toServer } from '../../util/ServerSocket';

const Leaderboard: React.FC<{}> = () => {
  const dispatch = useAppDispatch();
  const leaderboard = useAppSelector((state) => state.arena.leaderboard);
  const userRanking = useAppSelector((state) => state.arena.userRanking);
  const displayName = useAppSelector((state) => state.character.displayName);
  const serverId = useAppSelector((state) => state.account.serverId);

  React.useEffect(() => {
    toServer('updateLeaderboard', null, (cs: any) => {
      dispatch(setRankings(cs));
    });
  }, []);

  return (
    <>
      <div style={{ position: 'absolute', right: 10, top: 100, zIndex: 900 }}>
        <CDNImage src="ui/UIResource/Arena/Top_BG.png" />
        {leaderboard.map((x, idx) => (
          <React.Fragment key={'row-info-' + idx}>
            <MultilineLabel
              size={{ width: 90, height: 23 }}
              text={''}
              position={{ x: 35, y: 45 + 9 + idx * 21.7 }}
              className="arena__leaderboard-row">
              <div
                style={{
                  cursor: 'pointer',
                  textDecoration: formatName(x[0]) === `Bot-${x[0]}` ? '' : 'underline',
                  overflowY: 'hidden',
                  textOverflow: 'ellipsis',
                  fontSize: 15,
                  fontWeight: 'bold',
                }}
                onClick={() => {
                  if (formatName(x[0]) !== `Bot-${x[0]}`) {
                    toServer('viewCharacter', { serverId, accountId: x[0].substring(0, x[0].indexOf('-')) });
                  }
                }}>
                {formatName(x[0])}
              </div>
            </MultilineLabel>
            <MultilineLabel
              size={{ width: 54, height: 20 }}
              text={'' + Math.floor(Number(x[1]) / 100)}
              position={{ x: 100, y: 45 + 9 + idx * 21.7 }}
              style={{ fontSize: 15, color: '#33DBFF', textAlign: 'right' }}
              title={'' + Number(x[1]) / 100}
            />
          </React.Fragment>
        ))}
        <div style={{ display: 'flex', width: 40, flexDirection: 'row', gap: 2, position: 'absolute', top: 230, left: 20 }}>
          {userRanking === null ? (
            <b style={{ position: 'relative', top: -3 }}>-</b>
          ) : (
            Array.from('' + userRanking).map((n, idx) => <CDNImage key={idx} src={`ui/UIResource/Arena/Top_${n}.png`} />)
          )}
        </div>
        <MultilineLabel
          size={{ width: 90, height: 23 }}
          position={{ x: 60, y: 225 }}
          text={displayName}
          style={{
            display: 'flex',
            justifyContent: 'right',
            fontSize: 18,
            fontWeight: 'bold',
          }}
          className="arena__leaderboard-name"
        />
      </div>
    </>
  );
};

function formatName(name: string) {
  if (!name.includes('-')) {
    return `Bot-${name}`;
  }

  return name.substring(name.indexOf('-') + 1);
}

export default Leaderboard;
