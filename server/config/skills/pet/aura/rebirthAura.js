const { Effect } = require('../../../effects');
const RebirthAuraEffect = require('../../../effects/rebirthAura');
const { TriggerSkill, SkillTrigger, UserSkillResult } = require("../../util");

module.exports = class RebirthAura extends TriggerSkill {
  trigger = SkillTrigger.START_THE_FIGHT;
  mpModifier = 0;
  probability = 100;

  onLevel(level) {}

  onUse(fight, source, target) {
    if (source.hasEffect(Effect.REBIRTH_AURA)) {
      return UserSkillResult.SKILL_LOSE;
    }

    fight.addEffect(this.action, source, new RebirthAuraEffect(source));

    return UserSkillResult.SKILL_SUCCESS;
  }
}