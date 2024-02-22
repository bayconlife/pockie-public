const { Effect } = require("../../../effects");
const Posion = require("../../../effects/poison");
const { AttackSkill, SkillCategory, SkillMethod, UserSkillResult } = require("../../util");

module.exports = class Fly extends AttackSkill {
  category = SkillCategory.BODY;
  method = SkillMethod.MELEE;
  mpModifier = 2.0;
  probability = 30;

  onLevel(level) {}
  onUse(fight, source, target) {
    let physicalDamage = 2 * (1 + source.SkillAdd5 * 0.0001);

		if (source.hasEffect(Effect.GHOST)) {
      physicalDamage *= 0.3;
    }

    const damage = Math.floor(fight.getDamage(source) * physicalDamage);

    fight.attack(source, target, damage, 0);

    return UserSkillResult.SKILL_SUCCESS;
  }
}