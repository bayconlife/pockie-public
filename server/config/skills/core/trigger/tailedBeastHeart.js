const { EffectAssociation } = require("../../../effects/util");
const { TriggerSkill, SkillTrigger, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class TailedBeastHeart extends TriggerSkill {
  trigger = SkillTrigger.BEFORE_ATTACK;
  category = SkillCategory.SEALING;
  mpModifier = 0;
  probability = 50;
  mpRecovery = 11;

  onLevel(level) {}
  onUse(fight, source, target) {
    const effects = Object.keys(source.effects);

    if (effects.length === 0) {
      return UserSkillResult.SKILL_LOSE;
    }

    const effect = source.effects[effects[fight.randomInt(0, effects.length - 1)]];

    if (effect.association !== EffectAssociation.HARMFUL) {
      return UserSkillResult.SKILL_LOSE;
    }

    fight.removeEffect(this.action, source, effect.name);

    // const validEffects = effects
    //   .filter((key) => source.effects[key].association === EffectAssociation.HARMFUL)
    //   .map((key) => source.effects[key]);

    // if (validEffects.length === 0) {
    //   return UserSkillResult.SKILL_LOSE;
    // }

    // fight.removeEffect(this.action, source, validEffects[fight.randomInt(0, validEffects.length - 1)].name);

    return UserSkillResult.SKILL_SUCCESS;
  }
}