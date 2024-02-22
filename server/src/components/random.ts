import * as crypto from 'crypto';

const random = (lower: number, upper: number) => {
  return Math.random() * (upper - lower) + lower;
};

/**
 *
 * @param lower Inclusive
 * @param upper Inclusive
 * @returns
 */
const randomInt = (lower: number, upper: number) => {
  if (upper < lower) {
    return upper;
  }

  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
};

export function randomUUID() {
  return crypto.randomUUID();
}

export function getIndexFromWeightedGroup(group: any[][], weightIdx: number) {
  const total = group.reduce((sum, card) => (sum += card[weightIdx]), 0);
  const roll = randomInt(0, total - 1);

  for (let i = 0, cur = 0; i < group.length; i++) {
    cur += group[i][weightIdx];

    if (cur > roll) {
      return i;
    }
  }

  return 0;
}

export { random, randomInt };
