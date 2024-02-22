const { Effect } = require("../../../effects");
const Dizzy = require("../../../effects/dizzy");
const { EffectAssociation } = require("../../../effects/util");
const { TriggerSkill, SkillTrigger, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class GiantWaterfall extends TriggerSkill {
  trigger = SkillTrigger.BEFORE_BEING_ATTACKED;
  category = SkillCategory.WATER;
  mpModifier = 1.3;
  probability = 20;
  waterDamage = 0; // Was this bugged????
  dizzyTime = 600; // 6 seconds
  uses = 3;

  onLevel(level) {}

  onUse(fight, source, target) {
    const dizzyTime = this.dizzyTime * (1 + source.SkillAdd1 * 0.0001);
    const effects = Object.keys(source.effects);

    if (effects.length === 0) {
      return UserSkillResult.SKILL_CANT_USE;
    }

    const validEffects = effects
      .filter((key) => source.effects[key].association === EffectAssociation.HARMFUL)
      .map((key) => source.effects[key]);

    if (validEffects.length === 0) {
      return UserSkillResult.SKILL_CANT_USE;
    }

    const hasSubstitute = target.hasEffect(Effect.SUBSTITUTE);
    const damage = fight.getDamage(source) * this.waterDamage;
    const isHit = fight.attack(source, target, 1, 0);

    if (isHit && !hasSubstitute) {
      if (target.hasEffect(Effect.DIZZY)) {
        fight.removeEffect(this.action, target, Effect.DIZZY);
      }

      fight.addEffect(this.action, target, new Dizzy(target, dizzyTime));

      if (target.hasEffect(Effect.BURN)) {
        fight.removeEffect(this.action, target, Effect.BURN);
      }
    }

    return UserSkillResult.SKILL_SUCCESS;
  }
}