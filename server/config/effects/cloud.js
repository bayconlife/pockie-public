const { Effect } = require(".");
const Paralysis = require("./paralysis");
const { CombatEffect, EffectRemoveType, FightStatType } = require("./util");

module.exports = class Cloud extends CombatEffect {
  removeType = EffectRemoveType.DO_NOT_REMOVE;
  paralysisLeft = 4;

  constructor(target) {
    super(target, Effect.CLOUD);
  }

  activate(action) {
    const paralysisDuration = 350;
    let thunderDamage = 0;

    if (this.target.hasEffect(Effect.PRAYER)) {
      return;
    }

    if (this.target.decDamage < 100) {
      if (this.target.hasEffect(Effect.FROZEN)) {
        thunderDamage = 0.07 * this.target.maxHp * (0 - this.target.decDamage / 100);
      } else {
        thunderDamage = 0.07 * this.target.maxHp * (1 - this.target.decDamage / 100);
      }
    }

    if (this.target.hasEffect(Effect.STATIC)) {
      const shieldGain = Math.floor(thunderDamage * 1/5);
      this.target.stats.shield += shieldGain;
      action.targetSkillId = 3822;
      action.selfLastDamage = 0;

      this.fight.changeStat(action, {
        stat: FightStatType.SHIELD,
        index: this.target.index,
        value: this.target.stats.shield,
      });

      return;
    }

    thunderDamage = Math.floor(thunderDamage);

    this.fight.damage(this.target.target, this.target, thunderDamage);

    action.selfLastDamage = thunderDamage;
    action.targetSkillId = 3822;

    this.fight.removeEffect(action, this.target, Effect.DIZZY);

    if (!this.target.hasEffect(Effect.PARALYSIS) && this.paralysisLeft > 0) {
      this.paralysisLeft -= 1;
      
      // In the old version it was only allowed 4 times but implementation is broken
      this.fight.addEffect(action, this.target, new Paralysis(this.target, paralysisDuration));
    }
  }
}