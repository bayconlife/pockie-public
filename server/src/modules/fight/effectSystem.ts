import { CombatEffect } from '../../classes';
import { Effect } from '../../enums';
import { CombatActor, FightAction } from '../../interfaces';
import { Fight } from './fightSystem';

export function addEffect(action: FightAction, target: CombatActor, effect: CombatEffect, fight?: Fight) {
  if (effect.name in target.effects) {
    return action;
  }

  if (fight) {
    effect.fight = fight;
  }
  effect.add(action);
  target.effects[effect.name] = effect;

  if (action.addEffect === undefined) {
    action.addEffect = [];
  }

  action.addEffect.push({ role: target.index, id: effect.name });

  return action;
}

export function getEffect(source: CombatActor, effect: Effect) {
  if (effect in source.effects) {
    return source.effects[effect];
  }

  return null;
}

export function hasEffect(source: CombatActor, effect: Effect) {
  return effect in source.effects;
}

export function removeEffect(action: FightAction, target: CombatActor, name: Effect) {
  if (!(name in target.effects)) {
    return action;
  }

  target.effects[name].remove(action);

  delete target.effects[name];

  if (action.removeEffect === undefined) {
    action.removeEffect = [];
  }

  action.removeEffect.push({ role: target.index, id: name });

  return action;
}
