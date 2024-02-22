const { Effect } = require("../../../effects");
const Clay = require("../../../effects/clay");
const { TriggerSkill, SkillTrigger, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class DetonatingClay extends TriggerSkill {
  trigger = SkillTrigger.BEFORE_ATTACK;
  category = SkillCategory.EARTH;
  mpModifier = 2;
  probability = 36;
  duration = 1100;
  uses = 1;

  onLevel(level) {}
  onUse(fight, source, target) {
    const duration = Math.floor(this.duration * (1 + source.SkillAdd2 * 0.0001));

    if (target.hasEffect(Effect.DETONATING_CLAY)) {
      return UserSkillResult.SKILL_LOSE;
    }

    fight.addEffect(this.action, target, new Clay(target, duration));

    return UserSkillResult.SKILL_SUCCESS;
  }
}