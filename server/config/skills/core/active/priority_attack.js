const { UserSkillResult, SkillMethod, AttackSkill, FightEvents } = require("../../util");

module.exports = class PriorityAttack extends AttackSkill {
  method = SkillMethod.MELEE;
  mpModifier = 0;
  probability = 100;

  onLevel(level) {}

  onUse(fight, source, target) {
		fight.attack(source, target, fight.getDamage(source), 0);
		
		this.action.event = FightEvents.PRIORITY_MUL;
		
		return UserSkillResult.SKILL_SUCCESS;
  }
}