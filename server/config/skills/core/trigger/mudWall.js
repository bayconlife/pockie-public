const { Effect } = require("../../../effects");
const Wall = require("../../../effects/wall");
const { TriggerSkill, SkillTrigger, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class MudWall extends TriggerSkill {
  trigger = SkillTrigger.BEFORE_BEING_ATTACKED;
  category = SkillCategory.EARTH;
  removeAction = true;
  mpModifier = 0;
  probability = 100; // Why not just make this 19% probablity
  chance = 19; // I think this should be passed into the effect then have it add/subtract based on if the chance happened last time

  onLevel(level) {}
  onUse(fight, source, target) {
    const chance = this.chance + (source.SkillAdd2 % 100);

    if (fight.randomInt(0, 99) >= chance) {
      return UserSkillResult.SKILL_LOSE;
    }

    if (!source.hasEffect(Effect.MUD_WALL)) {
      fight.addEffect(this.action, source, new Wall(source));

      return UserSkillResult.SKILL_SUCCESS;
    }

    return UserSkillResult.SKILL_LOSE;
  }
}