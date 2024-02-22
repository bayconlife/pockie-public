const { Effect } = require(".");
const { CombatEffect, EffectAssociation, EffectRemoveType } = require("./util");

module.exports = class RebirthAura extends CombatEffect {
  removeType = EffectRemoveType.DO_NOT_REMOVE;
  association = EffectAssociation.OTHER;
	percent = 0;

  constructor(target) {
    super(target, Effect.REBIRTH_AURA);
  }

  add() {	}

	activate(action) {
		if(this.target.hp < this.target.maxHp * 0.2 && this.percent !== 0) {
			const hpRecovered = Math.floor(this.target.maxHp * this.percent * 0.01);

			this.target.hp += hpRecovered;
			action.incHp = hpRecovered;

			this.fight.removeEffect(action, this.target, Effect.REBIRTH_AURA);
    }
	}

  remove() { }
}