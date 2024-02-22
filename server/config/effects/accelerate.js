const { Effect } = require(".");
const { CombatEffect, EffectAssociation, EffectRemoveType } = require("./util");

module.exports = class Accelerate extends CombatEffect {
  association = EffectAssociation.BENEFICIAL;
  // removeType = EffectRemoveType.DURATION;
  // duration = 0;
  damageReduction = 0;
  additionalAttackTime = 0;

  constructor(target, damageReduction) {
    super(target, Effect.ACCELERATE);
    this.damageReduction = damageReduction;
    this.additionalAttackTime = target.attackTime - 1; // This should make our attack time be 1, since we increase the enemy attack time by 1 we are secure in going next
  }

  add() {
    this.fight.changeAtkTime(this.target, this.target.stats.attackTime.multipler, this.target.stats.attackTime.additional + this.additionalAttackTime)
    this.fight.changeAtk(
      this.target,
      this.target.stats.attack.min.multipler - this.damageReduction,
      this.target.stats.attack.min.additional,
      this.target.stats.attack.max.multipler - this.damageReduction,
      this.target.stats.attack.max.additional
    );
  }

  remove() {
    this.fight.changeAtkTime(this.target, this.target.stats.attackTime.multipler, this.target.stats.attackTime.additional - this.additionalAttackTime)
    this.fight.changeAtk(
      this.target,
      this.target.stats.attack.min.multipler + this.damageReduction,
      this.target.stats.attack.min.additional,
      this.target.stats.attack.max.multipler + this.damageReduction,
      this.target.stats.attack.max.additional
    );
  }
}