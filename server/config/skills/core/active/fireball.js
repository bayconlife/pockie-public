const { Effect } = require("../../../effects");
const Burn = require("../../../effects/burn");
const { AttackSkill, SkillCategory, SkillMethod, UserSkillResult } = require("../../util");

module.exports = class Fireball extends AttackSkill {
  category = SkillCategory.FIRE;
  method = SkillMethod.RANGED;
  mpModifier = 1;
  probability = 33;
  fireDamage = 1.3;
  burnDamage = 0.4;
  burnCount = 2;

  onLevel(level) {
    switch (level) {
      case 1:
        this.fireDamage = 1.3;
        this.burnDamage = 0.4;
        this.burnCount = 2;
        break;
    }
  }

  onUse(fight, source, target) {
    if (target.hasEffect(Effect.FROZEN)) {
      return UserSkillResult.SKILL_SUCCESS;
    }

    // Mud Wall cannot block ranged skills. TODO look into applying this on the base class
    fight.removeEffect(this.action, target, Effect.MUD_WALL);

    const fireDamage = this.fireDamage * (1 + source.SkillAdd0 * 0.0001);
    const damage = fight.getDamage(source) * fireDamage * (1 + this.damageModifier);
    const damageToSelf = source.hasEffect(Effect.BLOODBOIL) ? damage * 0.2 : 0;
    const isHit = fight.attack(source, target, damage, damageToSelf);

    if (isHit && target.hasEffect(Effect.DRUNK) && !source.hasEffect(Effect.MIST) && !target.hasEffect(Effect.MIST)) {
      const effectDamage = this.action.targetLastDamage * this.burnDamage;
      const burn = target.getEffect(Effect.BURN);

      if (burn !== null) {
        if (burn.damage < effectDamage) {
          burn.damage = effectDamage;
        }

        burn.count += this.burnCount;
      } else {
        fight.addEffect(this.action, target, new Burn(target, effectDamage, this.burnCount));
      }
    }

    return UserSkillResult.SKILL_SUCCESS;
  }
}