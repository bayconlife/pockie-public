const { Effect } = require(".");
const { CombatEffect, EffectRemoveType } = require("./util");

module.exports = class Paralysis extends CombatEffect {
  removeType = EffectRemoveType.START_OF_TURN;
  
  constructor(target, duration) {
    super(target, Effect.PARALYSIS);
    this.duration = duration;
  }

  add(action) {
    this.fight.removeEffect(action, this.target, Effect.PARALYSIS);
    this.fight.changeNextAtkTime(this.target, this.duration);
  }
}