const { Effect } = require("../../../effects");
const { TriggerSkill, SkillTrigger, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class MysicalPalmTechnique extends TriggerSkill {
  trigger = SkillTrigger.MELEE_TOUCH_AFTER_BEING_HIT_BY_A_SKILL;
  category = SkillCategory.HEALING;
  mpModifier = 1.2;
  probability = 22;
  hpRecover = 11;
  uses = 3;

  onLevel(level) {}
  onUse(fight, source, target) {
    if (source.hp === source.maxHp) {
      return UserSkillResult.SKILL_LOSE;
    }

		let hpRecover = this.hpRecover * (1 + source.SkillAdd9 * 0.0001);

    if (source.hasEffect(Effect.GHOST)) {
      hpRecover *= 0.3;
    }

    let hpRecovered = Math.floor(hpRecover * 0.01 * (source.maxHp - source.hp));

    if (source.hp + hpRecovered > source.maxHp) {
      hpRecovered = source.maxHp - source.hp;
    }

    source.hp += hpRecovered;

    this.action.incHp = hpRecovered;

    fight.removeEffect(this.action, source, Effect.POISON);

    return UserSkillResult.SKILL_SUCCESS;
  }
}