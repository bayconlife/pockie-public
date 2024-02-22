import { SkillTrigger } from '../../enums';
import { CombatActor, FightAction, FightStatChange } from '../../interfaces';
import { Fight } from './fightSystem';

export interface FightSystem {
  attack: (fight: Fight, source: CombatActor, target: CombatActor, damageToTarget: number, damageToSelf: number) => void;
  attemptToUseSkillOfTriggerType: (fight: Fight, source: CombatActor, target: CombatActor, trigger: SkillTrigger) => void;
  changeAtk: (target: CombatActor, minMultipler: number, minAdditional: number, maxMultipler: number, maxAdditional: number) => void;
  changeAtkTime: (target: CombatActor, multipler: number, additional: number) => void;
  changeBlock: (target: CombatActor, multiplier: number, additional: number) => void;
  changeDefense: (target: CombatActor, multiplier: number, additional: number) => void;
  changeDodge: (target: CombatActor, multiplier: number, additional: number) => void;
  changeHit: (target: CombatActor, multipler: number, additional: number) => void;
  changeNextAtkTime: (source: CombatActor, amount: number) => void;
  changeStat: (action: FightAction, change: FightStatChange) => void;
  damage: (fight: Fight, source: CombatActor, target: CombatActor, amount: number, allowDamageSkills: boolean) => void;
  damageWithReduction: (fight: Fight, source: CombatActor, target: CombatActor, amount: number, allowDamageSkills: boolean) => void;
  isActorDead: (...actors: CombatActor[]) => boolean;
  useChakra: (action: FightAction, source: CombatActor, amount: number) => void;
}
