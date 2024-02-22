const { Effect } = require("../../../effects");
const Drunk = require("../../../effects/drunk");
const { TriggerSkill, SkillTrigger, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class Liquor extends TriggerSkill {
  trigger = SkillTrigger.START_THE_FIGHT;
  category = SkillCategory.TOOL;
  mpModifier = 0;
  probability = 100; // This is actually set to 32 in the spreadsheet for some reason
  critMultiplier = 3;
  hitMultiplier = 12;

  onLevel(level) {}

  onUse(fight, source, target) {
    if (target.hasEffect(Effect.DRUNK)) {
      return UserSkillResult.SKILL_LOSE;
    }

    fight.addEffect(this.action, target, new Drunk(target, this.hitMultiplier, this.critMultiplier));

    return UserSkillResult.SKILL_SUCCESS;
  }
}