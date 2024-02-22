const { Effect } = require(".");
const { CombatEffect, EffectRemoveType, EffectAssociation } = require("./util");

module.exports = class Wall extends CombatEffect {
  removeType = EffectRemoveType.ATTACK_HIT;
  association = EffectAssociation.OTHER;

  constructor(target) {
    super(target, Effect.MUD_WALL);
  }

  add() {
    this.target.stats.block.percent += 60;
    this.target.rebound += 60;
    this.target.saveSkillId = 3806;
  }

  remove(action) {
    this.target.stats.block.percent -= 60;
    this.target.rebound -= 60;
    this.target.saveSkillId = 0;
  }
}
