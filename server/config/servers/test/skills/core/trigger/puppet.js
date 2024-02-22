const { Effect } = require("../../../effects");
const Poison = require("../../../effects/poison");
const { TriggerSkill, SkillTrigger, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class Puppet extends TriggerSkill {
  trigger = SkillTrigger.MELEE_TRIGGER_AFTER_SKILL_HIT;
  category = SkillCategory.TOOL;
  mpModifier = 0;
  probability = 33;
  damageModifier = 0.6;
  poisonDuration = 2000;
  poisonUses = 2;
  poisonPercentage = 3;

  onLevel(level) {}

  onUse(fight, source, target) {
    const hasSubstitute = target.hasEffect(Effect.SUBSTITUTE);
    const damage = Math.floor(fight.getDamage(source) * this.damageModifier);
    const isHit = fight.attack(source, target, damage, 0);
    const poisonPercentage = this.poisonPercentage * (1 + source.SkillAdd6 * 0.0001);

    if (isHit && !hasSubstitute && this.poisonUses > 0) {
      this.poisonUses -= 1;
      fight.addEffect(this.action, target, new Poison(target, this.poisonDuration, poisonPercentage));
    }

    return UserSkillResult.SKILL_SUCCESS;
  }
}