import useTranslator from '../../hooks/translate';
import { setServerId } from '../../slices/accountSlice';
import { useState } from 'react';
import { useAppDispatch } from '../../hooks';
import { Spinner } from '../../components/Spinner';
import { CenterContainer } from '../../components/CenterContainer/CenterContainer';
import { postData } from '../../util/fetch';
import { switchState } from '../../slices/stateSlice';
import { SiteState } from '../../enums';

enum LOADING_STATE {
  UNLOADED,
  PENDING,
  LOADED,
}

export function ServerSelect({ jwt, servers, valid }: { jwt: string; servers: number[]; valid: number[] }) {
  const t = useTranslator();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(LOADING_STATE.UNLOADED);

  // useEffect(() => {
  //   fromServer('error', (msg) => {
  //     console.error(msg);
  //   });

  //   return () => {
  //     cancelFromServer('error');
  //   };
  // }, []);

  // useEffect(() => {
  //   if (loading === LOADING_STATE.LOADED) {
  //     toServer('sceneGoToCurrent');
  //   }
  // }, [loading]);

  function selectServer(server: number) {
    if (loading !== LOADING_STATE.UNLOADED) {
      return;
    }

    setLoading(LOADING_STATE.PENDING);
    postData(`${process.env.REACT_APP_API_URL}/selectServer`, { jwt, server }).then((data) => {
      localStorage.setItem('jwt', data.jwt);
      dispatch(setServerId(server));
      dispatch(switchState(SiteState.GAME_LOADER));
    });
  }

  return (
    <div className="login__container">
      <div className="blur" />
      <div className="server__modal" style={{ display: 'grid', gap: 5 }}>
        <div style={{ flex: '0 0 100%', background: '#5B96C2', color: 'black', borderRadius: 4 }}>
          <div style={{ padding: 5, fontSize: '1rem' }}>Select a server</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5 }}>
          {servers.sort().map((server) => (
            <div
              key={`server-${server}`}
              style={{
                width: 200,
                padding: 15,
                background: '#86BBD8',
                color: 'black',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                cursor: valid.includes(server) ? 'pointer' : 'not-allowed',
                borderRadius: 10,
                flexBasis: '33.33333',
                position: 'relative',
              }}
              title={valid.includes(server) ? '' : t(`server__${server}--requirement`)}
              onClick={() => {
                if (valid.includes(server)) {
                  selectServer(server);
                }
              }}>
              <span style={{ background: '#D1E5F0', color: 'black', padding: 5, borderRadius: 10, fontSize: 18 }}>
                {server.toString().padStart(2, '0')}
              </span>

              <div
                style={{
                  color: 'black',
                  textAlign: 'center',
                  margin: 0,
                  padding: 0,
                  fontFamily: 'KOMIKAK',
                  fontSize: '1.5rem',
                  marginTop: -5,
                }}>
                {t(`server__${server}`)}
              </div>

              {!valid.includes(server) && (
                <div
                  className="grid--overlap"
                  style={{
                    position: 'absolute',
                    left: 0,
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                  }}>
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'gray',
                      opacity: 0.5,
                      zIndex: 1,
                      borderRadius: 10,
                    }}></div>
                  <div className="text-outline" style={{ margin: 'auto', textAlign: 'center', color: 'white', zIndex: 2 }}>
                    {t(`server__${server}--requirement`)}
                  </div>
                </div>
              )}

              {server !== 1 && (
                <div
                  style={{ position: 'absolute', top: 2, left: '50%', transform: 'translateX(-50%)', color: 'maroon', zIndex: 2 }}
                  title="Dimensional Servers are servers with a unique twist that can only be found there.">
                  Dimensional
                </div>
              )}
            </div>
          ))}
        </div>

        {loading === LOADING_STATE.PENDING && (
          <CenterContainer>
            <Spinner width={128} />
          </CenterContainer>
        )}
      </div>
    </div>
  );
}
