const { Effect } = require(".");
const { EffectRemoveType, EffectAssociation, CombatEffect } = require("./util");

module.exports = class SunsetEffect extends CombatEffect {
  removeType = EffectRemoveType.DO_NOT_REMOVE;
  association = EffectAssociation.BENEFICIAL;
  chance = 0;

  constructor(target) {
    super(target, Effect.SUNSET);
  }

  add() {
    this.chance = Math.pow(this.timeActive / 200, 0.5) * 3;
  }

  activate(action) {
    this.chance = Math.pow(this.timeActive / 200, 0.5) * 3;
  }
}