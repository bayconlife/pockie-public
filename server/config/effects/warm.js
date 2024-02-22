const { Effect } = require(".");
const { CombatEffect, EffectAssociation, EffectRemoveType } = require("./util");

module.exports = class Warm extends CombatEffect {
  association = EffectAssociation.BENEFICIAL;
  removeType = EffectRemoveType.DURATION;
  rateBonus = 1; //1+0.01*LogicTool.ToInt(buff.SaveData1*0.01); SaveData1 is actually set to 0 but maybe higher levels are supposed to increase

  constructor(target, duration) {
    super(target, Effect.BLOODBOIL);

    this.duration = duration;
  }

  add() {
    this.target.SkillAdd0 += 15 * this.rateBonus;
    this.target.SkillAdd1 += 15 * this.rateBonus;
    this.target.SkillAdd2 += 15 * this.rateBonus;
    this.target.SkillAdd3 += 15 * this.rateBonus;
    this.target.SkillAdd4 += 15 * this.rateBonus;
    this.target.SkillAdd5 += 15 * this.rateBonus;
    this.target.SkillAdd6 += 15 * this.rateBonus;
    this.target.SkillAdd7 += 15 * this.rateBonus;
    this.target.SkillAdd8 += 15 * this.rateBonus;
    this.target.SkillAdd9 += 15 * this.rateBonus;
  }

  remove() {
    this.target.SkillAdd0 -= 15 * this.rateBonus;
    this.target.SkillAdd1 -= 15 * this.rateBonus;
    this.target.SkillAdd2 -= 15 * this.rateBonus;
    this.target.SkillAdd3 -= 15 * this.rateBonus;
    this.target.SkillAdd4 -= 15 * this.rateBonus;
    this.target.SkillAdd5 -= 15 * this.rateBonus;
    this.target.SkillAdd6 -= 15 * this.rateBonus;
    this.target.SkillAdd7 -= 15 * this.rateBonus;
    this.target.SkillAdd8 -= 15 * this.rateBonus;
    this.target.SkillAdd9 -= 15 * this.rateBonus;

    // //检查亢奋buff
    // var BuffKangFeng = fightsystem.GetBuff(self,11880);
    // if((BuffKangFeng != null)&&(BuffKangFeng.SaveData == 999997))
    // {
    //     var BuffQiDao = fightsystem.GetBuff(self,11832);
    //     var BuffJiFeng = fightsystem.GetBuff(self,11825);
    //     var BuffYuHe = fightsystem.GetBuff(self,11834);
    //     if((BuffQiDao == null)&&(BuffJiFeng == null)&&(BuffYuHe == null))
    //     {
    //         fightsystem.RemoveBuff(self,11880,timer,fv);
    //     }
    // }
  }
}