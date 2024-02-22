import { createClient } from 'redis';
import { User } from '../../components/classes';

export const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

export async function cacheUser(serverId: number, accountId: number, user: User) {
  // @ts-ignore
  return await client.json.set(`server-${serverId}-account-${accountId}`, '.', user);
}

export async function connect() {
  console.log('Connecting redis...');
  await client.connect();
  console.log('Redis connection finished.');
}

export async function deleteKey(key: string) {
  return await client.del(key);
}

export async function get(key: string) {
  return await client.get(key);
}

export async function getUser(serverId: number, accountId: number): Promise<User | null> {
  return (await client.json.get(`server-${serverId}-account-${accountId}`)) as User | null;
}

export async function hasUser(serverId: number, accountId: number) {
  return (await client.exists(`server-${serverId}-account-${accountId}`)) === 1;
}

export async function removeUser(serverId: number, accountId: number) {
  return await client.json.del(`server-${serverId}-account-${accountId}`);
}

export async function updateUser(serverId: number, accountId: number, user: User) {
  // @ts-ignore
  return await client.json.set(`server-${serverId}-account-${accountId}`, '.', user);
}
