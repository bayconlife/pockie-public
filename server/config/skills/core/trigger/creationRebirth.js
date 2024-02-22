const { Effect } = require("../../../effects");
const { TriggerSkill, SkillTrigger, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class CreationRebirth extends TriggerSkill {
  trigger = SkillTrigger.AFTER_DEATH;
  category = SkillCategory.HEALING;
  mpModifier = 4;
  probability = 100;

  onLevel(level) {}
  onUse(fight, source, target) {
    const chance = 100 - Math.pow(fight.currentTime / 200, 0.5) * 12;

    if (fight.random(0, 99) >= chance) {
      return UserSkillResult.SKILL_LOSE;
    }

    const recoverBonus = 1 + source.SkillAdd9 * 0.0001;
    let hpRecovered = source.maxHp * 0.25 * recoverBonus;

    if (source.hasEffect(Effect.GHOST)) {
      hpRecovered *= 0.3;
    }

    hpRecovered = Math.floor(Math.min(source.maxHp, hpRecovered));

    source.hp = hpRecovered;
    this.action.incHp = hpRecovered;

    return UserSkillResult.SKILL_SUCCESS;
  }
}