const { Effect } = require("../../../effects");
const Posion = require("../../../effects/poison");
const { AttackSkill, SkillCategory, SkillMethod, UserSkillResult } = require("../../util");

module.exports = class SwordLightHit extends AttackSkill {
  category = SkillCategory.BODY;
  method = SkillMethod.MELEE;
  mpModifier = 3.0;
  probability = 30;

  onLevel(level) {}
  onUse(fight, source, target) {
    let physicalDamage = 1.0 * (1 + source.SkillAdd5 * 0.0001);

		if (source.hasEffect(Effect.GHOST)) {
      physicalDamage *= 0.3;
    }

		const r = fight.randomInt(0, 99);
    let damage = Math.floor(fight.getDamage(source) * physicalDamage);

		if(r < 34) {
			damage *= 2;
		} else if(r < 67) {
			damage *= 3;
		} else {
			damage *= 4;
		}

    fight.attack(source, target, damage, 0);

    return UserSkillResult.SKILL_SUCCESS;
  }
}