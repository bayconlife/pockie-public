import { random, randomInt } from '../../components/random';
import { CombatActor, CombatActorBaseData, CustomSocket, Stats } from '../../interfaces';
import {
  Effect,
  EffectRemoveType,
  FightEvents,
  FightReasons,
  SkillMethod,
  SkillTrigger,
  SkillType,
  UserSkillResult,
  UserSkills,
} from '../../enums';
import { findAttackSkill, findSkillByTrigger } from './skillSystem';
import { Fight, isActorDead } from './fightSystem';
import { removeEffect } from './effectSystem';
import { DEFAULT_ATTACK_ID } from '../../resources/skills';
import { Overworld } from './handlers/overworld';
import { User } from '../../components/classes';
import { cloneDeep, isEqual } from 'lodash';
import { Config } from '../../resources/servers';

const initCombatActor = (stats: Stats, type: string, idx: number, config: Config): CombatActor => {
  const attackTime = Math.floor(500 / (stats.speed / 1000));
  const SKILLS = config.Base.Skills;
  let skills = (stats.skills ?? []).filter((id) => id !== null);

  skills.push(...(stats.petSkills ?? []));

  const combatActor = {
    ...stats,
    index: idx,
    attackTime,
    previousTime: 0,
    nextAttackTime: attackTime,
    canAttack: 1,
    canUseSkill: 1,
    isTurn: false,
    type,
    skillList: skills,
    combatSkills: {
      attack: skills.filter((id) => SKILLS[id].type === SkillType.ATTACK).map((id) => new (SKILLS[id] as any)(id, 1)),
      trigger: skills.filter((id) => SKILLS[id].type === SkillType.TRIGGER).map((id) => new (SKILLS[id] as any)(id, 1)),
      passive: skills.filter((id) => SKILLS[id].type === SkillType.PASSIVE).map((id) => new (SKILLS[id] as any)(id, 1)),
    },
    effects: {},
    saveSkillId: 0,
    stats: {
      block: {
        percent: 0,
        inital: stats.parry,
        multipler: 0,
        additional: 0,
      },
      defense: {
        initial: stats.defense,
        multipler: 0,
        additional: 0,
      },
      dodge: {
        initial: stats.dodge,
        multipler: 0,
        additional: 0,
      },
      hit: {
        initial: stats.hit,
        multipler: 0,
        additional: 0,
      },
      shield: 0,
      attackTime: {
        initial: attackTime,
        multipler: 0,
        additional: 0,
        modified: 0,
      },
      attack: {
        max: {
          initial: stats.maxAttack,
          multipler: 0,
          additional: 0,
        },
        min: {
          initial: stats.minAttack,
          multipler: 0,
          additional: 0,
        },
      },
      resistance: { ...stats.resistance },
      vampiricHp: 0,
    },
    target: this,
  } as any;

  combatActor.mp = combatActor.mp ?? 0;

  combatActor.hasEffect = (effectId: number) => {
    return effectId in combatActor.effects;
  };

  combatActor.getEffect = (effectId: number) => {
    if (effectId in combatActor.effects) {
      return combatActor.effects[effectId];
    }

    return null;
  };

  return combatActor;
};

function activateEffects(fight: Fight, source: CombatActor, timePassed: number, activate = true) {
  const effectsToRemove = new Set<Effect>();

  Object.values(source.effects).forEach((effect) => {
    if (fight.isActorDead(source)) {
      return;
    }

    effect.timeActive += timePassed;
    const action = fight.addAction(source.index, FightEvents.CHANGE_BUFF);
    const initial = cloneDeep(action);

    if (activate) {
      effect.activate(action);

      if (effect.removeType === EffectRemoveType.START_OF_TURN) {
        effectsToRemove.add(effect.name);
      }
    }

    if (effect.removeType === EffectRemoveType.DURATION && effect.timeActive >= effect.duration) {
      effectsToRemove.add(effect.name);
    }

    const lastAction = fight.getLastAction();

    if (isEqual(fight.getLastAction(), initial)) {
      fight.removeLastAction();
    }

    // if (lastAction.event === FightEvents.CHANGE_BUFF && Object.keys(lastAction).length === 3) {
    //   fight.removeLastAction();
    // }
  });

  effectsToRemove.forEach((effect) => {
    removeEffect(fight.addAction(source.index, FightEvents.CHANGE_BUFF), source, effect);
  });
}

