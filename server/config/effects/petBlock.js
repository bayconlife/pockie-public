const { Effect } = require(".");
const { CombatEffect, EffectRemoveType, EffectAssociation } = require("./util");

module.exports = class PetBlock extends CombatEffect {
  removeType = EffectRemoveType.ATTACK_HIT;
  association = EffectAssociation.OTHER;

  constructor(target) {
    super(target, Effect.PET_BLOCK);
  }

  add() {
    this.target.stats.block.percent += 100;
    this.target.saveSkillId = 40006;
  }

  remove(action) {
    this.target.stats.block.percent -= 100;
    this.target.saveSkillId = 0;
  }
}