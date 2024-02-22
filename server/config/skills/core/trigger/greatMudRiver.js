const { Effect } = require("../../../effects");
const Slow = require("../../../effects/slow");
const { TriggerSkill, SkillTrigger, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class GreatMudRiver extends TriggerSkill {
  trigger = SkillTrigger.BEFORE_BEING_ATTACKED;
  category = SkillCategory.EARTH;
  mpModifier = 1.9;
  probability = 32;
  duration = 1200;
  uses = 1;

  onLevel(level) {}

  onUse(fight, source, target) {
    const duration = this.duration * (1 + source.SkillAdd2 * 0.0001);

    if (target.hasEffect(Effect.SLOW)) {
      return UserSkillResult.SKILL_LOSE;
    }

    fight.addEffect(this.action, target, new Slow(target, duration));
    fight.changeNextAtkTime(target, target.attackTime * 0.5);

    return UserSkillResult.SKILL_SUCCESS;
  }
}