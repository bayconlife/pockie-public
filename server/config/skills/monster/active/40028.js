const { Effect } = require("../../../effects");
const Dizzy = require("../../../effects/dizzy");
const { AttackSkill, SkillCategory, SkillMethod, UserSkillResult } = require("../../util");

module.exports = class S40028 extends AttackSkill {
  category = SkillCategory.BODY;
  method = SkillMethod.MELEE;
  mpModifier = 2.0;
  probability = 15;

  onLevel(level) {}
  onUse(fight, source, target) {
    let physicalDamage = 2.1 * (1 + source.SkillAdd5 * 0.0001);

		if (source.hasEffect(Effect.GHOST)) {
      physicalDamage *= 0.3;
    }

    const hasSubstitute = target.hasEffect(Effect.SUBSTITUTE);
    const damage = Math.floor(fight.getDamage(source) * physicalDamage);

    const isHit = fight.attack(source, target, damage, 0);

		if (isHit && !hasSubstitute ) {
			fight.addEffect(this.action, target, new Dizzy(target, 600));
		}

    return UserSkillResult.SKILL_SUCCESS;
  }
}