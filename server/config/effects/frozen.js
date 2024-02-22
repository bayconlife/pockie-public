const { Effect } = require(".");
const Thaw = require("./thaw");
const { CombatEffect, EffectRemoveType } = require("./util");

module.exports = class Frozen extends CombatEffect {
  removeType = EffectRemoveType.ATTACK_HIT;
  breakBonus = 0;

  constructor(target, breakBonus) {
    super(target, Effect.FROZEN);
    this.breakBonus = breakBonus;
  }

  add() {
    this.target.canAttack -= 1;
    this.target.canUseSkill -= 1;
    this.target.decDamage -= this.breakBonus - 100; // In crystal blade they are passing 200 to signify 2x damage, then subtracting 100 to make the modifier work with calculatePercentDamageReduction function
  }

  remove(action) {
    this.target.canAttack += 1;
    this.target.canUseSkill += 1;
    this.target.decDamage += this.breakBonus - 100;

    
    this.fight.addEffect(action, this.target, new Thaw(this.target));
  }
}