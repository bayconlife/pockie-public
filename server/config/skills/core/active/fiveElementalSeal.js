const { Effect } = require("../../../effects");
const ElementalSeal = require("../../../effects/elementalSeal");
const { AttackSkill, SkillCategory, SkillMethod, UserSkillResult } = require("../../util");

module.exports = class FiveElementalSeal extends AttackSkill {
  category = SkillCategory.SEALING;
  method = SkillMethod.MELEE;
  mpModifier = 2.8;
  probability = 27;
  duration = 2300;
  uses = 1;

  onLevel(level) {}
  onUse(fight, source, target) {
    let duration = this.duration * (1 + source.SkillAdd7 * 0.0001);

    if (target.hasEffect(Effect.MARK)) {
      duration *= 0.5;
    }

    const hasSubstitute = target.hasEffect(Effect.SUBSTITUTE);
    const damage = fight.getDamage(source) * (1 + this.damageModifier);
    const damageToSelf = source.hasEffect(Effect.BLOODBOIL) ? damage * 0.2 : 0;
    const isHit = fight.attack(source, target, damage, damageToSelf);

    if (!isHit || hasSubstitute) {
      return UserSkillResult.SKILL_SUCCESS;
    }

    fight.removeEffect(this.action, target, Effect.GHOST);
    fight.removeEffect(this.action, target, Effect.ELEMENTAL_SEAL);
    fight.addEffect(this.action, target, new ElementalSeal(target, Math.floor(duration)));

    return UserSkillResult.SKILL_SUCCESS;
  }
}