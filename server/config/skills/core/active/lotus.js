const { Effect } = require("../../../effects");
const Weak = require("../../../effects/weak");
const { AttackSkill, SkillMethod, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class Lotus extends AttackSkill {
  method = SkillMethod.MELEE;
  category = SkillCategory.BODY;
  mpModifier = 0;
  probability = 23;
  physicalDamage = 2.5;
  weakDuration = 800;

  onLevel(level) {}

  onUse(fight, source, target) {
    let physicalDamage = this.physicalDamage * (1 + source.SkillAdd5 * 0.0001);

    if (source.hasEffect(Effect.GHOST)) {
      physicalDamage *= 0.3;
    }

    if (fight.random(0, 99) < 50) {
      physicalDamage *= 0.8;
    } else {
      physicalDamage *= 1.2;
    }

    const damage = fight.getDamage(source) * physicalDamage;

    fight.attack(source, target, damage, 0);
    fight.addEffect(this.action, source, new Weak(source, this.weakDuration));

    // var AttackCount = 0;
    // if(LogicTool.RandInt(0, 99) < 50)
    // {
    //     AttackCount = 5;
    // }
    // else
    // {
    //     AttackCount = 9;
    // }
    // fv.AttackCount = AttackCount;

    return UserSkillResult.SKILL_SUCCESS;
  }
}