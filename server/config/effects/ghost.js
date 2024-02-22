const { Effect } = require(".");
const { CombatEffect, EffectRemoveType } = require("./util");

module.exports = class Ghost extends CombatEffect {
  removeType = EffectRemoveType.DURATION;

  constructor(target, duration) {
    super(target, Effect.GHOST);

    this.duration = duration;
  }

  add() {}

  remove() {}
}