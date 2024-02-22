const { Effect } = require("../../../effects");
const Bleed = require("../../../effects/bleed");
const { SkillTrigger, TriggerSkill, UserSkillResult } = require("../../util");

module.exports = class VampireBite extends TriggerSkill {
  trigger = SkillTrigger.PET_TRIGGER_AFTER_SKILL_HIT;
  mpModifier = 0;
  probability = 19;

  onLevel(level) {}

  onUse(fight, source, target) {
    source.stats.vampiricHp += 0.5;
    fight.attack(source, target, fight.getDamage(source) * 0.5, 0);
    source.stats.vampiricHp -= 0.5;

    return UserSkillResult.SKILL_SUCCESS;
  }
}
