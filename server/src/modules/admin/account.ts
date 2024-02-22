import { Callback } from '../../types';
import { CustomSocket } from '../../interfaces';
import { hasPermissionLevel } from './util';
import { query } from '../../infrastructure/db';
import { accountRemoveFromLoginCache, getSocketIdFromAccountId } from '../../infrastructure/cache';
import { io } from '../../components/io';
import { tempMuteList } from '../chat/chat';

export async function logoutAccount(socket: CustomSocket, accountId: number, cb: Callback = () => {}) {
  if (!hasPermissionLevel(socket, 1)) {
    return;
  }

  const socketId = getSocketIdFromAccountId(accountId);

  if (socketId !== '') {
    io.to(socketId).emit('relog');
  }

  accountRemoveFromLoginCache(socketId);

  cb();
}

export async function muteAccount(socket: CustomSocket, accountId: number, cb: Callback = () => {}) {
  if (!hasPermissionLevel(socket, 1)) {
    return;
  }

  await query((client) => {
    return client.query('UPDATE accounts SET muted=TRUE WHERE id=$1;', [accountId]);
  });

  tempMuteList.push(accountId);
  const socketId = getSocketIdFromAccountId(accountId);

  if (socketId !== '') {
    io.to(socketId).emit('relog');
  }

  cb();
}

export async function unmuteAccount(socket: CustomSocket, accountId: number, cb: Callback = () => {}) {
  if (!hasPermissionLevel(socket, 1)) {
    return;
  }

  await query((client) => {
    return client.query('UPDATE accounts SET muted=FALSE WHERE id=$1;', [accountId]);
  });

  const socketId = getSocketIdFromAccountId(accountId);

  if (socketId !== '') {
    io.to(socketId).emit('relog');
  }

  cb();
}
