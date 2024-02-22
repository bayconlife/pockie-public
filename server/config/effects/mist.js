const { Effect } = require(".");
const { CombatEffect, EffectRemoveType, EffectAssociation } = require("./util");

module.exports = class Mist extends CombatEffect {
  removeType = EffectRemoveType.DO_NOT_REMOVE;
  association = EffectAssociation.BENEFICIAL;
  chance = 0;

  constructor(target) {
    super(target, Effect.MIST);
  }

  add() {
    this.target.priorityMultipler = 100 - 100 / (Math.pow(this.timeActive / 200, 0.5) * 0.03 + 1);
  }

  activate(action) {
    this.target.priorityMultipler = 100 - 100 / (Math.pow(this.timeActive / 200, 0.5) * 0.03 + 1);
  }

  remove() {
    this.target.priorityMultipler = 0;
  }
}