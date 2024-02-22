const { Effect } = require("../../../effects");
const Ghost = require("../../../effects/ghost");
const { AttackSkill, SkillCategory, SkillMethod, UserSkillResult } = require("../../util");

module.exports = class DeadDemonConsumingSeal extends AttackSkill {
  category = SkillCategory.SEALING;
  method = SkillMethod.MELEE;
  mpModifier = 3.1;
  probability = 24;
  duration = 2500;
  uses = 1;

  onLevel(level) {}
  onUse(fight, source, target) {
    let duration = this.duration * (1 + source.SkillAdd7 * 0.0001);

    if (target.hasEffect(Effect.MARK)) {
      duration *= 0.5;
    }

    const hasSubstitute = target.hasEffect(Effect.SUBSTITUTE);
    const damage = fight.getDamage(source) * (1 + this.damageModifier)
    const damageToSelf = source.hasEffect(Effect.BLOODBOIL) ? damage * 0.2 : 0;
    const isHit = fight.attack(source, target, damage, damageToSelf);

    if (!isHit || hasSubstitute) {
      return UserSkillResult.SKILL_SUCCESS;
    }

    fight.removeEffect(this.action, target, Effect.GHOST);
    fight.addEffect(this.action, target, new Ghost(target, Math.floor(duration)));

    return UserSkillResult.SKILL_SUCCESS;
  }
}