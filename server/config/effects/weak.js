const { Effect } = require(".");
const { CombatEffect, EffectRemoveType } = require("./util");

module.exports = class Weak extends CombatEffect {
  removeType = EffectRemoveType.DURATION;

  constructor(target, duration) {
    super(target, Effect.WEAK);

    this.duration = duration;
  }

  add() {
    this.target.canAttack -= 1;
  }

  remove() {
    this.target.canAttack += 1;
  }
}