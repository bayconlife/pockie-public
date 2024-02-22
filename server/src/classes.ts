import { Effect, EffectAssociation, EffectRemoveType, SkillCategory, SkillMethod, SkillTrigger, SkillType, UserSkillResult } from './enums';
import { Fight } from './modules/fight/fightSystem';
import { FightAction, CombatActor } from './interfaces';

export class CombatEffect {
  fight: Fight;
  target: CombatActor;
  name: Effect;
  duration: number;
  data: { [key: string]: any };
  timeActive = 0;
  removeType: EffectRemoveType = EffectRemoveType.DURATION;
  association: EffectAssociation = EffectAssociation.HARMFUL;

  constructor(target: CombatActor, name: Effect) {
    this.target = target;
    this.name = name;
    this.duration = 0;
  }

  add(action: FightAction) {}
  activate(action: FightAction) {}
  remove(action: FightAction) {}
}

export class Skill {
  id: number;
  type: SkillType;
  category: SkillCategory;
  trigger: SkillTrigger;
  probability: number;
  method: SkillMethod;
  removeAction?: boolean;

  use: (fight: Fight, action: FightAction, source: CombatActor, target: CombatActor) => UserSkillResult;
}
