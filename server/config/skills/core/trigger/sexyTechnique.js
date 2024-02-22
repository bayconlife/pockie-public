const { Effect } = require("../../../effects");
const Charm = require("../../../effects/charm");
const { EffectAssociation } = require("../../../effects/util");
const { TriggerSkill, SkillTrigger, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class SexyTechnique extends TriggerSkill {
  trigger = SkillTrigger.BEFORE_BEING_ATTACKED;
  category = SkillCategory.ILLUSION;
  mpModifier = 2.4;
  probability = 39;
  duration = 1500;
  uses = 1;

  onLevel(level) {}
  onUse(fight, source, target) {
    const duration = Math.floor(this.duration * (1 + source.SkillAdd8 * 0.0001));
    const validEffects = Object.keys(target.effects)
      .filter((key) => target.effects[key].association === EffectAssociation.BENEFICIAL)
      .map((key) => target.effects[key]);

    if (validEffects.length === 0) {
      return UserSkillResult.SKILL_LOSE;
    }

    if (target.hasEffect(Effect.CHARM)) {
      return UserSkillResult.SKILL_LOSE;
    }

    fight.addEffect(this.action, target, new Charm(target, duration));

    return UserSkillResult.SKILL_SUCCESS;
  }
}