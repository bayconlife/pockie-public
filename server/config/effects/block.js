const { Effect } = require(".");
const { CombatEffect, EffectRemoveType, EffectAssociation } = require("./util");

module.exports = class Block extends CombatEffect {
  removeType = EffectRemoveType.ATTACK_HIT;
  association = EffectAssociation.OTHER;

  constructor(target) {
    super(target, Effect.BLOCK);
  }

  add() {
    this.target.stats.block.percent += 40;
    this.target.saveSkillId = 7777;
  }

  remove(action) {
    this.target.stats.block.percent -= 40;
    this.target.saveSkillId = 0;
  }
}