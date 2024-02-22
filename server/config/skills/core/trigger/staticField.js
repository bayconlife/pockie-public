const { Effect } = require("../../../effects");
const Static = require("../../../effects/static");
const { TriggerSkill, SkillTrigger, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class StaticField extends TriggerSkill {
  trigger = SkillTrigger.BEFORE_BEING_ATTACKED;
  category = SkillCategory.LIGHTNING;
  mpModifier = 3;
  probability = 32;
  uses = 1;
  capHp = 18;

  onLevel(level) {}
  onUse(fight, source, target) {
    const capHp = this.capHp * (1 + source.SkillAdd3 * 0.0001);

    if ( source.hasEffect(Effect.STATIC)) {
      return UserSkillResult.SKILL_LOSE;
    }

    fight.addEffect(this.action, source, new Static(source, Math.floor(capHp * source.maxHp * 0.01)));

    return UserSkillResult.SKILL_SUCCESS;
  }
}