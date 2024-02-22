const { Effect } = require("../../../effects");
const Poison = require("../../../effects/poison");
const { AttackSkill, SkillCategory, SkillMethod, UserSkillResult } = require("../../util");

module.exports = class String extends AttackSkill {
  category = SkillCategory.BODY;
  method = SkillMethod.MELEE;
  mpModifier = 1.5;
  probability = 30;

  onLevel(level) {}
  onUse(fight, source, target) {
    let physicalDamage = 1.2 * (1 + source.SkillAdd5 * 0.0001);

		if (source.hasEffect(Effect.GHOST)) {
      physicalDamage *= 0.3;
    }

    const damage = Math.floor(fight.getDamage(source) * physicalDamage);
    const isHit = fight.attack(source, target, damage, 0);

		if (isHit && !target.hasEffect(Effect.POISON)) {
    	fight.addEffect(this.action, target, new Poison(target, 60000));
		}

    return UserSkillResult.SKILL_SUCCESS;
  }
}