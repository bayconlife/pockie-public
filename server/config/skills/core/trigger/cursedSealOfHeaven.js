const { Effect } = require("../../../effects");
const Mark = require("../../../effects/mark");
const { TriggerSkill, SkillTrigger, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class CursedSealOfHeaven extends TriggerSkill {
  trigger = SkillTrigger.START_THE_FIGHT;
  category = SkillCategory.SEALING;
  mpModifier = 0.1;
  probability = 100;
  duration = 0;

  onLevel(level) {
    switch (level) {
      case 1:
        this.duration = 3;
        break;
    }
  }

  onUse(fight, source, target) {
    if (source.hasEffect(Effect.MARK)) {
      return UserSkillResult.SKILL_LOSE;
    }

    fight.addEffect(this.action, source, new Mark(source));

    //     var BuffKangFeng = fightsystem.GetBuff(self,11880);
    //     if(BuffKangFeng == null)
    //     {
    //         //判断是否有亢奋+任意一个级别的杀戮光环
    //         var BuffShaLuGuangHuan0 = fightsystem.GetBuff(self,11853);
    //         var BuffShaLuGuangHuan1 = fightsystem.GetBuff(self,11854);
    //         var BuffShaLuGuangHuan2 = fightsystem.GetBuff(self,11855);
    //         if((BuffShaLuGuangHuan0 != null)&&(BuffShaLuGuangHuan0.SaveData != 0))
    //         {
    //             fightsystem.AddBuff(self,11880,timer,fv,999999,BuffShaLuGuangHuan0.SaveData);
    //         }
    //         else if((BuffShaLuGuangHuan1 != null)&&(BuffShaLuGuangHuan1.SaveData != 0))
    //         {
    //             fightsystem.AddBuff(self,11880,timer,fv,999999,BuffShaLuGuangHuan1.SaveData);
    //         }
    //         else if((BuffShaLuGuangHuan2 != null)&&(BuffShaLuGuangHuan2.SaveData != 0))
    //         {
    //             fightsystem.AddBuff(self,11880,timer,fv,999999,BuffShaLuGuangHuan2.SaveData);
    //         }
    //     }
    //     else
    //     {
    //         BuffKangFeng.SaveData = 999999;
    //     }
    return UserSkillResult.SKILL_SUCCESS;
  }
}