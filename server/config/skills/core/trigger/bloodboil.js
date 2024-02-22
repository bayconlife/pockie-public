const { Effect } = require("../../../effects");
const Warm = require("../../../effects/warm");
const { TriggerSkill, SkillTrigger, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class Bloodboil extends TriggerSkill {
  trigger = SkillTrigger.BEFORE_ATTACK;
  category = SkillCategory.FIRE;
  mpModifier = 2.3;
  probability = 32;
  duration = 2100; // 21 seconds in game time
  uses = 1;

  onLevel(level) {}
  onUse(fight, source, target) {
    const duration = this.duration * (1 + source.SkillAdd0 * 0.0001);

    if (source.getEffect(Effect.BLOODBOIL)) {
      return UserSkillResult.SKILL_LOSE;
    }

    fight.addEffect(this.action, source, new Warm(source, duration));

	return UserSkillResult.SKILL_SUCCESS;
  }
}