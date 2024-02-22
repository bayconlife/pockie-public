import { useState } from 'react';

export function ChangeName({ name, onClick }: { name: string; onClick: (newName: string) => void }) {
  const [username, setUsername] = useState(name);

  return (
    <>
      <input
        type="text"
        id="username"
        onChange={(e) => setUsername(e.currentTarget.value)}
        value={username}
        style={{ marginLeft: 'auto' }}
      />
      <button onClick={() => onClick(username)}>Change</button>
    </>
  );
}
