const { Effect } = require('../../../effects');
const AntibodyEffect = require('../../../effects/antibody');
const { TriggerSkill, SkillTrigger, UserSkillResult } = require("../../util");

module.exports = class Sacrifice extends TriggerSkill {
  trigger = SkillTrigger.AFTER_AURA;
  mpModifier = 0;
  probability = 100;

  onLevel(level) {}

  onUse(fight, source, target) {
    if (!source.hasEffect(Effect.REBIRTH_AURA)) {
      return UserSkillResult.SKILL_LOSE;
    }

    const rebirthAura = source.getEffect(Effect.REBIRTH_AURA);

		if (rebirthAura !== null) {
			rebirthAura.percent += 15;
		}

    return UserSkillResult.SKILL_SUCCESS;
  }
}