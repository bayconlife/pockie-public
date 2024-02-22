import { CustomSocket } from '../../interfaces';
import { client } from '../../infrastructure/redis/redis';

export async function addToLeaderboard(leaderboard: string, value: number, id: string) {
  return await client.zAdd(leaderboard, { score: value, value: id });
}

export function getArenaLeaderboardNameForSocket(socket: CustomSocket) {
  return `arena-leaderboard-server-${socket.getServerId()}`;
}

export async function getLeaderboardRangeByRank(leaderboard: string, min: number, max: number) {
  return await client.zRange(leaderboard, min, max, { REV: true });
}

export async function getLeaderboardRank(leaderboard: string, id: string) {
  return await client.zRevRank(leaderboard, '' + id);
}

export async function getLeaderboardId(leaderboard: string, rank: number) {
  return await getLeaderboardRangeByRank(leaderboard, rank, rank);
}

export async function getLeaderboardWithScore(leaderboard: string, id: string) {
  return await client.zScore(leaderboard, '' + id);
}

export async function removeFromLeaderboard(leaderboard: string, id: string) {
  return await client.zRem(leaderboard, '' + id);
}
