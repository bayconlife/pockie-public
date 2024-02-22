import { promisify } from 'util';
import * as redisClient from 'redis';
import { User } from './classes';

const redis = redisClient.createClient({
  password: 'lhyxr8DKay5jy48egY1Qs6yoBDFeqWPn',
  socket: {
    host: 'redis-19971.c289.us-west-1-2.ec2.cloud.redislabs.com',
    port: 19971,
  },
});

redis.connect();

export const getAsync = promisify(redis.get).bind(redis);
export const setAsync = promisify(redis.set).bind(redis);

export const zaddAsync: (key: string, value: number, id: string) => Promise<number> = promisify(redis.zAdd).bind(redis);
export const zrangeAsync = promisify(redis.zRange).bind(redis);
export const zrankAsync = promisify(redis.zRank).bind(redis);
export const zrevrankAsync = promisify(redis.zRevRank).bind(redis);
export const zrevrangeAsync = promisify(redis.zRange).bind(redis);
export const zremAsync: (key: string, id: string) => Promise<number> = promisify(redis.zRem).bind(redis);
export const zscoreAsync = promisify(redis.zScore).bind(redis);

export const get = (key: string) => redis.get(key);
export const set = (key: string, value: string) => redis.set(key, value);

export async function addRankings(user: User) {
  // redis.zAdd('leaderboard', user.arena.rank, user.username);
}

async function getArenaUsers(rank: number) {
  const members = (await zrangeAsync('leaderboard', 0, rank + 2)) as Promise<string[]>;
  return members;
}

export async function getRankedFighters(player: User) {
  const users = await getArenaUsers(player.arena.rank);
  let opponents: User[] = [];

  for (let i = 0; i < users.length; i++) {
    const user = await getUser(users[i]);

    // if (user === null || user.username === player.username) {
    //   continue;
    // }

    // opponents.push(user);
  }

  return opponents;
}

const getUser = (username: string): User | null => {
  // return getAsync(`user-${username}`).then((userAsString) => {
  //   if (userAsString === null) {
  //     return null;
  //   }

  //   return { ...new User(), ...JSON.parse(userAsString) };
  // });
  return null;
};

// redis.keys('*', (err, keys) => {
//   keys.forEach((key) => console.log(`KEY: ${key}`));
// });

export async function addKey(key: string) {
  const keys = ((await getAsync(`keys`)) || '').split(',');

  if (!keys.includes(key)) {
    keys.push(key);
  }

  await setAsync('keys', keys.join(','));
  return console.log('Added key', key);
}

export async function isValidKey(key: string) {
  const keys = (await getAsync(`keys`)) || '';
  return keys.split(',').includes(key);
}

export async function showKeys() {
  const keys = (await getAsync(`keys`)) || '';
  // keys.split(',').forEach((key) => console.log(key));
}

export async function useKey(key: string) {
  if (!(await isValidKey(key))) {
    return; // TODO maybe throw error?
  }

  const keys = ((await getAsync(`keys`)) || '').split(',');
  keys.splice(keys.indexOf(key), 1);

  setAsync('keys', keys.join(','));
}

export default redis;
export { getUser };
