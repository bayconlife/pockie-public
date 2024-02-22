const { Effect } = require(".");
const { CombatEffect, EffectRemoveType } = require("./util");

module.exports = class Clay extends CombatEffect {
  removeType = EffectRemoveType.DURATION;
  startingHp = 0;

  constructor(target, duration) {
    super(target, Effect.DETONATING_CLAY);

    this.duration = duration;
  }

  add() {
    this.startingHp = this.target.hp;
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
    // buff.SaveData1 = timer;
    // buff.SaveData = self.HP;
  }

  activate(action) { }

  remove(action) {
    if (this.timeActive < this.duration) {
      return;
    }

    let dmg = 0;

    if (this.target.decDamage < 100) {
      if (this.target.hasEffect(Effect.FROZEN)) {
        dmg = Math.max(this.startingHp - this.target.hp, 1) * (0 - this.target.decDamage / 100);
      } else {
        dmg = Math.max(this.startingHp - this.target.hp, 1) * (1 - this.target.decDamage / 100);
      }
    }

    dmg = Math.floor(dmg);

    this.fight.damage(this.target.target, this.target, dmg);

    action.skillId = 38122;
    action.selfLastDamage = dmg;
  }
}