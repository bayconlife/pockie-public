const { Effect } = require("../../../effects");
const Bless = require("../../../effects/bless");
const { TriggerSkill, SkillTrigger, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class Prayer extends TriggerSkill {
  trigger = SkillTrigger.AFTER_BEING_HURT;
  category = SkillCategory.WATER;
  mpModifier = 0.8;
  probability = 28;
  duration = 900;
  uses = 1;

  onLevel(level) {}
  onUse(fight, source, target) {
    if (source.hasEffect(Effect.BLESS)) {
      return UserSkillResult.SKILL_LOSE;
    }

    fight.addEffect(this.action, source, new Bless(source, this.duration));

    // var BuffKangFeng = fightsystem.GetBuff(self,11880);
    // if(BuffKangFeng == null)
    // {
    // 		//判断是否有亢奋+任意一个级别的杀戮光环
    // 		var BuffShaLuGuangHuan0 = fightsystem.GetBuff(self,11853);
    // 		var BuffShaLuGuangHuan1 = fightsystem.GetBuff(self,11854);
    // 		var BuffShaLuGuangHuan2 = fightsystem.GetBuff(self,11855);
    // 		if((BuffShaLuGuangHuan0 != null)&&(BuffShaLuGuangHuan0.SaveData != 0))
    // 		{
    // 				fightsystem.AddBuff(self,11880,timer,fv,999997,BuffShaLuGuangHuan0.SaveData);
    // 		}
    // 		else if((BuffShaLuGuangHuan1 != null)&&(BuffShaLuGuangHuan1.SaveData != 0))
    // 		{
    // 				fightsystem.AddBuff(self,11880,timer,fv,999997,BuffShaLuGuangHuan1.SaveData);
    // 		}
    // 		else if((BuffShaLuGuangHuan2 != null)&&(BuffShaLuGuangHuan2.SaveData != 0))
    // 		{
    // 				fightsystem.AddBuff(self,11880,timer,fv,999997,BuffShaLuGuangHuan2.SaveData);
    // 		}
    // }
    // else if(BuffKangFeng.SaveData == 1)
    // {
    // 		BuffKangFeng.SaveData = 999997;
    // 		BuffKangFeng.LifeTime = 999997;
    // }

    return UserSkillResult.SKILL_SUCCESS;
  }
}