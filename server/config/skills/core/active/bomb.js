const { Effect } = require("../../../effects");
const { AttackSkill, SkillMethod, SkillCategory, FightEvents, UserSkillResult } = require("../../util");

module.exports = class Bomb extends AttackSkill {
  method = SkillMethod.RANGED;
  category = SkillCategory.TOOL;
  mpModifier = 0;
  probability = 33;
  bombDamage = 2.1;

  onLevel(level) {}

  onUse(fight, source, target) {
    const chance = 100 - Math.floor(100 / (1 + Math.pow(fight.currentTime / 200, 0.5) * 0.05));
    const bombDamage = this.bombDamage * (1 + source.SkillAdd6 * 0.0001);
    const damage = Math.floor(fight.getDamage(source) * bombDamage * (1 + this.damageModifier));

    fight.removeEffect(this.action, target, Effect.MUD_WALL);
    this.action.targetRole = target.index;

    if (fight.random(0, 99) < chance && target.canKickBomb && target.canUseSkill > 0 && target.canAttack > 0) {
      // (LogicTool.RandInt(0, 99) < Chance)&&((target.Clothing != 0)||(target.CounterBombMul > 0))&&(target.CanMove > 0)&&(target.CanAttack > 0)

      this.action.event = FightEvents.BACK_THROWED;

      fight.attack(target, source, damage, 0);
    } else {
      fight.attack(source, target, damage, 0);
    }

    return UserSkillResult.SKILL_SUCCESS;
  }
}