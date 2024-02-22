const { Effect } = require("../../../effects");
const Cloud = require("../../../effects/cloud");
const { TriggerSkill, SkillTrigger, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class FlyingThunderGod extends TriggerSkill {
  trigger = SkillTrigger.BEFORE_ATTACK;
  category = SkillCategory.LIGHTNING;
  mpModifier = 0; // FTG can switch when mp is 0
  probability = 100;

  onLevel(level) {}
  onUse(fight, source, target) {
    if (!source.hasEffect(Effect.CLOUD) && !target.hasEffect(Effect.CLOUD)) {
      const BaseMPCost = (200 + 20 * (this.level - 1) * (1 + ((20 + this.level - 1 + Math.round(this.level / 3 + 1) * 8 + ((Math.round((this.level - 1) / 10) * 7 + 14) / 3) * 8) / 12) * 0.01)) / 30;
      let mpCost = Math.floor(BaseMPCost * 3.8 * 2);
  
      if (source.hasEffect(Effect.DOUBLE_MP)) {
        mpCost *= 2;
      }
  
      if (source.chakra < mpCost) {
        return UserSkillResult.SKILL_NO_MANA;
      }

      fight.useChakra(this.action, source, mpCost);
      fight.addEffect(this.action, target, new Cloud(target));

      return UserSkillResult.SKILL_SUCCESS;
    } else if (fight.randomInt(0, 99) < 30) {
      if (target.hasEffect(Effect.CLOUD)) {
        fight.removeEffect(this.action, target, Effect.CLOUD);
        fight.addEffect(this.action, source, new Cloud(source));
      } else {
        fight.removeEffect(this.action, source, Effect.CLOUD);
        fight.addEffect(this.action, target, new Cloud(target));
      }
			
      return UserSkillResult.SKILL_SUCCESS;
    }

    return UserSkillResult.SKILL_LOSE;
  }
}