const { Effect } = require("../../../effects");
const { TriggerSkill, SkillTrigger, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class WindstormArray extends TriggerSkill {
  trigger = SkillTrigger.MELEE_TOUCH_AFTER_BEING_HIT_BY_A_SKILL;
  category = SkillCategory.WIND;
  mpModifier = 1.1;
  probability = 22;
  windDamage = 1.6;

  onLevel(level) {}

  onUse(fight, source, target) {
    const windDamage = this.windDamage * (1 + source.SkillAdd4 * 0.0001);
    const damage = fight.getDamage(source) * windDamage * (1 + this.damageModifier);
    const damageToSelf = source.hasEffect(Effect.BLOODBOIL) ? Math.floor(damage * 0.2) : 0;

    fight.attack(source, target, damage, damageToSelf);

    return UserSkillResult.SKILL_SUCCESS;
  }
}