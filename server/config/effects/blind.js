const { Effect } = require(".");
const { CombatEffect } = require("./util");

module.exports = class Blind extends CombatEffect {
  hitMultiplier;
	
  constructor(target, duration, hitMultiplier) {
    super(target, Effect.BLIND);
    this.duration = duration;
		this.hitMultiplier = hitMultiplier
  }

  add() {
    this.fight.changeHit(this.target, this.target.stats.hit.multipler - this.hitMultiplier, this.target.stats.hit.additional);
  }

  remove() {
    this.fight.changeHit(this.target, this.target.stats.hit.multipler + this.hitMultiplier, this.target.stats.hit.additional);
  }
}