import { random, randomInt } from '../../components/random';
import { FightEvents, FightReasons, UserSkillResult } from '../../enums';
import { CombatActor, CustomSocket, FightAction, FightRole } from '../../interfaces';
import { Skill } from '../../classes';
import { getDamage } from './damageSystem';
import { addEffect, getEffect, hasEffect, removeEffect } from './effectSystem';
import { FightSystem } from './interfaces';
import { Callback } from '../../types';
import { updateCharacter } from '../kernel/cache';
import { User } from '../../components/classes';
import { Config } from '../../resources/servers';

export class Fight {
  private actions: FightAction[] = [];
  private roles: FightRole[] = [];

  public previousTime: number;
  public currentTime: number = 0;

  constructor(private fightSystem: FightSystem, private reason: FightReasons, private config: Config) {}

  addAction(role: number, event: FightEvents): FightAction {
    this.actions.push({ role, event, time: this.currentTime });

    return this.actions[this.actions.length - 1];
  }

  addRole(...roles: FightRole[]) {
    this.roles.push(...roles);
  }

  getConfig() {
    return this.config;
  }

  getLastAction() {
    return this.actions[this.actions.length - 1];
  }

  output() {
    return {
      reason: this.reason,
      roles: this.roles,
      fight: this.actions,
    };
  }

  removeLastAction() {
    return this.actions.splice(this.actions.length - 1, 1);
  }

  useSkill(source: CombatActor, target: CombatActor, skill: Skill) {
    const action = this.addAction(source.index, FightEvents.USER_SKILL);
    const idx = this.actions.length - 1;
    const result = skill.use(this, action, source, target);

    if (result === UserSkillResult.SKILL_SUCCESS && !skill.removeAction) {
      this.actions[idx].skillId = skill.id;

      if (this.actions[idx].targetRole === undefined) {
        this.actions[idx].targetRole = target.index;
      }
    } else {
      this.actions.splice(idx, 1);
    }

    return result;
  }

  attack = (...args: any[]) => (<any>this.fightSystem.attack)(this, ...args);
  attemptToUseSkillOfTriggerType = (...args: any[]) => (<any>this.fightSystem.attemptToUseSkillOfTriggerType)(this, ...args);
  changeAtk = this.fightSystem.changeAtk;
  changeAtkTime = this.fightSystem.changeAtkTime;
  changeBlock = this.fightSystem.changeBlock;
  changeDefense = this.fightSystem.changeDefense;
  changeDodge = this.fightSystem.changeDodge;
  changeHit = this.fightSystem.changeHit;
  changeNextAtkTime = this.fightSystem.changeNextAtkTime;
  changeStat = this.fightSystem.changeStat;
  damage = (source: CombatActor, target: CombatActor, amount: number, triggerDamageSkills: boolean = true) =>
    this.fightSystem.damage(this, source, target, amount, triggerDamageSkills);
  damageWithReduction = (source: CombatActor, target: CombatActor, amount: number, triggerDamageSkills: boolean = true) =>
    this.fightSystem.damageWithReduction(this, source, target, amount, triggerDamageSkills);
  isActorDead = this.fightSystem.isActorDead;
  useChakra = this.fightSystem.useChakra;

  addEffect = (...args: any[]) => (<any>addEffect)(...args, this);
  getDamage = getDamage;
  getEffect = getEffect;
  hasEffect = hasEffect;
  removeEffect = removeEffect;
  random = random;
  randomInt = randomInt;
}

export function attack(...args: any[]) {
  return true;
}
export function attemptToUseSkillOfTriggerType(...args: any[]) {}
export function ChangeAtk(...args: any[]) {}
export function ChangeAtkTime(...args: any[]) {}
export function ChangeDefense(...args: any[]) {}
export function ChangeDodge(...args: any[]) {}
export function changeHit(...args: any[]) {}
export function ChangeNextAtkTime(...args: any[]) {}
export function damage(...args: any[]) {}
export function isActorDead(...args: any[]) {}
export function useChakra(...args: any[]) {}

export async function emitFight(
  socket: CustomSocket,
  result: any,
  cb: (character: User, ...args: any[]) => void = () => {},
  ...cbArgs: any[]
) {
  socket.emit('fight', result, async () => {
    const character = await updateCharacter(socket, (character) => {
      character.fight.timeForNextFight = 0;
      delete character.fight.results;
    });

    cb(character, ...cbArgs);
  });
}
