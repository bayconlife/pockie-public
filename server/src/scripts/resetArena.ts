import { client } from '../infrastructure/redis/redis';

export default async function resetArena() {
  console.log('Resetting');
  await client.del('arena-leaderboard-server-1');
  await client.del('isBotsLeaderboardLoaded-server-1');
  console.log('Finished Reset');
}
