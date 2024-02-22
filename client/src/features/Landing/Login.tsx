import './Login.css';

import * as React from 'react';
import { useAppDispatch } from '../../hooks';
import { LoadState, setId, setLoadState } from '../../slices/accountSlice';
import { ServerSelect } from './ServerSelect';
import { postData } from '../../util/fetch';

interface Props {
  onClose: () => void;
}

export const Login: React.FC<Props> = ({ onClose }) => {
  const dispatch = useAppDispatch();

  const [username, setUsername] = React.useState(process.env.REACT_APP_DEFAULT_USERNAME as string);
  const [password, setPassword] = React.useState(process.env.REACT_APP_DEFAULT_PASSWORD as string);
  const [response, setResponse] = React.useState('');
  const [servers, setServers] = React.useState<{ servers: number[]; valid: number[] }>({
    servers: [],
    valid: [],
  });
  const [jwt, setJWT] = React.useState<string>();

  const onSubmit = React.useCallback(() => {
    dispatch(setLoadState(LoadState.LOADING));
    postData(`${process.env.REACT_APP_API_URL}/login`, { username, password }).then((data) => {
      if (data.error) {
        dispatch(setLoadState(LoadState.NOT_LOADED));
        return setResponse(data.error);
      }

      dispatch(setId(data.id));
      setJWT(data.jwt);
      setServers({
        servers: data.servers,
        valid: data.valid,
      });
    });
  }, [username, password]);

  if (servers.servers?.length > 0 && jwt) {
    return <ServerSelect jwt={jwt} servers={servers.servers} valid={servers.valid} />;
  }

  return (
    <div className="login__container">
      <div className="blur" />
      <div className="login__modal">
        <button id="login__close" onClick={onClose}>
          X
        </button>

        <h2>Login</h2>

        <div id="login__body">
          <div>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" onChange={(e) => setUsername(e.currentTarget.value)} value={username} />
          </div>

          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" onChange={(e) => setPassword(e.currentTarget.value)} value={password} />
          </div>
        </div>

        <div id="login__response">{response}</div>

        <div id="login__submit">
          <button onClick={onSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};
