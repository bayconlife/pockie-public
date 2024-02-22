const { Effect } = require(".");
const { CombatEffect, EffectRemoveType } = require("./util");

module.exports = class DoubleMp extends CombatEffect {
  removeType = EffectRemoveType.DO_NOT_REMOVE;

  constructor(target, duration) {
    super(target, Effect.DOUBLE_MP);
  }

  add() {}

  remove() {}
}