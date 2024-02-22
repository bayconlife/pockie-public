const { Effect } = require(".");
const { CombatEffect, EffectRemoveType } = require("./util");

module.exports = class ElementalSeal extends CombatEffect {
  removeType = EffectRemoveType.DURATION;

  constructor(target, duration) {
    super(target, Effect.ELEMENTAL_SEAL);

    this.duration = duration;
  }

  add() {}

  remove() {}
}