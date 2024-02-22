const { UserSkillResult, SkillMethod, AttackSkill } = require("../../util");

module.exports = class Attack extends AttackSkill {
  method = SkillMethod.MELEE;
  mpModifier = 0;
  probability = 100;

  onLevel(level) {}

  onUse(fight, source, target) {
    fight.attack(source, target, fight.getDamage(source), 0);
    return UserSkillResult.SKILL_SUCCESS;
  }
}