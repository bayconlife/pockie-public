const { Effect } = require(".");
const { CombatEffect, EffectAssociation } = require("./util");

module.exports = class Heal extends CombatEffect {
  association = EffectAssociation.BENEFICIAL;
  amount = 0;
  uses = 0;

  constructor(target, amount) {
    super(target, Effect.HEAL);

    this.duration = 9999999;
    this.amount = amount;
    this.uses = 0;
  }

  add() {}

  activate(action) {
    let hpRecovered = this.amount;

    if (this.target.hp + hpRecovered > this.target.maxHp) {
      hpRecovered = this.target.maxHp - this.target.hp;
    }

    hpRecovered = Math.floor(hpRecovered);

    this.target.hp += hpRecovered;
    action.incHp = hpRecovered;

    this.uses += 1;

    if (this.uses > 1) {
      this.duration = 0;
    }
  }

  remove() {}
}