const { Effect } = require(".");
const { CombatEffect, EffectRemoveType, EffectAssociation } = require("./util");

module.exports = class Mark extends CombatEffect {
  removeType = EffectRemoveType.DO_NOT_REMOVE;
  association = EffectAssociation.BENEFICIAL;
  previousAttackBonusRate = 0;

  constructor(target) {
    super(target, Effect.MARK);
  }

  activate(action) {
    const effectBonus = 1 + this.target.SkillAdd7 * 0.0001;
    const attackBonusRate = Math.floor(50 * (1 - this.target.hp / this.target.maxHp) * effectBonus);

    this.fight.changeAtk(
      this.target,
      this.target.stats.attack.min.multipler + attackBonusRate - this.previousAttackBonusRate,
      this.target.stats.attack.min.additional,
      this.target.stats.attack.max.multipler + attackBonusRate - this.previousAttackBonusRate,
      this.target.stats.attack.max.additional
    );

    this.previousAttackBonusRate = attackBonusRate;
  }

  remove() {
    this.fight.changeAtk(
      this.target,
      this.target.stats.attack.min.multipler - this.previousAttackBonusRate,
      this.target.stats.attack.min.additional,
      this.target.stats.attack.max.multipler - this.previousAttackBonusRate,
      this.target.stats.attack.max.additional
    );
  }
}