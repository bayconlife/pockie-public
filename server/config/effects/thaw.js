const { Effect } = require(".");
const { CombatEffect, EffectRemoveType } = require("./util");

module.exports = class Thaw extends CombatEffect {
  duration = 600;

  constructor(target) {
    super(target, Effect.THAW);
  }

  add() {}

  remove() {}
}