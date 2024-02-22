const { Effect } = require(".");
const { CombatEffect, EffectAssociation, EffectRemoveType } = require("./util");

module.exports = class Antibody extends CombatEffect {
  removeType = EffectRemoveType.DO_NOT_REMOVE;
  association = EffectAssociation.OTHER;

  constructor(target) {
    super(target, Effect.ANTIBODY);
  }

  add() {
		this.target.resistance.duration.poison += 10;
	}

  remove() {
		this.target.resistance.duration.poison -= 10;
	}
}