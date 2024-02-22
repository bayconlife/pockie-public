import { Effect, EffectRemoveType, SkillTrigger, UserSkillResult } from '../../../enums';
import {
  calculateCriticalHitDamage,
  calculateDefenseDamageReduction,
  calculateBlockDamageReduction,
  calculatePercentDamageReduction,
  calculateShieldDamageReduction,
  getReflectedDamage,
  isCrit,
  isHit,
  changeStat,
} from '../damageSystem';
import { removeEffect } from '../effectSystem';
import { FightSystem } from '../interfaces';
import { findSkillByTrigger } from '../skillSystem';

export const Overworld: FightSystem = {
  attack(fight, source, target, damageToTarget, damageToSelf) {
    const action = fight.getLastAction();

    if (damageToTarget === 0 && damageToSelf === 0) {
      return false;
    }

    if (!isHit(source, target)) {
      action.isHit = false;
      return false;
    }

    if (isCrit(source, target)) {
      damageToTarget = calculateCriticalHitDamage(source, target, damageToTarget);
      action.isCrit = true;
    }

    let reflectedDamage = getReflectedDamage(source, target, damageToTarget);
    reflectedDamage = calculatePercentDamageReduction(target, source, reflectedDamage); // You can reduce own reflected damage
    reflectedDamage = calculateDefenseDamageReduction(target, source, reflectedDamage);

    damageToTarget = calculatePercentDamageReduction(source, target, damageToTarget);
    damageToTarget = calculateBlockDamageReduction(action, target, damageToTarget);
    damageToTarget = calculateDefenseDamageReduction(source, target, damageToTarget);
    damageToTarget = calculateShieldDamageReduction(action, target, damageToTarget);

    damageToSelf = calculatePercentDamageReduction(target, source, damageToSelf);

    reflectedDamage = Math.floor(reflectedDamage);
    damageToTarget = Math.floor(damageToTarget);
    damageToSelf = Math.floor(damageToSelf);

    const incHp = Math.min(source.maxHp - source.hp, Math.floor(source.stats.vampiricHp * damageToTarget));

    fight.damage(source, target, damageToTarget, false);
    fight.damage(target, source, damageToSelf + reflectedDamage - incHp);

    // if (!fight.isActorDead(source, target) && damageToSelf + reflectedDamage - incHp > 0 && source !== target) {
    //   fight.attemptToUseSkillOfTriggerType(source, target, SkillTrigger.AFTER_BEING_HURT);
    // }

    if (target.saveSkillId !== 0) {
      action.targetSkillId = target.saveSkillId;
      action.targetRole = target.index;
    }

    Object.values(target.effects)
      .filter((effect) => effect.removeType === EffectRemoveType.ATTACK_HIT)
      .map((effect) => effect.name)
      .forEach((effect) => removeEffect(action, target, effect));

    if (reflectedDamage + damageToSelf > 0) {
      Object.values(source.effects)
        .filter((effect) => effect.removeType === EffectRemoveType.ATTACK_HIT)
        .map((effect) => effect.name)
        .forEach((effect) => removeEffect(action, source, effect));
    }

    if (!fight.isActorDead(source, target) && damageToTarget > 0 && source !== target) {
      fight.attemptToUseSkillOfTriggerType(target, source, SkillTrigger.AFTER_BEING_HURT);
    }

    if (reflectedDamage > 0) {
      action.reflectedDamage = reflectedDamage; // BackDamage in original
    }

    // if (damageToTarget > 0) {
    action.targetLastDamage = damageToTarget;
    // }

    if (damageToSelf > 0) {
      action.selfLastDamage = damageToSelf;
    }

    if (incHp > 0) {
      action.incHp = incHp;
    }

    return true;
  },
  attemptToUseSkillOfTriggerType(fight, source, target, trigger) {
    if (source.canUseSkill <= 0 || source.canAttack <= 0) {
      return;
    }

    const { skill, mustCast } = findSkillByTrigger(source, trigger);

    if (skill === null && mustCast.length === 0) {
      return;
    }

    for (let i = 0; i < mustCast.length; i++) {
      const result = fight.useSkill(source, target, mustCast[i]);

      if (result === UserSkillResult.SKILL_SUCCESS) {
        return;
      }
    }

    if (skill === null) {
      return;
    }

    const result = fight.useSkill(source, target, skill);

    if (result !== UserSkillResult.SKILL_SUCCESS) {
      return;
    }

    return;
  },
  changeAtk(target, minMultipler, minAdditional, maxMultipler, maxAdditional) {
    const min = Math.floor(target.stats.attack.min.initial * (100 + minMultipler) * 0.01) + minAdditional;
    const max = Math.floor(target.stats.attack.max.initial * (100 + maxMultipler) * 0.01) + maxAdditional;

    if (min < 0 || max < 0) {
      return;
    }

    target.minAttack = min;
    target.maxAttack = max;
    target.stats.attack.min.multipler = minMultipler;
    target.stats.attack.min.additional = minAdditional;
    target.stats.attack.max.multipler = maxMultipler;
    target.stats.attack.max.additional = maxAdditional;
  },
  changeAtkTime(target, multipler, additional) {
    const newTime = Math.floor((target.stats.attackTime.initial * 100) / (100 + multipler)) - additional;

    target.stats.attackTime.multipler = multipler;
    target.stats.attackTime.additional = additional;
    target.stats.attackTime.modified = Math.floor((target.stats.attackTime.initial * 100) / (100 + multipler));

    if (newTime <= 0) {
      return;
    }

    target.attackTime = newTime;
  },
  changeBlock(target, multiplier, additional) {
    target.parry = Math.floor(target.stats.block.initial * (100 + multiplier) * 0.01) + additional;
    target.stats.block.multipler = multiplier;
    target.stats.block.additional = additional;
  },
  changeDefense(target, multiplier, additional) {
    target.defense = Math.floor(target.stats.defense.initial * (100 + multiplier) * 0.01) + additional;
    target.stats.defense.multipler = multiplier;
    target.stats.defense.additional = additional;
  },
  changeDodge(target, multiplier, additional) {
    target.dodge = Math.floor(target.stats.dodge.initial * (100 + multiplier) * 0.01) + additional;
    target.stats.dodge.multipler = multiplier;
    target.stats.dodge.additional = additional;
  },
  changeHit(target, multipler, additional) {
    target.hit = Math.floor(target.stats.hit.initial * (100 + multipler) * 0.01) + additional;
    target.stats.hit.multipler = multipler;
    target.stats.hit.additional = additional;
  },
  changeNextAtkTime(source, amount) {
    source.nextAttackTime += Math.floor(amount); // TODO fix SETTING TO /100 to interact with our time properly
  },
  changeStat(action, change) {
    changeStat(action, change);
  },
  damage(fight, source, target, amount, allowDamageSkills = true) {
    target.hp = Math.max(Math.min(target.hp - amount, target.maxHp), 0);

    if (allowDamageSkills && amount > 0 && !fight.isActorDead(source, target)) {
      this.attemptToUseSkillOfTriggerType(fight, target, source, SkillTrigger.AFTER_BEING_HURT);
    }
  },
  damageWithReduction(fight, source, target, amount, allowDamageSkills = true) {
    let finalDamage = amount;

    if (target.decDamage < 100) {
      if (target.hasEffect(Effect.FROZEN)) {
        finalDamage *= 0 - target.decDamage / 100;
      } else {
        finalDamage *= 1 - target.decDamage / 100;
      }
    } else {
      finalDamage = 0;
    }

    finalDamage = Math.max(Math.min(Math.floor(finalDamage), target.hp), 0);
    target.hp -= finalDamage;

    if (allowDamageSkills && finalDamage > 0 && !fight.isActorDead(source, target)) {
      this.attemptToUseSkillOfTriggerType(fight, target, source, SkillTrigger.AFTER_BEING_HURT);
    }

    return finalDamage;
  },
  isActorDead(...actors) {
    return actors.some((actor) => actor.hp <= 0);
  },
  useChakra(action, source, amount) {
    if (Number.isNaN(amount)) {
      console.trace();
    }

    amount = Math.floor(amount);
    source.chakra -= amount;
    action.decMp = amount;
    removeEffect(action, source, 11836);
  },
};
