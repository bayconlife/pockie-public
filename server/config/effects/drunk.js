const { Effect } = require(".");
const { CombatEffect, EffectRemoveType } = require("./util");

module.exports = class Drunk extends CombatEffect {
  removeType = EffectRemoveType.DO_NOT_REMOVE;
  hitMultiplier;
  critMultiplier;

  constructor(target, hitMultiplier, critMultiplier) {
    super(target, Effect.DRUNK);

    this.hitMultiplier = hitMultiplier;
    this.critMultiplier = critMultiplier;
  }

  add() {
    this.fight.changeHit(this.target, this.target.stats.hit.multipler - this.hitMultiplier, this.target.stats.hit.additional);
    this.target.criticalDamage += this.critMultiplier;
  }

  remove() {
    this.fight.changeHit(this.target, this.target.stats.hit.multipler + this.hitMultiplier, this.target.stats.hit.additional);
    this.target.criticalDamage -= this.critMultiplier;
  }
}