const { Effect } = require("../../../effects");
const { AttackSkill, SkillMethod, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class Rasengan extends AttackSkill {
  method = SkillMethod.MELEE;
  category = SkillCategory.WIND;
  mpModifier = 1.4;
  probability = 26;
  windDamage = 1.8;
  reflectedDamage = 0.3;

  onLevel(level) {}

  onUse(fight, source, target) {
    const windDamage = this.windDamage * (1 + source.SkillAdd4 * 0.0001);
    const baseDamage = fight.getDamage(source);
    const damage = baseDamage * windDamage * (1 + this.damageModifier);
    const damageToSelf = (source.hasEffect(Effect.BLOODBOIL) ? damage * 0.2 : 0) + damage * this.reflectedDamage;

    fight.attack(source, target, damage, damageToSelf);

    return UserSkillResult.SKILL_SUCCESS;
  }
}