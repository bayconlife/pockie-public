const { Effect } = require("../../../effects");
const Bleed = require("../../../effects/bleed");
const { SkillTrigger, TriggerSkill, UserSkillResult } = require("../../util");

module.exports = class PetBasicAttack extends TriggerSkill {
  trigger = SkillTrigger.PET_TRIGGER_AFTER_SKILL_HIT;
  mpModifier = 0;
  probability = 21;

  onLevel(level) {}

  onUse(fight, source, target) {
    const isHit = fight.attack(source, target, fight.getDamage(source) * 0.75, 0);

    if(isHit && !target.hasEffect(Effect.BLEED)) {
			fight.addEffect(this.action, target, new Bleed(target));
    }

    return UserSkillResult.SKILL_SUCCESS;
  }
}
