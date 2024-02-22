import './AdminTools.css';

import { useState } from 'react';
import { Login } from './components/Login';
import { CharacterSearch } from './components/CharacterSearch';

export function AdminTools() {
  const [state, setState] = useState(0);

  if (state === 0) {
    return <Login onLogin={() => setState(1)} />;
  }

  return (
    <div style={{ padding: 5 }}>
      <CharacterSearch />
    </div>
  );
}
