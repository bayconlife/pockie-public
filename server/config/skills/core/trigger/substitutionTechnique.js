const { Effect } = require("../../../effects");
const Substitute = require("../../../effects/substitute");
const { TriggerSkill, SkillTrigger, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class SubstitutionTechnique extends TriggerSkill {
  trigger = SkillTrigger.BEFORE_BEING_ATTACKED;
  category = SkillCategory.ILLUSION;
  removeAction = true;
  mpModifier = 0;
  probability = 100;
  chance = 17;

  onLevel(level) {}
  onUse(fight, source, target) {
    const chance = this.chance * (1 + source.SkillAdd8 * 0.0001);

    if (fight.random(0, 99) >= chance) {
      return UserSkillResult.SKILL_LOSE;
    }

    const burn = target.getEffect(Effect.BURN);

    if (burn === null) {
      fight.addEffect(this.action, source, new Substitute(source, false))
    } else {
      fight.addEffect(this.action, source, new Substitute(source, true, burn.damage));
    }

    return UserSkillResult.SKILL_SUCCESS;
  }
}