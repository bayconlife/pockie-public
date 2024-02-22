import { addToLeaderboard, getLeaderboardRangeByRank } from '../modules/kernel/leaderboards';
import { Stats, Fighter, Pot } from '../interfaces';
import { IConfig } from 'config';
import { monsterBase } from './monsters';
import { client } from '../infrastructure/redis/redis';
import { SERVERS } from './servers';

interface IPot {
  [id: number]: Pot;
}
export const Fighters: { [id: string]: Fighter } = {};
export let RANKS: number[] = [];
export let Pots: IPot;
export const Bosses: { [id: string]: Fighter } = {};

export default function arenaLoader(config: IConfig) {
  Object.entries(config.get('Arena.Fighters') || {}).forEach(
    //@ts-ignore
    (entry) => (Fighters[entry[0]] = { id: Number(entry[0]), combatSkills: [], ...monsterBase, ...(entry[1] as Fighter) })
  );

  Object.entries(config.get('Arena.Bosses') || {}).forEach(
    //@ts-ignore
    (entry) => (Bosses[entry[0]] = { id: entry[0], combatSkills: [], ...monsterBase, ...(entry[1] as Fighter) })
  );

  RANKS = Object.values(config.get('Arena.Ranks') || {})
    .map((rank: any) => rank)
    .sort((a, b) => a - b);

  Pots = config.get('Arena.Pots');

  (async () => {
    Object.keys(config.get('servers')).forEach(async (serverId) => {
      const isBotsLeaderboardLoaded = await client.get(`isBotsLeaderboardLoaded-server-${serverId}`);

      console.log('Are leaderboards already loaded for', `arena-leaderboard-server-${serverId}`, isBotsLeaderboardLoaded);

      if (isBotsLeaderboardLoaded !== 'true') {
        const keys = Object.keys(Fighters);

        for (let i = 0; i < keys.length; i++) {
          const id = keys[i];
          const fighter = Fighters[Number(id)];

          await addToLeaderboard(`arena-leaderboard-server-${serverId}`, fighter.score, id);
        }

        await client.set(`isBotsLeaderboardLoaded-server-${serverId}`, 'true');

        console.log(`Loaded leaderboard for server ${serverId}`);
      }
    });
  })();
}