function UserAttackSkill(fight: Fight, source: CombatActor, target: CombatActor): void {
  let mustCastUsedSuccessfully = false;

  const { skill, mustCast } = findAttackSkill(source);

  for (let i = 0; i < mustCast.length; i++) {
    const result = fight.useSkill(source, target, mustCast[i]);

    if (result === UserSkillResult.SKILL_SUCCESS) {
      mustCastUsedSuccessfully = true;
      break;
    }
  }

  if (!mustCastUsedSuccessfully) {
    if (skill === null) {
      // Probably don't need this as the id can't be null from findAttackSkill
      return;
    }

    const result = fight.useSkill(source, target, skill);

    if (result !== UserSkillResult.SKILL_SUCCESS && skill.id !== DEFAULT_ATTACK_ID) {
      const result = fight.useSkill(source, target, new (fight.getConfig().Base.Skills[DEFAULT_ATTACK_ID] as any)(1, 1));

      if (result !== UserSkillResult.SKILL_SUCCESS) {
        return;
      }
    }
  }

  if (fight.isActorDead(source)) {
    fight.attemptToUseSkillOfTriggerType(source, target, SkillTrigger.AFTER_DEATH);
  }

  if (fight.isActorDead(target)) {
    fight.attemptToUseSkillOfTriggerType(target, source, SkillTrigger.AFTER_DEATH);
  }

  if (fight.isActorDead(source, target)) {
    return;
  }

  // if (skill.GetEffect() != 1)
  //   return true;
  // if (fv.IsHit == 0)
  //   return true;

  if (skill.method === SkillMethod.MELEE) {
    fight.attemptToUseSkillOfTriggerType(source, target, SkillTrigger.MELEE_TRIGGER_AFTER_SKILL_HIT);
  }

  if (fight.isActorDead(source, target)) {
    return;
  }

  fight.attemptToUseSkillOfTriggerType(source, target, SkillTrigger.PET_TRIGGER_AFTER_SKILL_HIT);

  if (fight.isActorDead(source, target)) {
    return;
  }

  if (skill.method === SkillMethod.MELEE) {
    fight.attemptToUseSkillOfTriggerType(target, source, SkillTrigger.MELEE_TOUCH_AFTER_BEING_HIT_BY_A_SKILL);
  }
}

function AttackTarget(fight: Fight, source: CombatActor, target: CombatActor, timePassed: number) {
  activateEffects(fight, source, timePassed);
  activateEffects(fight, target, timePassed, false);

  if (fight.isActorDead(source)) {
    return;
  }

  if (source.canAttack <= 0) {
    fight.addAction(source.index, FightEvents.CANT_MOVE);
    return;
  }

  fight.addAction(source.index, FightEvents.BEGIN_ATTACK); // TODO do we actually need to send this? Not sure what it triggers on the front end yet

  // if Target has priority over source then the target attacks instead, things like mist hide grant priority chance
  if (targetHasPriority(fight, source, target)) {
    if (fight.isActorDead(source, target)) {
      return;
    }

    fight.addAction(source.index, FightEvents.END_ATTACK);

    return;
  }

  fight.attemptToUseSkillOfTriggerType(source, target, SkillTrigger.START_OF_TURN);

  if (target.canAttack > 0) {
    fight.attemptToUseSkillOfTriggerType(target, source, SkillTrigger.BEFORE_BEING_ATTACKED);
  }

  if (fight.isActorDead(source) || fight.isActorDead(target) || source.canAttack <= 0) {
    return;
  }

  fight.attemptToUseSkillOfTriggerType(source, target, SkillTrigger.BEFORE_ATTACK);

  if (fight.isActorDead(source) || fight.isActorDead(target)) {
    // TODO check if we need the source.canAttack here, not sure if extra attacks or counters can trigger dizzy?
    return;
  }

  UserAttackSkill(fight, source, target);

  if (fight.isActorDead(source) || fight.isActorDead(target)) {
    return;
  }

  fight.addAction(source.index, FightEvents.END_ATTACK);

  return;
}

function targetHasPriority(fight: Fight, source: CombatActor, target: CombatActor) {
  if (target.canAttack <= 0 || target.canUseSkill <= 0) {
    return false;
  }

  if (randomInt(0, 99) >= Math.floor(target.priorityMultipler - source.priorityMultipler)) {
    return false;
  }

  //@ts-ignore
  fight.useSkill(target, source, new Skills[2](2, 1));

  return true;
}

function useOpeningSkills(fight: Fight, source: CombatActor, target: CombatActor) {
  const { mustCast } = findSkillByTrigger(source, SkillTrigger.START_THE_FIGHT);
  mustCast.forEach((skill) => {
    fight.useSkill(source, target, skill);
  });

  const { mustCast: mustCastAuras } = findSkillByTrigger(source, SkillTrigger.AFTER_AURA);
  mustCastAuras.forEach((skill) => {
    fight.useSkill(source, target, skill);
  });
}

function createRole(source: CombatActor, isOnOffense: boolean, base: any) {
  return {
    index: source.index,
    isOnOffense,
    avatar: source.avatar,
    weaponId: source.weaponId,
    hp: source.hp,
    maxHp: source.maxHp,
    mp: source.chakra,
    maxMp: source.maxChakra,
    ...base,
    skills: source.skillList,
    pet: source.pet,
  };
}

const exemptMultiFightScenes = [2, 61, 5002];
interface FightOptions {
  allowMulti?: boolean;
  ignoreFightTimer?: boolean;
}

const defaultFightOptions: FightOptions = {
  allowMulti: false,
  ignoreFightTimer: false,
};

