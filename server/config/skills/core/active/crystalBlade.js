const { Effect } = require("../../../effects");
const Frozen = require("../../../effects/frozen");
const { AttackSkill, SkillCategory, SkillMethod, UserSkillResult } = require("../../util");

module.exports = class CrystalBlade extends AttackSkill {
  category = SkillCategory.WATER;
  method = SkillMethod.MELEE;
  mpModifier = 2.6;
  probability = 26;
  breakBonus = 200;

  onLevel(level) {}
  onUse(fight, source, target) {
    const breakBonus = this.breakBonus * (1 + source.SkillAdd1 * 0.0001);
    const hasSubstitute = target.hasEffect(Effect.SUBSTITUTE);
    const hasThaw = target.hasEffect(Effect.THAW);
    const isHit = fight.attack(source, target, 1, 0);

    if (isHit && !hasSubstitute && !hasThaw) {
      fight.removeEffect(this.action, target, Effect.FROZEN);
      fight.removeEffect(this.action, target, Effect.BURN);
      fight.removeEffect(this.action, target, Effect.BLOODBOIL);

      fight.addEffect(this.action, target, new Frozen(target, breakBonus));
    }

    // var BuffParry = fightsystem.GetBuff(target,11841);
    // //把格挡保存下来
    // if(BuffParry != null)
    // {
    //     fightsystem.AddBuff(target,11841,timer,fv);
    // }

    return UserSkillResult.SKILL_SUCCESS;
  }
}