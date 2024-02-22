const PetBlockEffect = require('../../../effects/petBlock');
const { TriggerSkill, SkillTrigger, UserSkillResult } = require("../../util");

module.exports = class Block extends TriggerSkill {
  trigger = SkillTrigger.BEFORE_BEING_ATTACKED;
  removeAction = true;
  mpModifier = 0;
  probability = 10;

  onLevel(level) {}

  onUse(fight, source, target) {
    fight.addEffect(this.action, source, new PetBlockEffect(source));

    return UserSkillResult.SKILL_SUCCESS;
  }
}