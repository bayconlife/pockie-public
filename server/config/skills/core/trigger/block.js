const { Effect } = require('../../../effects');
const BlockEffect = require('../../../effects/block');
const { TriggerSkill, SkillTrigger, UserSkillResult } = require("../../util");

module.exports = class Block extends TriggerSkill {
  trigger = SkillTrigger.BEFORE_BEING_ATTACKED;
  removeAction = true;
  mpModifier = 0;
  probability = 100;

  onLevel(level) {}

  onUse(fight, source, target) {
    const chance = Math.max((source.parry - target.pierce) / 16, 0);

    if (fight.random(0, 99) < chance) {
      fight.addEffect(this.action, source, new BlockEffect(source));
      fight.changeNextAtkTime(target, target.attackTime * 0.6);

      return UserSkillResult.SKILL_SUCCESS;
    }

    return UserSkillResult.SKILL_LOSE;
  }
}