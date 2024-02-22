const { Effect } = require("../../../effects");
const SnaredEffect = require("../../../effects/snared");
const { TriggerSkill, SkillTrigger, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class Snared extends TriggerSkill {
  trigger = SkillTrigger.BEFORE_ATTACK;
  category = SkillCategory.TOOL;
  mpModifier = 0;
  probability = 37;
  dodgeReduction = 25;

  onLevel(level) {}
  onUse(fight, source, target) {
    if (target.hasEffect(Effect.SNARED)) {
      return UserSkillResult.SKILL_LOSE;
    }

    fight.addEffect(this.action, target, new SnaredEffect(target, this.dodgeReduction));

    return UserSkillResult.SKILL_SUCCESS;
  }
}