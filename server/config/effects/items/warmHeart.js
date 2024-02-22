const { Effect } = require("../");
const { CombatEffect, EffectRemoveType, FightStatType, EffectAssociation } = require("../util");

module.exports = class WarmHeart extends CombatEffect {
	association = EffectAssociation.OTHER;
  removeType = EffectRemoveType.DURATION;
  duration = 0;
	uses = 2;

  constructor(target) {
    super(target, Effect.WARM_HEART);
		this.duration = 9999999;
  }

  activate(action) {
    if (this.fight.randomInt(0, 99) > 30) {
      return;
    }
		
    const effects = Object.keys(this.target.effects);
		const validEffects = effects
      .filter((key) => this.target.effects[key].association === EffectAssociation.HARMFUL)
      .map((key) => this.target.effects[key]);

    if (validEffects.length === 0) {
      return;
    }

    this.fight.removeEffect(action, this.target, validEffects[this.fight.randomInt(0, validEffects.length - 1)].name);
		this.uses -= 1;

		if (this.uses <= 0) {
			this.duration = 0;
		}
  }
}