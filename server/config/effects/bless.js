const { Effect } = require(".");
const { CombatEffect, EffectAssociation, EffectRemoveType } = require("./util");

module.exports = class Bless extends CombatEffect {
  association = EffectAssociation.BENEFICIAL;
  removeType = EffectRemoveType.DURATION;

  constructor(target, duration) {
    super(target, Effect.BLESS);

    this.duration = duration;
  }

  add() {
    this.target.decDamage += 1000;
  }

  remove() {
    this.target.decDamage -= 1000;

    // var BuffKangFeng = fightsystem.GetBuff(self,11880);
    // if((BuffKangFeng != null)&&(BuffKangFeng.SaveData == 999997))
    // {
    //     var BuffReXue = fightsystem.GetBuff(self,11814);
    //     var BuffJiFeng = fightsystem.GetBuff(self,11825);
    //     var BuffYuHe = fightsystem.GetBuff(self,11834);
    //     if((BuffReXue == null)&&(BuffJiFeng == null)&&(BuffYuHe == null))
    //     {
    //         fightsystem.RemoveBuff(self,11880,timer,fv);
    //     }
    // }
  }
}