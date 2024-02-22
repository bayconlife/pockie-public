const { Effect } = require("../../../effects");
const { TriggerSkill, SkillTrigger, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class S40020 extends TriggerSkill {
  trigger = SkillTrigger.AFTER_BEING_HURT;
  category = SkillCategory.HEALING;
  mpModifier = 2.0;
  probability = 300;
  hpRecover = 10;

  onLevel(level) {}
  onUse(fight, source, target) {
    let hpRecover = this.hpRecover * (1 + source.SkillAdd9 * 0.0001);
    let hpRecovered = hpRecover * 0.01 * source.maxHp;

    if (source.hasEffect(Effect.GHOST)) {
      hpRecover *= 0.3;
      hpRecovered *= 0.3;
    }

    if (source.hp === source.maxHp) {
      return UserSkillResult.SKILL_LOSE;
    }

    if (source.hp + hpRecovered > source.maxHp) {
      hpRecovered = source.maxHp - source.hp;
    }

    hpRecovered = Math.floor(hpRecovered);

    source.hp += hpRecovered;

    this.action.incHp = hpRecovered;

    return UserSkillResult.SKILL_SUCCESS;
  }
}