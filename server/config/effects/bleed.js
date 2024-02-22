const { Effect } = require(".");
const { CombatEffect, EffectRemoveType, EffectAssociation } = require("./util");

module.exports = class Bleed extends CombatEffect {
  removeType = EffectRemoveType.START_OF_TURN;
	association = EffectAssociation.HARMFUL;
  
  constructor(target) {
    super(target, Effect.BLEED);
  }

  add() {}

  activate(action) {
    action.selfLastDamage = this.fight.damageWithReduction(this.target.target, this.target, this.target.hp * 0.1);
  }

  remove() {}
}