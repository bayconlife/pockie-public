const { Effect } = require("../../../effects");
const Drain = require("../../../effects/drain");
const { TriggerSkill, SkillTrigger, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class DeathMirageJutsu extends TriggerSkill {
  trigger = SkillTrigger.MELEE_TRIGGER_AFTER_SKILL_HIT;
  category = SkillCategory.ILLUSION;
  mpModifier = 0.9;
  probability = 28;
  drainHp = 6;
  drainMp = 6;

  onLevel(level) {}

  onUse(fight, source, target) {
    let drainHp = this.drainHp;
    let drainMp = this.drainMp;

    if (source.hasEffect(Effect.GHOST)) {
      drainHp *= 0.3;
      drainMp *= 0.3;
    }

    if (target.hasEffect(Effect.DRAIN)) {
      return UserSkillResult.SKILL_LOSE;
    }

    fight.addEffect(this.action, target, new Drain(target, drainHp, drainMp));

    return UserSkillResult.SKILL_SUCCESS;
  }
}