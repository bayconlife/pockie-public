import './Landing.css';
import * as React from 'react';
import { Login } from './Login';
import { Register } from './Register';
import { useAppDispatch } from '../../hooks';
import { switchState } from '../../slices/stateSlice';
import { SiteState } from '../../enums';

export const Landing: React.FC<{}> = ({}) => {
  const dispatch = useAppDispatch();
  const [showLogin, setShowLogin] = React.useState(false);
  const [showRegister, setShowRegister] = React.useState(false);

  if (localStorage.getItem('jwt')) {
    dispatch(switchState(SiteState.GAME_LOADER));
  }

  return (
    <div className="landing" style={{ background: `url(${process.env.REACT_APP_CDN_PATH}site/body.jpg) no-repeat scroll center #fff` }}>
      <div className="content">
        <div
          className="start-button"
          onClick={() => setShowLogin(true)}
          style={{
            backgroundImage: `url(${process.env.REACT_APP_CDN_PATH}site/start.png)`,
          }}
        />
        <div
          className="register-button"
          onClick={() => setShowRegister(true)}
          style={{
            backgroundImage: `url(${process.env.REACT_APP_CDN_PATH}site/buttons.png)`,
          }}
        />
      </div>

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
      {showRegister && <Register onClose={() => setShowRegister(false)} />}
    </div>
  );
};
