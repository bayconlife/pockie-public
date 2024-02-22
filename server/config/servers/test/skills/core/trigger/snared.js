const { Effect } = require("../../../effects");
const SnaredEffect = require("../../../effects/snared");
const { TriggerSkill, SkillTrigger, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class Snared extends TriggerSkill {
  trigger = SkillTrigger.START_OF_TURN;
  category = SkillCategory.TOOL;
  mpModifier = 0;
  probability = 37;
  percentReduction = 10;

  onLevel(level) {}
  onUse(fight, source, target) {
    if (target.hasEffect(Effect.SNARED)) {
      return UserSkillResult.SKILL_LOSE;
    }
    
    const percentReduction = this.percentReduction * (1 + source.SkillAdd6 * 0.0001);

    fight.addEffect(this.action, target, new SnaredEffect(target, percentReduction));

    return UserSkillResult.SKILL_SUCCESS;
  }
}