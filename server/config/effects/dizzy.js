const { Effect } = require(".");
const { CombatEffect, EffectRemoveType } = require("./util");

module.exports = class Dizzy extends CombatEffect {
  removeType = EffectRemoveType.DURATION;

  constructor(target, duration) {
    super(target, Effect.DIZZY);
    this.duration = duration;
  }

  add(action) {
    this.fight.removeEffect(action, this.target, Effect.PARALYSIS);
    this.target.canAttack -= 1;
    // buff.LifeTime = buff.SaveData;
    // var BuffZaiShengGuangHuan0 = fightsystem.GetBuff(self,11861);
    // var BuffZaiShengGuangHuan1 = fightsystem.GetBuff(self,11862);
    // var BuffZaiShengGuangHuan2 = fightsystem.GetBuff(self,11863);
    // if(BuffZaiShengGuangHuan0 != null)
    // {
    //     buff.LifeTime = LogicTool.ToInt(buff.LifeTime*(100-BuffZaiShengGuangHuan0.SaveData%100)*0.01);
    //     fightsystem.AddBuff(self,11888,timer,fv);
    // }
    // else if(BuffZaiShengGuangHuan1 != null)
    // {
    //     buff.LifeTime = LogicTool.ToInt(buff.LifeTime*(100-BuffZaiShengGuangHuan1.SaveData%100)*0.01);
    //     fightsystem.AddBuff(self,11888,timer,fv);
    // }
    // else if(BuffZaiShengGuangHuan2 != null)
    // {
    //     buff.LifeTime = LogicTool.ToInt(buff.LifeTime*(100-BuffZaiShengGuangHuan2.SaveData%100)*0.01);
    //     fightsystem.AddBuff(self,11888,timer,fv);
    // }
  }

  remove() {
    this.target.canAttack += 1;
  }
}