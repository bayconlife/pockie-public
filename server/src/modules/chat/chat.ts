import { Callback } from '../../types';
import { CustomSocket } from '../../interfaces';
import { isCharacterInParty } from '../character/party';
import { error } from '../kernel/errors';

export const tempMuteList: number[] = [];

export async function sendMessage(socket: CustomSocket, data: any, cb: Callback) {
  const user = await socket.getUnlockedCharacter();

  if ((socket.data.muted ?? false) || tempMuteList.includes(socket.getAccountId())) {
    return error(socket, 'error__account_muted');
  }

  const message = {
    channel: data.channel,
    user: user.displayName,
    id: socket.getAccountId(),
    serverId: socket.getServerId(),
    message: data.message,
  };

  if (data.channel === 'global') {
    socket.shout('global', 'receiveMessage', message);
  }

  if (data.channel === 'party') {
    if (isCharacterInParty(user)) {
      socket.shout(`party-${user.party}`, 'receiveMessage', message);
    } else {
      socket.emit('receiveMessage', { channel: 'party', user: 'System', message: 'You are not in a party.' });
    }
  }
}
