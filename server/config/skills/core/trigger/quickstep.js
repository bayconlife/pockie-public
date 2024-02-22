const { Effect } = require("../../../effects");
const Accelerate = require("../../../effects/accelerate");
const { TriggerSkill, SkillTrigger, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class Quickstep extends TriggerSkill {
  trigger = SkillTrigger.BEFORE_ATTACK;
  category = SkillCategory.WIND;
  mpModifier = 1.1;
  probability = 20;
  damageReduce = 35;

  onLevel(level) {}
  onUse(fight, source, target) {
    let damageReduce = this.damageReduce;

    if (source.hasEffect(Effect.ACCELERATE)) {
      return UserSkillResult.SKILL_LOSE;
    }

    fight.changeNextAtkTime(target, 1); // Increase opponent attack time by 1 so that our next attack time being 1 is guarenteed to go first
    fight.addEffect(this.action, source, new Accelerate(source, damageReduce));

    return UserSkillResult.SKILL_SUCCESS;
  }
}