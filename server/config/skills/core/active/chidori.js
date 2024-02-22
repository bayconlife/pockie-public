const { Effect } = require("../../../effects");
const Paralysis = require("../../../effects/paralysis");
const { AttackSkill, SkillCategory, SkillMethod, UserSkillResult } = require("../../util");

module.exports = class Chidori extends AttackSkill {
  category = SkillCategory.LIGHTNING;
  method = SkillMethod.MELEE;
  mpModifier = 2;
  probability = 17;
  thunderDamage = 1.6;
  duration = 350;
  paralysisLeft = 3;

  onLevel(level) {}
  onUse(fight, source, target) {
    let thunderDamage = this.thunderDamage * (1 + source.SkillAdd3 * 0.0001);
    let duration = this.duration;

    if (source.hasEffect(Effect.STATIC)) {
      thunderDamage *= 1.2;
      duration *= 1.2;
    }

    if (source.hasEffect(Effect.THUNDER)) {
      thunderDamage += 0.15;
    }

    let damage = fight.getDamage(source) * thunderDamage * (1 + this.damageModifier);

    // This code is weird in the original and I think it has a bug compared to what it is supposed to do.
    // I am going to change it so that if there is static shield it does 1/3 less damage
    // TODO review
    if (target.hasEffect(Effect.STATIC)) {
      damage = (damage * 2) / 3;
    }

    const targetIsFrozen = target.hasEffect(Effect.FROZEN);
    const hasSubstitute = target.hasEffect(Effect.SUBSTITUTE);
    const bloodboilDamage = source.hasEffect(Effect.BLOODBOIL) ? damage * 0.2 : 0;
    const isHit = fight.attack(source, target, damage, bloodboilDamage);

    if (!isHit || hasSubstitute || target.hasEffect(Effect.STATIC)) {
      return UserSkillResult.SKILL_SUCCESS;
    }

    fight.removeEffect(this.action, target, Effect.DIZZY);

    if (targetIsFrozen) {
      return UserSkillResult.SKILL_SUCCESS;
    }

    if (this.paralysisLeft > 0) {
      this.paralysisLeft -= 1;
      
      fight.removeEffect(this.action, target, Effect.PARALYSIS);
      fight.addEffect(this.action, target, new Paralysis(target, duration));
    }

    return UserSkillResult.SKILL_SUCCESS;
  }
}