const { TriggerSkill, SkillTrigger, UserSkillResult } = require("../../util");

module.exports = class PetRestoreChakra extends TriggerSkill {
  trigger = SkillTrigger.MELEE_TOUCH_AFTER_BEING_HIT_BY_A_SKILL;
  mpModifier = 0;
  probability = 11;

  onLevel(level) {}

  onUse(fight, source, target) {
    let recovered = source.maxChakra * 0.1;

    if (source.chakra + recovered > source.maxChakra) {
      return UserSkillResult.SKILL_LOSE;
    }

    recovered = Math.floor(recovered);
    source.chakra += recovered;

    this.action.decMp = -recovered;

    return UserSkillResult.SKILL_SUCCESS;
  }
}