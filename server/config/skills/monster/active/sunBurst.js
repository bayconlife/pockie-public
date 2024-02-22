const { Effect } = require("../../../effects");
const Blind = require("../../../effects/blind");
const { AttackSkill, SkillCategory, SkillMethod, UserSkillResult } = require("../../util");

module.exports = class SunBurst extends AttackSkill {
  category = SkillCategory.ILLUSION;
  method = SkillMethod.RANGED;
  mpModifier = 2.3;
  probability = 30;
	duration = 600;
	hitMultiplier = 15;

  onLevel(level) {}
  onUse(fight, source, target) {
		const duration = this.duration * (1 + source.SkillAdd8 * 0.0001);

    if (target.hasEffect(Effect.BLIND)) {
      return UserSkillResult.SKILL_LOSE;
    }
    
    fight.removeEffect(this.action, target, Effect.MUD_WALL);

    fight.addEffect(this.action, target, new Blind(target, duration, this.hitMultiplier));

    return UserSkillResult.SKILL_SUCCESS;
  }
}