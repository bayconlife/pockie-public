const { Effect } = require("./");
const { CombatEffect } = require("../../../effects/util");

module.exports = class Snared extends CombatEffect {
  percentReduction = 10;
  
  constructor(target, percentReduction) {
    super(target, Effect.SNARED);

    this.duration = 0;
    this.percentReduction = percentReduction;
  }

  add() {
    this.fight.changeDodge(this.target, this.target.stats.dodge.multipler - this.percentReduction, this.target.stats.defense.additional);
    this.fight.changeBlock(this.target, this.target.stats.dodge.multipler - this.percentReduction, this.target.stats.defense.additional);
  }

  activate(action) {}

  remove() {
    this.fight.changeDodge(this.target, this.target.stats.dodge.multipler + this.percentReduction, this.target.stats.defense.additional);
    this.fight.changeBlock(this.target, this.target.stats.dodge.multipler + this.percentReduction, this.target.stats.defense.additional);
  }
}
