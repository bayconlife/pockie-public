const { Effect } = require("../../../effects");
const { AttackSkill, SkillCategory, SkillMethod, UserSkillResult } = require("../../util");

module.exports = class S40038 extends AttackSkill {
  category = SkillCategory.BODY;
  method = SkillMethod.MELEE;
  mpModifier = 1.7;
  probability = 30;

  onLevel(level) {}
  onUse(fight, source, target) {
    let physicalDamage = 1.4 * (1 + source.SkillAdd5 * 0.0001);

		if (source.hasEffect(Effect.GHOST)) {
      physicalDamage *= 0.3;
    }

    const damage = Math.floor(fight.getDamage(source) * physicalDamage);

    fight.attack(source, target, damage, 0);

    return UserSkillResult.SKILL_SUCCESS;
  }
}