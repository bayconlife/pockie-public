import React from 'react';
import './App.scss';
import { Provider } from 'react-redux';
import store from './store';
import SiteStateFactory from './features/States/StateFactory';
import { Replay } from './features/Replay/Replay';
import { AdminTools } from './features/AdminTools/AdminTools';

function App() {
  let content = (() => {
    const access = new URLSearchParams(window.location.search).get('access');

    if (access === undefined || access === null) {
      return <SiteStateFactory />;
    }

    switch (access) {
      case 'admin':
        return <AdminTools />;
      case 'replay':
        return <Replay />;
      default:
        return <SiteStateFactory />;
    }
  })();

  return <Provider store={store}>{content}</Provider>;
}

export default App;
