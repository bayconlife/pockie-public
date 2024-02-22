const { Effect } = require(".");
const { CombatEffect, EffectRemoveType, EffectAssociation } = require("./util");

module.exports = class Charm extends CombatEffect {
  association = EffectAssociation.HARMFUL;
  removeType = EffectRemoveType.DURATION;

  constructor(target, duration) {
    super(target, Effect.CHARM);

    this.duration = duration;
  }

  add(action) {
    this.fight.removeEffect(action, this.target, Effect.PARALYSIS);
    this.target.canAttack -= 1;
  }

  remove() {
    this.target.canAttack += 1;
  }
}