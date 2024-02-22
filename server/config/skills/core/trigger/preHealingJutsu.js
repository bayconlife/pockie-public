const { Effect } = require("../../../effects");
const Heal = require("../../../effects/heal");
const { TriggerSkill, SkillTrigger, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class PreHealingJutsu extends TriggerSkill {
  trigger = SkillTrigger.AFTER_BEING_HURT;
  category = SkillCategory.HEALING;
  mpModifier = 0.6;
  probability = 31;
  hpRecover = 3;
  uses = 3;

  onLevel(level) {}
  onUse(fight, source, target) {
    if (source.hasEffect(Effect.HEAL)) {
      return UserSkillResult.SKILL_LOSE;
    }

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

    fight.removeEffect(this.action, source, Effect.POISON);
    fight.removeEffect(this.action, source, Effect.HEAL);
    fight.addEffect(this.action, source, new Heal(source, hpRecovered));

    return UserSkillResult.SKILL_SUCCESS;
  }
}