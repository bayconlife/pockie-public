const { Effect } = require('../../../effects');
const AntibodyEffect = require('../../../effects/antibody');
const { TriggerSkill, SkillTrigger, UserSkillResult } = require("../../util");

module.exports = class Antibody extends TriggerSkill {
  trigger = SkillTrigger.START_THE_FIGHT;
  mpModifier = 0;
  probability = 100;

  onLevel(level) {}

  onUse(fight, source, target) {
    if (source.hasEffect(Effect.ANTIBODY)) {
      return UserSkillResult.SKILL_LOSE;
    }

    fight.addEffect(this.action, source, new AntibodyEffect(source));

    return UserSkillResult.SKILL_SUCCESS;
  }
}