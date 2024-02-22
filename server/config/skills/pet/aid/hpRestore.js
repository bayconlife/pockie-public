const { TriggerSkill, SkillTrigger, UserSkillResult } = require("../../util");

module.exports = class HpRestore extends TriggerSkill {
  trigger = SkillTrigger.MELEE_TOUCH_AFTER_BEING_HIT_BY_A_SKILL;
  mpModifier = 0;
  probability = 11;

  onLevel(level) {}

  onUse(fight, source, target) {
    let recovered = source.maxHp * 0.1;

    // TODO: Balance discussion about this.
    if (source.hp + recovered > source.maxHp) {
      return UserSkillResult.SKILL_LOSE;
    }

    recovered = Math.floor(recovered);
    source.hp += recovered;

    this.action.incHp = recovered;

    return UserSkillResult.SKILL_SUCCESS;
  }
}