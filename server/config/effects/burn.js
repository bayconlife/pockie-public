const { Effect } = require(".");
const { CombatEffect } = require("./util");

module.exports = class Burn extends CombatEffect {
  damage;
  count;

  constructor(target, damage, count) {
    super(target, Effect.BURN);

    this.duration = 9999999;
    this.damage = damage;
    this.count = count;
  }

  add() {}

  activate(action) {
    let dmg = 0;

    if (this.target.decDamage < 100) {
      if (this.target.hasEffect(Effect.FROZEN)) {
        dmg = this.damage * (0 - this.target.decDamage / 100);
      } else {
        dmg = this.damage * (1 - this.target.decDamage / 100);
      }
    } else {
      dmg = 0;
    }

    dmg = Math.floor(dmg);

    this.fight.damage(this.target.target, this.target, dmg);
    action.selfLastDamage = dmg;
    this.count -= 1;

    if (this.count < 1) {
      this.duration = 0;
    }
  }

  remove() {}
}