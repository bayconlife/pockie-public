const { Effect } = require("../../../effects");
const { AttackSkill, SkillMethod, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class ChakraBlade extends AttackSkill {
  method = SkillMethod.MELEE;
  category = SkillCategory.HEALING;
  mpModifier = 1;
  probability = 24;
  mpBurn = 15;

  onLevel(level) {}

  onUse(fight, source, target) {
    let mpBurn = this.mpBurn;

    if (source.hasEffect(Effect.GHOST)) {
      mpBurn *= 0.3;
    }

    if (target.hasEffect(Effect.DOUBLE_MP)) {
      mpBurn *= 2;
    }

    const hasSubstitute = target.hasEffect(Effect.SUBSTITUTE);
    const damage = Math.floor(fight.getDamage(source) * (1 + this.damageModifier));
    const damageToSelf = source.hasEffect(Effect.BLOODBOIL) ? Math.floor(damage * 0.2) : 0;
    const isHit = fight.attack(source, target, damage, damageToSelf);

    if (isHit && !hasSubstitute) {
      let mpReduced = mpBurn * 0.01 * source.maxChakra;

      if (mpReduced > target.chakra) {
        mpReduced = target.chakra;
      }

      target.chakra -= Math.floor(mpReduced);
      this.action.decTargetMp = mpReduced;
    }

    return UserSkillResult.SKILL_SUCCESS;
  }
}