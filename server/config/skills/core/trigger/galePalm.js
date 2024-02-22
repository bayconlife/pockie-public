const { Effect } = require("../../../effects");
const { TriggerSkill, SkillTrigger, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class GalePalm extends TriggerSkill {
  trigger = SkillTrigger.MELEE_TRIGGER_AFTER_SKILL_HIT;
  category = SkillCategory.WIND;
  mpModifier = 1.1;
  probability = 27;
  windDamage = 1.2;

  onLevel(level) {}

  onUse(fight, source, target) {
    const windDamage = this.windDamage * (1 + source.SkillAdd4 * 0.0001);
    const damage = fight.getDamage(source) * windDamage * (1 + this.damageModifier);
    const damageToSelf = source.hasEffect(Effect.BLOODBOIL) ? damage * 0.2 : 0;

    fight.attack(source, target, damage, damageToSelf);

    return UserSkillResult.SKILL_SUCCESS;
  }
}