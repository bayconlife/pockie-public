const { Effect } = require(".");
const { CombatEffect, EffectAssociation, EffectRemoveType, FightStatType } = require("./util");

module.exports = class DoorFour extends CombatEffect {
  association = EffectAssociation.BENEFICIAL;
  removeType = EffectRemoveType.DO_NOT_REMOVE;

  constructor(target, duration) {
    super(target, Effect.DOOR_FOUR);

    this.duration = 9999999;
  }

  add(action) {
    this.fight.changeAtkTime(this.target, this.target.stats.attackTime.multipler + 40, this.target.stats.attackTime.additional);

    this.fight.changeStat(action, {
      stat: FightStatType.SPEED,
      index: this.target.index,
      value: this.target.stats.attackTime.modified,
    });
  }

  remove(action) {
    this.fight.changeAtkTime(this.target, this.target.stats.attackTime.multipler - 40, this.target.stats.attackTime.additional);

    this.fight.changeStat(action, {
      stat: FightStatType.SPEED,
      index: this.target.index,
      value: this.target.stats.attackTime.modified,
    });
  }
}