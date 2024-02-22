const { Effect } = require("../../../effects");
const { AttackSkill, SkillCategory, SkillMethod, UserSkillResult } = require("../../util");

module.exports = class S40024 extends AttackSkill {
  category = SkillCategory.BODY;
  method = SkillMethod.MELEE;
  mpModifier = 2.0;
  probability = 30;

  onLevel(level) {}
  onUse(fight, source, target) {
    let physicalDamage = 1.0 * (1 + source.SkillAdd5 * 0.0001);

		if (source.hasEffect(Effect.GHOST)) {
      physicalDamage *= 0.3;
    }

		const r = fight.randomInt(0, 99);
    let damage = Math.floor(fight.getDamage(source) * physicalDamage);

		if(r < 60) {
			damage *= 2;
		} else {
			damage *= 3;
		}

    fight.attack(source, target, damage, 0);

    return UserSkillResult.SKILL_SUCCESS;
  }
}