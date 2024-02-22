import { RANKS } from '../../resources/arena';
import { User } from '../../components/classes';

const expForRank: { [key: string]: { exp: number; title: string } } = {};

export function rankSystemLoader(config: any) {
  Object.entries(config).forEach((entry) => (expForRank[entry[0]] = entry[1] as { exp: number; title: string }));
}

export function expNeededForRank(rank: number) {
  return Math.floor(RANKS[rank - 1]) || 999999999;
}

export function gainRankScore(user: User, amount: number = 0) {
  let curr = user.arena.score + amount;

  if (curr >= expNeededForRank(user.arena.rank + 1)) {
    curr = expNeededForRank(user.arena.rank + 1);
    user.arena.bossFight = true;
  }

  user.arena.score = Math.floor(curr);
}

export function rankUp(user: User) {
  user.arena.rank++;
}
