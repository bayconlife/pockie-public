const { SkillTrigger, TriggerSkill, UserSkillResult } = require("../../util");

module.exports = class PetBasicAttack extends TriggerSkill {
  trigger = SkillTrigger.PET_TRIGGER_AFTER_SKILL_HIT;
  mpModifier = 0;
  probability = 21;

  onLevel(level) {}

  onUse(fight, source, target) {
    fight.attack(source, target, Math.ceil(fight.getDamage(source) * 0.75), 0);
    return UserSkillResult.SKILL_SUCCESS;
  }
}
