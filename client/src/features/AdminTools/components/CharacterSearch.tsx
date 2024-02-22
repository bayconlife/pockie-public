import { useState } from 'react';
import { ChangeName } from './ChangeName';
import { toServer } from '../../../util/ServerSocket';

export function CharacterSearch() {
  const [username, setUsername] = useState('');
  const [characters, setCharacters] = useState<any[]>([]);

  function changeName(accountId: number, serverId: number, name: string) {
    toServer('adminChangeCharacterName', { accountId, serverId, name }, () => {
      lookup();
    });
  }

  function logout(accountId: number) {
    toServer('adminLogoutAccount', accountId, () => {
      lookup();
    });
  }

  function lookup() {
    toServer('adminCharacterLookup', username, (_characters: any[]) => setCharacters(_characters));
  }

  function mute(accountId: number) {
    toServer('adminMuteAccount', accountId, () => {
      lookup();
    });
  }

  function unmute(accountId: number) {
    toServer('adminUnmuteAccount', accountId, () => {
      lookup();
    });
  }

  return (
    <div style={{ background: 'gray', width: 600, height: 500 }}>
      <h1 style={{ marginTop: 0 }}>Character Lookup</h1>
      <div>
        <label htmlFor="username">Display:</label>
        <input
          type="text"
          id="username"
          onChange={(e) => setUsername(e.currentTarget.value)}
          value={username}
          style={{ marginLeft: 'auto' }}
        />
        <button onClick={lookup}>Lookup</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Server</th>
            <th>Display Name</th>
            <th>Account Muted</th>
            <th>Manual Logout</th>
          </tr>
        </thead>
        <tbody>
          {characters.map((character) => (
            <tr key={`${character.server_id}-${character.account_id}-${character.data.displayName}`}>
              <td>{character.server_id}</td>
              <td>
                <ChangeName
                  name={character.data.displayName}
                  onClick={(newName) => changeName(character.account_id, character.server_id, newName)}
                />
              </td>
              <td>
                {character.muted ? (
                  <button onClick={() => unmute(character.account_id)}>Unmute Account</button>
                ) : (
                  <button onClick={() => mute(character.account_id)}>Mute Account</button>
                )}
              </td>
              <td>
                <button onClick={() => logout(character.account_id)}>Force Logout</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
