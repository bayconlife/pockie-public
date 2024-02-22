import './Register.css';
import * as React from 'react';
import { postData } from '../../util/fetch';

interface Props {
  onClose: () => void;
}

export const Register: React.FC<Props> = ({ onClose }) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  // const [key, setKey] = React.useState('');
  const [response, setResponse] = React.useState('Password must be at least 8 characters long.');

  function onSubmit() {
    postData(`${process.env.REACT_APP_API_URL}/register`, { username, password }).then((data) => {
      if (data.error) {
        setResponse(data.error);
      } else {
        setResponse(data.message);
      }
    });
  }

  return (
    <div className="register-container">
      <div className="blur" />
      <div className="register-modal">
        <button id="register__close" onClick={onClose}>
          X
        </button>

        <h2>Register</h2>

        <div id="register__body">
          <div>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" onChange={(e) => setUsername(e.currentTarget.value)} />
          </div>

          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" onChange={(e) => setPassword(e.currentTarget.value)} />
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input type="password" id="confirmPassword" onChange={(e) => setConfirmPassword(e.currentTarget.value)} />
          </div>

          {/* <div>
            <label htmlFor="key">Key:</label>
            <input type="text" id="key" onChange={(e) => setKey(e.currentTarget.value)} />
          </div> */}
        </div>

        <div id="register__response">{response}</div>

        <div id="register__submit">
          <button onClick={onSubmit} disabled={username === '' || password === '' || password !== confirmPassword}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
