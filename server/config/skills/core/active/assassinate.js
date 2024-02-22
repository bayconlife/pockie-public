const { Effect } = require("../../../effects");
const Drunk = require("../../../effects/drunk");
const Poison = require("../../../effects/poison");
const { AttackSkill, SkillCategory, SkillMethod, UserSkillResult } = require("../../util");

module.exports = class Assassinate extends AttackSkill {
  category = SkillCategory.ILLUSION;
  method = SkillMethod.MELEE;
  mpModifier = 0.7;
  probability = 28;
  attackBonus = 1.2;
  vampireBonus = 0.5;

  onLevel(level) {}
  onUse(fight, source, target) {
    const attackBonus = this.attackBonus * (1 + source.SkillAdd8 * 0.0001);
    const damage = fight.getDamage(source) * attackBonus * (1 + this.damageModifier);
    const damageToSelf = source.hasEffect(Effect.BLOODBOIL) ? Math.floor(damage * 0.2) : 0;

    let vampireBonus = target.hasEffect(Effect.GHOST ) ? this.vampireBonus * 0.3 : this.vampireBonus;

    source.stats.vampiricHp += vampireBonus;
    const isHit = fight.attack(source, target, damage, damageToSelf);
    source.stats.vampiricHp -= vampireBonus;

    if (isHit) {
      const poison = target.getEffect(Effect.POISON);
      const drunk = target.getEffect(Effect.DRUNK);

      if (poison !== null) {
        fight.addEffect(this.action, source, new Poison(source, poison.duration));
      }

      if (drunk !== null) {
        fight.addEffect(this.action, source, new Drunk(source, drunk.hitMultiplier, drunk.critMultiplier));
      }
    }

    return UserSkillResult.SKILL_SUCCESS;
  }
}