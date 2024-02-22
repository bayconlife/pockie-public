const { Effect } = require(".");
const Burn = require("./burn");
const { CombatEffect, EffectRemoveType, EffectAssociation } = require("./util");

 module.exports = class Substitute extends CombatEffect {
  removeType = EffectRemoveType.ATTACK_HIT;
  association = EffectAssociation.OTHER;
  applyBurning = false;
  burnDamage = 0;

  constructor(target, applyBurning, burnDamage = 0) {
    super(target, Effect.SUBSTITUTE);

    this.applyBurning = applyBurning;
    this.burnDamage = burnDamage;
  }

  add() {
    this.target.stats.block.percent += 100;
    this.target.saveSkillId = 3826;
  }

  remove(action) {
    if (this.applyBurning) {
      this.fight.addEffect(action, this.target, new Burn(this.target, this.burnDamage, 2));
    }

    this.target.stats.block.percent -= 100;
    this.target.saveSkillId = 0;
  }
}