const { Effect } = require(".");
const { CombatEffect } = require("./util");

module.exports = class Snared extends CombatEffect {
  dodgeReduction = 0;

  constructor(target, dodgeReduction) {
    super(target, Effect.SNARED);

    this.duration = 0;
    this.dodgeReduction = dodgeReduction;
  }

  add() {
    this.fight.changeDodge(this.target, this.target.stats.dodge.multipler, this.target.stats.defense.additional - this.dodgeReduction);
  }

  activate(action) {}

  remove() {
    this.fight.changeDodge(this.target, this.target.stats.dodge.multipler, this.target.stats.defense.additional + this.dodgeReduction);
  }
}
