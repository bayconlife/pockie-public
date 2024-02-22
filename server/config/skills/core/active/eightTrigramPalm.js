const { Effect } = require("../../../effects");
const DoubleMp = require("../../../effects/doubleMp");
const { AttackSkill, SkillMethod, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class EightTrigramPalm extends AttackSkill {
  method = SkillMethod.MELEE;
  category = SkillCategory.BODY;
  mpModifier = 0;
  probability = 28;
  vesselDestroyTime = 1.5;

  onLevel(level) {}

  onUse(fight, source, target) {
    let vesselDestroyTime = this.vesselDestroyTime * (1 + source.SkillAdd5 * 0.0001);

    if (source.hasEffect(Effect.GHOST)) {
      vesselDestroyTime *= 0.3;
    }

    const hasSubstitute = target.hasEffect(Effect.SUBSTITUTE);
    const damage = fight.getDamage(source) * vesselDestroyTime;
    const isHit = fight.attack(source, target, damage, 0);

    if (isHit && !hasSubstitute && !target.hasEffect(Effect.DOUBLE_MP)) {
      fight.addEffect(this.action, target, new DoubleMp(target, this.vesselDestroyTime));
    }

    return UserSkillResult.SKILL_SUCCESS;
  }
}