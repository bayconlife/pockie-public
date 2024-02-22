import { random, randomInt } from '../../components/random';
import { CombatActor, FightAction, FightStatChange } from '../../interfaces';
import { removeEffect } from './effectSystem';
import { Effect, FightStat } from '../../enums';

export function calculateCriticalHitDamage(source: CombatActor, target: CombatActor, damage: number) {
  const critIncrease = (source.criticalDamage + (source.critical - target.con) * 0.125) * 0.01;

  if (critIncrease - 1 > 0) {
    damage *= critIncrease;
  }

  return Math.floor(damage);
}

export function calculateDefenseDamageReduction(source: CombatActor, target: CombatActor, damage: number) {
  let targetDefense = target.defense - source.defenseBreak;

  if (targetDefense <= -1353) {
    targetDefense = -1353;
  }

  let finalDamage = Math.floor(damage * (1 - targetDefense / (targetDefense + 1354))); // TODO look into why they add this random number? Is it added somewhere else or is this the base multi idk?

  if (finalDamage < 0) {
    return 0;
  }

  return finalDamage;
}

export function calculateBlockDamageReduction(action: FightAction, target: CombatActor, damage: number) {
  if (target.stats.block.percent <= 0) {
    return damage;
  }

  return Math.floor(damage * (100 - target.stats.block.percent) * 0.01);
}

export function calculatePercentDamageReduction(source: CombatActor, target: CombatActor, damage: number) {
  if (target.decDamage > 100) {
    return 0;
  }

  return Math.floor(damage * (1 - target.decDamage / 100));
}

export function calculateShieldDamageReduction(action: FightAction, source: CombatActor, damage: number) {
  if (source.stats.shield <= 0) {
    return damage;
  }

  const damageToShield = damage >= source.stats.shield ? source.stats.shield : damage;
  damage -= damageToShield;
  source.stats.shield -= damageToShield;

  if (source.stats.shield <= 0) {
    removeEffect(action, source, Effect.STATIC); // Is this the only shield?!?
  }

  changeStat(action, {
    stat: FightStat.SHIELD,
    index: source.index,
    value: source.stats.shield,
  });

  return damage;
}

export function changeStat(action: FightAction, change: FightStatChange) {
  if (action.statChange === undefined) {
    action.statChange = [];
  }

  action.statChange.push(change);
}

export function getDamage(source: CombatActor) {
  if (source.maxAttack <= source.minAttack) {
    return source.maxAttack;
  }

  return randomInt(source.minAttack, source.maxAttack);
}

export function getReflectedDamage(source: CombatActor, target: CombatActor, damage: number) {
  if (target.rebound > 0) {
    return Math.floor(damage * target.rebound * 0.01);
  }

  return 0;
}

export function isCrit(source: CombatActor, target: CombatActor) {
  return random(1, 100) <= Math.round((source.critical - target.con) / 16);
}

export function isHit(source: CombatActor, target: CombatActor) {
  let chanceToHit = 100;

  if (target.canAttack <= 0) {
    return true;
  }

  if (target.dodge > source.hit) {
    chanceToHit = 100 - Math.floor((target.dodge - source.hit) / 16);
  }

  return randomInt(0, 99) < chanceToHit;
}
