const { Effect } = require("../../effects");
const WarmHeartEffect = require('../../effects/items/warmHeart');
const { TriggerSkill, SkillTrigger, SkillCategory, UserSkillResult } = require("../util");

module.exports = class WarmHeart extends TriggerSkill {
  trigger = SkillTrigger.START_THE_FIGHT;
  category = SkillCategory.INVALID;
  mpModifier = 0;
  probability = 100;

  onLevel(level) {}

  onUse(fight, source, target) {
		if (source.hasEffect(Effect.WARM_HEART)) {
			return UserSkillResult.SKILL_LOSE;
		}

		fight.addEffect(this.action, source, new WarmHeartEffect(source));

    return UserSkillResult.SKILL_SUCCESS;
  }
}