const { Effect } = require("../../../effects");
const Dizzy = require("../../../effects/dizzy");
const { AttackSkill, SkillCategory, SkillMethod, UserSkillResult } = require("../../util");

module.exports = class GreatStrength extends AttackSkill {
  category = SkillCategory.BODY;
  method = SkillMethod.MELEE;
  mpModifier = 0;
  probability = 15;
  physicalDamage = 1;
  bonusDamage = 7;
  duration = 600;
  uses = 3;

  onLevel(level) {}
  onUse(fight, source, target) {
    let bonusDamage = this.bonusDamage * (1 + source.SkillAdd5 * 0.0001);
    let duration = this.duration * (1 + source.SkillAdd5 * 0.0001);
    let physicalDamage = this.physicalDamage;

    if (source.hasEffect(Effect.GHOST)) {
      physicalDamage *= 0.3;
      bonusDamage *= 0.3;
    }

    const hasSubstitute = target.hasEffect(Effect.SUBSTITUTE);
    const damage = fight.getDamage(source) * physicalDamage + bonusDamage * 0.01 * target.maxHp;
    const isHit = fight.attack(source, target, damage, 0);

    if (isHit && !hasSubstitute) {
      fight.removeEffect(this.action, target, Effect.DIZZY);
      fight.addEffect(this.action, target, new Dizzy(target, duration)); // pass in duration
    }

    return UserSkillResult.SKILL_SUCCESS;
  }
}