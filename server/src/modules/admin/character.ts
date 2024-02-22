import { Callback } from '../../types';
import { CustomSocket } from '../../interfaces';
import { hasPermissionLevel } from './util';
import { query } from '../../infrastructure/db';
import { getCharacter, isOnline, updateUserWithoutSocket } from '../../infrastructure/cache';

export async function changeCharacterName(socket: CustomSocket, data: any, cb: Callback = () => {}) {
  if (!hasPermissionLevel(socket, 1)) {
    return;
  }

  if (await isOnline(data.serverId, data.accountId)) {
    const character = await getCharacter(data.serverId, data.accountId);

    if (character) {
      character.displayName = data.name;

      await updateUserWithoutSocket(data.serverId, data.accountId, character);
    }
  } else {
    await query((client) => {
      return client.query('UPDATE characters SET data = data || $1 WHERE account_id=$2 AND server_id=$3;', [
        `{"displayName": "${data.name}"}`,
        data.accountId,
        data.serverId,
      ]);
    });
  }

  cb();
}

export async function lookupCharacter(socket: CustomSocket, displayName: string, cb: Callback = () => {}) {
  if (!hasPermissionLevel(socket, 1)) {
    return;
  }

  cb(
    (
      await query((client) => {
        return client.query(
          "SELECT characters.*, accounts.muted FROM characters JOIN accounts ON characters.account_id = accounts.id WHERE data->>'displayName' ILIKE $1;",
          [`%${displayName}%`]
        );
      })
    )?.rows
  );
}
