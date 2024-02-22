import { CustomSocket } from '../interfaces';
import { User } from '../components/classes';
import {
  connect,
  deleteKey,
  get as redisGet,
  getUser as getUserRedis,
  removeUser as removeUserRedis,
  updateUser as updateUserRedis,
  client,
} from './redis/redis';
import { getCharacterFromDB, query } from './db';
import { createLock } from './queue';
import { parties } from '../modules/character/party';
import { dungeons } from '../modules/scene/core/dungeons';

const accountIdToSocketId = new Map<string, number>();
const inMemoryCache = new Map<string, User>();

export function accountAddToLoginCache(socket: CustomSocket) {
  accountIdToSocketId.set(socket.id, socket.getAccountId());
}

export function accountCheckIfInLoginCache(accountId: number) {
  return Array.from(accountIdToSocketId.values()).includes(accountId);
}

export function accountRemoveFromLoginCache(socketId: string) {
  accountIdToSocketId.delete(socketId);
}

export async function connectCache() {
  await connect();
}

export const get = redisGet;

export function getSocketIdFromAccountId(accountId: number) {
  return Array.from(accountIdToSocketId.entries()).find((entry) => entry[1] === accountId)?.[0] ?? '';
}

export async function getCharacter(serverId: number, accountId: number): Promise<User> {
  const unlock = await createLock(serverId, accountId);
  const user = inMemoryCache.get(`server-${serverId}-account-${accountId}`);

  if (user !== undefined) {
    user.unlock = unlock;

    return user;
  }

  const redisUser = await getUserRedis(serverId, accountId);

  if (redisUser !== null) {
    redisUser.unlock = unlock;

    return redisUser;
  }

  const dbUser = await getCharacterFromDB(accountId, serverId);

  if (dbUser === null || dbUser.rowCount === 0) {
    unlock();

    throw new Error('No character found in memory, redis, or db.');
  }

  dbUser.rows[0].data.unlock = unlock;

  return dbUser.rows[0].data;
}

export async function getUnlockedCharacter(serverId: number, accountId: number): Promise<User> {
  // console.log('Unlocked character call');
  const user = inMemoryCache.get(`server-${serverId}-account-${accountId}`);

  if (user !== undefined) {
    return user;
  }

  const redisUser = await getUserRedis(serverId, accountId);

  if (redisUser !== null) {
    return redisUser;
  }

  const dbUser = await getCharacterFromDB(accountId, serverId);

  if (dbUser === null || dbUser.rowCount === 0) {
    throw new Error('No character found in cache or db.');
  }

  return dbUser.rows[0].data;
}

export function howMany() {
  return accountIdToSocketId.size;
}

export async function isOnline(serverId: number, accountId: number) {
  return await inMemoryCache.has(`server-${serverId}-account-${accountId}`);
}

export function addCharacterToCache(socket: CustomSocket, character: User) {
  character.lastUsed = Date.now();
  inMemoryCache.set(`server-${socket.getServerId()}-account-${socket.getAccountId()}`, character);
}

export async function removeCharacterFromCache(socket: CustomSocket) {
  inMemoryCache.delete(`server-${socket.getServerId()}-account-${socket.getAccountId()}`);

  return await removeUserRedis(socket.getServerId(), socket.getAccountId());
}

export async function saveAllCharactersInCache() {
  console.log('Saving all redis data to db', inMemoryCache.size, parties.size, dungeons.size);

  for (let [key, data] of inMemoryCache) {
    if ((Date.now() - data.lastUsed) / 1000 > 30 * 60) {
      // if they haven't done anything in 30 minutes
      const serverId = key.substring('server-'.length, key.indexOf('-account'));
      const accountId = key.substring(key.indexOf('account-') + 'account-'.length);

      console.log('Removing', data.displayName, 'from in memory cache');

      inMemoryCache.delete(key);
      await updateUserRedis(Number(serverId), Number(accountId), data);
    }
  }

  const keys = await client.keys('server-*-account-*');

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const serverId = key.substring('server-'.length, key.indexOf('-account'));
    const accountId = key.substring(key.indexOf('account-') + 'account-'.length);
    const unlock = await createLock(Number(serverId), Number(accountId));
    const data = (await client.json.get(keys[i])) as User | null;

    if (data !== null && data.village !== -1) {
      console.log(serverId, accountId);

      await query((client) => {
        return client.query(
          'INSERT INTO characters(account_id, server_id, data) VALUES ($1, $2, $3) ON CONFLICT (account_id, server_id) DO UPDATE SET data = EXCLUDED.data;',
          [accountId, serverId, data]
        );
      });
    }

    await client.json.del(keys[i]);
    unlock?.();
  }

  console.log('Redis data saved and cleared');
}

export async function updateCharacterInCache(serverId: number, accountId: number, user: User) {
  user.lastUsed = Date.now();
  inMemoryCache.set(`server-${serverId}-account-${accountId}`, user);

  return updateUserRedis(serverId, accountId, user);
}

export async function updateUserWithoutSocket(serverId: number, accountId: number, user: User) {
  return await updateUserRedis(serverId, accountId, user);
}
