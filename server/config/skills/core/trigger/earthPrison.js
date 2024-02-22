const { Effect } = require("../../../effects");
const { TriggerSkill, SkillTrigger, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class EarthPrison extends TriggerSkill {
  trigger = SkillTrigger.BEFORE_BEING_ATTACKED;
  category = SkillCategory.EARTH;
  mpModifier = 0;
  probability = 20;
  mpDrawPercent = 3;
  defenseDestroy = 50;

  onLevel(level) {}
  onUse(fight, source, target) {
    if (target.chakra <= 0) {
      return UserSkillResult.SKILL_LOSE;
    }

    const mpDraw = this.mpDrawPercent * 0.01 * target.maxChakra;
    let mpTargetLose = mpDraw;
    let mpSourceGain = mpDraw;

    if (target.hasEffect(Effect.DOUBLE_MP)) {
      // I wonder if these should actually work this way
      mpTargetLose = Math.min(mpTargetLose * 2, target.chakra);
    }

    if (source.hasEffect(Effect.DOUBLE_MP)) {
      mpSourceGain *= 0.5;
    }

    if (source.chakra + mpSourceGain > source.maxChakra) {
      mpSourceGain = source.maxChakra - source.chakra;
    }

    mpTargetLose = Math.floor(mpTargetLose);
    mpSourceGain = Math.floor(mpSourceGain);

    target.chakra -= mpTargetLose;
    source.chakra += mpSourceGain;

    this.action.decTargetMp = mpTargetLose;
    this.action.decMp = -mpSourceGain;

    fight.changeDefense(target, target.stats.defense.multipler, target.stats.defense.additional - this.defenseDestroy);

    return UserSkillResult.SKILL_SUCCESS;
  }
}