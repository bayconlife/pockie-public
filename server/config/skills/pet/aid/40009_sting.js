const { Effect } = require("../../../effects");
const Poison = require("../../../effects/poison");
const { SkillTrigger, TriggerSkill, UserSkillResult } = require("../../util");

module.exports = class PetBasicAttack extends TriggerSkill {
  trigger = SkillTrigger.PET_TRIGGER_AFTER_SKILL_HIT;
  mpModifier = 0;
  probability = 21;

  onLevel(level) {}

  onUse(fight, source, target) {
    const isHit = fight.attack(source, target, fight.getDamage(source) * 0.75, 0);

    if(isHit == 1 && !target.hasEffect(Effect.POISON)) {
			fight.addEffect(this.action, target, new Poison(target, 6000));
    }

    return UserSkillResult.SKILL_SUCCESS;
  }
}
