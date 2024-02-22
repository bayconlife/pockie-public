const MULTIPLIERS: number[] = [9, 11, 12, 14];

export function statValue(type: number, value: number) {
  return MULTIPLIERS.includes(type) ? (value / 10).toFixed(2) : value;
}
