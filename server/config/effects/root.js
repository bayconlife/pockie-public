const { Effect } = require(".");
const { CombatEffect } = require("./util");

module.exports = class Root extends CombatEffect {

  constructor(target, duration) {
    super(target, Effect.ROOT);

    this.duration = duration;
  }

  add() {
    this.target.canAttack -= 1;
    this.fight.changeDodge(this.target, this.target.stats.dodge.multipler - 100, this.target.stats.defense.additional);
  }

  activate(action) {
		let dmg = 0;

    if (this.target.decDamage < 100) {
      if (this.target.hasEffect(Effect.FROZEN)) {
        dmg = this.target.maxHp * 0.05 * (0 - this.target.decDamage / 100);
      } else {
        dmg = this.target.maxHp * 0.05 * (1 - this.target.decDamage / 100);
      }
    } else {
      dmg = 0;
    }

    dmg = Math.floor(dmg);

    this.fight.damage(this.target.target, this.target, dmg);
    action.selfLastDamage = dmg;
	}

  remove() {
    this.fight.changeDodge(this.target, this.target.stats.dodge.multipler + 100, this.target.stats.defense.additional);
    this.target.canAttack += 1;
  }
}