export function fight(playerBases: Stats[], enemyBases: Stats[], character: User, socket: CustomSocket, options?: FightOptions) {
  options = {
    ...defaultFightOptions,
    ...options,
  };

  if (!exemptMultiFightScenes.includes(character.scenes.current) && !options.allowMulti && character.multiFight.start !== 0) {
    return 'error__character_in_chain_attack';
  }

  // if (!options.ignoreFightTimer && character.fight.timeForNextFight > Date.now()) {
  //   const timeLeft = Math.floor((character.fight.timeForNextFight - Date.now()) / 1000);
  //   return 'error__character_fighting_too_quickly timeLeft: ' + timeLeft + 's';
  // }

  const players = playerBases.map((base, idx) => initCombatActor(base, 'player', idx, socket.getConfig()));
  const enemies = enemyBases.map((base, idx) => initCombatActor(base, 'enemy', playerBases.length + idx, socket.getConfig()));

  let currentPlayer = 0;
  let currentEnemy = 0;

  let player = players[currentPlayer];
  let enemy = enemies[currentEnemy];

  player.target = enemy;
  enemy.target = player;

  const fight = new Fight(Overworld, FightReasons.Fight, socket.getConfig());

  fight.addRole(
    ...players.map((actor, idx) => createRole(actor, true, playerBases[idx])),
    ...enemies.map((actor, idx) => createRole(actor, false, enemyBases[idx]))
  );

  useOpeningSkills(fight, player, enemy);
  useOpeningSkills(fight, enemy, player);

  let r = 0;

  while (true && r < 100) {
    let resetFighters = false;

    if (player.hp <= 0) {
      fight.addAction(player.index, FightEvents.BE_DIE);
      currentPlayer += 1;

      if (currentPlayer < players.length) {
        resetFighters = true;
        fight.addAction(currentPlayer - 1, FightEvents.CHANGE_ROLE);
        player = players[currentPlayer];
        player.target = enemy;
        enemy.target = player;

        const action = fight.addAction(enemy.index, FightEvents.CHANGE_BUFF);
        Object.keys(enemy.effects).forEach((effect) => removeEffect(action, enemy, Number(effect)));
        enemy.combatSkills = initCombatActor(enemy, enemy.type, enemy.index, socket.getConfig()).combatSkills;
      }
    }

    if (enemy.hp <= 0) {
      fight.addAction(enemy.index, FightEvents.BE_DIE);
      currentEnemy += 1;

      if (currentEnemy < enemies.length) {
        resetFighters = true;
        fight.addAction(players.length + currentEnemy - 1, FightEvents.CHANGE_ROLE);
        enemy = enemies[currentEnemy];
        enemy.target = player;
        player.target = enemy;

        const action = fight.addAction(player.index, FightEvents.CHANGE_BUFF);
        Object.keys(player.effects).forEach((effect) => removeEffect(action, player, Number(effect)));
        player.combatSkills = initCombatActor(player, player.type, player.index, socket.getConfig()).combatSkills;
      }
    }

    if (currentPlayer >= players.length || currentEnemy >= enemies.length) {
      break;
    }

    if (resetFighters) {
      player.nextAttackTime = fight.currentTime + player.attackTime;
      enemy.nextAttackTime = fight.currentTime + enemy.attackTime;

      player.previousTime = fight.currentTime;
      enemy.previousTime = fight.currentTime;

      useOpeningSkills(fight, player, enemy);
      useOpeningSkills(fight, enemy, player);

      r = 0;
    }

    let minAttackTime = Math.min(player.nextAttackTime, enemy.nextAttackTime);
    let isPlayerTurn = minAttackTime === player.nextAttackTime;
    let isTargetTurn = minAttackTime === enemy.nextAttackTime;
    let timePassed = minAttackTime - fight.currentTime;

    fight.currentTime = minAttackTime;

    if (isPlayerTurn && isTargetTurn) {
      if (random(0, 100) >= random(0, 100)) {
        isPlayerTurn = false;
      } else {
        isTargetTurn = false;
      }
    }

    if (isPlayerTurn) {
      AttackTarget(fight, player, enemy, timePassed);
      player.previousTime = minAttackTime;
      player.nextAttackTime += player.attackTime;
    }

    if (isTargetTurn) {
      AttackTarget(fight, enemy, player, timePassed);
      enemy.previousTime = minAttackTime;
      enemy.nextAttackTime += enemy.attackTime;
    }

    fight.previousTime = fight.currentTime;
    r++;
  }

  if (player.hp > 0) {
    fight.addAction(player.index, FightEvents.VICTORY);
  }

  if (enemy.hp > 0) {
    fight.addAction(enemy.index, FightEvents.VICTORY);
  }

  const results = {
    ...fight.output(),
    victory: player.hp > 0,
    tie: player.hp <= 0 && enemy.hp <= 0,
    players: players.map((player) => ({
      id: player.id,
      hp: player.hp,
      maxHp: player.maxHp,
      chakra: player.chakra,
      maxChakra: player.maxChakra,
    })),
    scene: character.scenes.current,
  };

  character.fight.timeForNextFight = Date.now() + Math.max(5000, (results.fight.length / 2) * 1500);
  character.fight.results = results;

  return results;
}
