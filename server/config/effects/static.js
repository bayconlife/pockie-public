const { Effect } = require(".");
const { CombatEffect, EffectRemoveType, EffectAssociation, FightStatType } = require("./util");

module.exports = class Static extends CombatEffect {
  removeType = EffectRemoveType.DO_NOT_REMOVE;
  association = EffectAssociation.BENEFICIAL;
  amount = 0;

  constructor(target, amount) {
    super(target, Effect.STATIC);

    this.amount = amount;
  }

  add(action) {
    this.target.stats.shield = this.amount;
    this.fight.changeStat(action, {
      stat: FightStatType.SHIELD,
      index: this.target.index,
      value: this.amount,
    });
  }

  remove() {
    // this.target.hit += 50;
    this.target.stats.shield = 0;
  }
}