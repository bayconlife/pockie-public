const { Effect } = require(".");
const { CombatEffect, EffectRemoveType } = require("./util");

module.exports = class Drain extends CombatEffect {
  removeType = EffectRemoveType.DO_NOT_REMOVE;
  drainHp = 0;
  drainMp = 0;

  constructor(target, drainHp, drainMp) {
    super(target, Effect.DRAIN);

    this.drainHp = drainHp;
    this.drainMp = drainMp;
  }

  add() {}

  activate(action) {
    let dmg = 0;
    let decChakra = 0;

    if (this.target.decDamage < 100) {
      if (this.target.hasEffect(Effect.FROZEN)) {
        dmg = this.target.maxHp * (this.drainHp / 100) * (0 - this.target.decDamage / 100);
      } else {
        dmg = this.target.maxHp * (this.drainHp / 100) * (1 - this.target.decDamage / 100);
      }
    }

    decChakra = this.target.maxChakra * (this.drainMp / 100);

    if (this.target.hasEffect(Effect.DOUBLE_MP)) {
      decChakra *= 2;
    }

    dmg = Math.floor(this.target.hp < dmg ? this.target.hp : dmg);
    decChakra = Math.floor(this.target.chakra < decChakra ? this.target.chakra : decChakra);

    this.target.chakra = Math.max(this.target.chakra - decChakra, 0);
    this.fight.damage(this.target.target, this.target, dmg);

    action.selfLastDamage = dmg;
    action.decMp = decChakra;
  }

  remove() {}
}