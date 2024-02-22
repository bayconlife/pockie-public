const { Effect } = require("../../../effects");
const SunsetEffect = require("../../../effects/sunset");
const { TriggerSkill, SkillTrigger, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class Sunset extends TriggerSkill {
  trigger = SkillTrigger.START_THE_FIGHT;
  category = SkillCategory.FIRE;
  mpModifier = 3.4;
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
    if (source.getEffect(Effect.SUNSET)) {
      return UserSkillResult.SKILL_LOSE;
    }

    if (source.getEffect(Effect.MIST)) {
      fight.removeEffect(this.action, source, Effect.MIST);
      // var BuffSelfKangFeng = fightsystem.GetBuff(self,11880);
      // if((BuffSelfKangFeng != null)&&(BuffSelfKangFeng.SaveData == 999998))
      // {
      //     fightsystem.RemoveBuff(self,11880,timer,fv);
      // }
      return UserSkillResult.SKILL_SUCCESS;
    }

    if (target.getEffect(Effect.MIST)) {
      fight.removeEffect(this.action, target, Effect.MIST);
      // var BuffTargetKangFeng = fightsystem.GetBuff(target,11880);
      // if((BuffTargetKangFeng != null)&&(BuffTargetKangFeng.SaveData == 999998))
      // {
      //     fightsystem.RemoveBuff(target,11880,timer,fv);
      // }
      return UserSkillResult.SKILL_SUCCESS;
    }

    fight.addEffect(this.action, source, new SunsetEffect(source));

    // var BuffKangFeng = fightsystem.GetBuff(self,11880);
    // if(BuffKangFeng == null)
    // {
    //     //判断是否有亢奋+任意一个级别的杀戮光环
    //     var BuffShaLuGuangHuan0 = fightsystem.GetBuff(self,11853);
    //     var BuffShaLuGuangHuan1 = fightsystem.GetBuff(self,11854);
    //     var BuffShaLuGuangHuan2 = fightsystem.GetBuff(self,11855);
    //     if((BuffShaLuGuangHuan0 != null)&&(BuffShaLuGuangHuan0.SaveData != 0))
    //     {
    //         fightsystem.AddBuff(self,11880,timer,fv,999998,BuffShaLuGuangHuan0.SaveData);
    //     }
    //     else if((BuffShaLuGuangHuan1 != null)&&(BuffShaLuGuangHuan1.SaveData != 0))
    //     {
    //         fightsystem.AddBuff(self,11880,timer,fv,999998,BuffShaLuGuangHuan1.SaveData);
    //     }
    //     else if((BuffShaLuGuangHuan2 != null)&&(BuffShaLuGuangHuan2.SaveData != 0))
    //     {
    //         fightsystem.AddBuff(self,11880,timer,fv,999998,BuffShaLuGuangHuan2.SaveData);
    //     }
    // }
    return UserSkillResult.SKILL_SUCCESS;
  }
}