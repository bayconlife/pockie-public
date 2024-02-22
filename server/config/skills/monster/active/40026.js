const { Effect } = require("../../../effects");
const Root = require("../../../effects/root");
const { TriggerSkill, SkillTrigger, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class S40026 extends TriggerSkill {
  trigger = SkillTrigger.BEFORE_ATTACK;
  category = SkillCategory.EARTH;
  mpModifier = 3.0;
  probability = 30;

  onLevel(level) {}
  onUse(fight, source, target) {
    if (target.hasEffect(Effect.ROOT)) {
      return UserSkillResult.SKILL_LOSE;
    }

    fight.addEffect(this.action, target, new Root(target, 600));

    return UserSkillResult.SKILL_SUCCESS;
  }
}