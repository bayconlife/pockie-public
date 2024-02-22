const { Effect } = require("../../../effects");
const { AttackSkill, SkillMethod, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class SecretTechnique extends AttackSkill {
  method = SkillMethod.RANGED;
  category = SkillCategory.INVALID;
  mpModifier = 0;
  probability = 100;

  onLevel(level) {}

  onUse(fight, source, target) {
    if (source.canKickBomb && fight.randomInt(0, 99) < 10 && target.hp < target.maxHp * 0.15) {
      fight.removeEffect(this.action, target, Effect.MUD_WALL);

      const damage = (target.hp * fight.randomInt(300, 500)) / 100;

      fight.attack(source, target, damage, 0);

      return UserSkillResult.SKILL_SUCCESS;
    }

    return UserSkillResult.SKILL_LOSE;
  }
}