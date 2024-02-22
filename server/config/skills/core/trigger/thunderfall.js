const { Effect } = require("../../../effects");
const Paralysis = require("../../../effects/paralysis");
const { TriggerSkill, SkillTrigger, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class Thunderfall extends TriggerSkill {
  trigger = SkillTrigger.MELEE_TRIGGER_AFTER_SKILL_HIT;
  category = SkillCategory.LIGHTNING;
  mpModifier = 1;
  probability = 24;
  thunderDamage = 0.8;
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

    if (target.hasEffect(Effect.STATIC)) {
      thunderDamage *= 2 / 3;
    }

    const targetIsFrozen = target.hasEffect(Effect.FROZEN);
    const hasSubstitute = target.hasEffect(Effect.SUBSTITUTE);
    const damage = fight.getDamage(source) * thunderDamage * (1 + this.damageModifier);
    const bloodboilDamage = source.hasEffect(Effect.BLOODBOIL) ? damage * 0.2 : 0;
    const isHit = fight.attack(source, target, damage, bloodboilDamage);

    if (!isHit || hasSubstitute || target.hasEffect(Effect.STATIC)) {
      return UserSkillResult.SKILL_SUCCESS;
    }

    fight.removeEffect(this.action, target, Effect.DIZZY);
    // TODO can only apply paralysis and speed reduction 3 times, why?

    if (targetIsFrozen) {
      return UserSkillResult.SKILL_SUCCESS;
    }

    if (this.paralysisLeft > 0) {
      fight.removeEffect(this.action, target, Effect.PARALYSIS);
      fight.addEffect(this.action, target, new Paralysis(target, duration));
      this.paralysisLeft -= 1;
    }

    return UserSkillResult.SKILL_SUCCESS;
  }
}