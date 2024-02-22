const { Effect } = require(".");
const { CombatEffect, EffectRemoveType, FightStatType } = require("./util");

module.exports = class Slow extends CombatEffect {
  removeType = EffectRemoveType.DURATION;
  slowRate = 0;

  constructor(target, duration) {
    super(target, Effect.SLOW);

    this.duration = duration;
  }

  add(action) {
    this.fight.changeAtkTime(this.target, this.target.stats.attackTime.multipler - 50, this.target.stats.attackTime.additional);

    this.fight.changeStat(action, {
      stat: FightStatType.SPEED,
      index: this.target.index,
      value: this.target.stats.attackTime.modified,
    });
  }

  remove(action) {
    this.fight.changeAtkTime(this.target, this.target.stats.attackTime.multipler + 50, this.target.stats.attackTime.additional);

    this.fight.changeStat(action, {
      stat: FightStatType.SPEED,
      index: this.target.index,
      value: this.target.stats.attackTime.modified,
    });
  }
}