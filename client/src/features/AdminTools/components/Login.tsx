import { useContext, useState } from 'react';
import { connectWithJWT, toServer } from '../../../util/ServerSocket';
import { postData } from '../../../util/fetch';

export function Login({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState(process.env.REACT_APP_DEFAULT_USERNAME as string);
  const [password, setPassword] = useState(process.env.REACT_APP_DEFAULT_PASSWORD as string);
  const [response, setResponse] = useState('');

  function onSubmit() {
    postData(`${process.env.REACT_APP_API_URL}/adminLogin`, { username, password }).then((data) => {
      if (data.error) {
        return setResponse(data.error);
      }

      connectWithJWT(data.jwt);
      onLogin();
    });
  }

  return (
    <div
      style={{
        background: 'gray',
        display: 'flex',
        flexDirection: 'column',
        width: 300,
        gap: 5,
        justifyContent: 'center',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%)',
      }}>
      <div>
        <div style={{ display: 'flex' }}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            onChange={(e) => setUsername(e.currentTarget.value)}
            value={username}
            style={{ marginLeft: 'auto' }}
          />
        </div>

        <div style={{ display: 'flex' }}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.currentTarget.value)}
            value={password}
            style={{ marginLeft: 'auto' }}
          />
        </div>
      </div>

      <div>{response}</div>

      <button onClick={onSubmit}>Submit</button>
    </div>
  );
}
