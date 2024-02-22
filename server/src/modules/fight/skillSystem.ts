import { SkillCategory, SkillTrigger } from '../../enums';
import { CombatActor } from '../../interfaces';
import { randomInt } from '../../components/random';
import { DEFAULT_ATTACK_ID, Skills } from '../../resources/skills';
import { Skill } from '../../classes';

interface FindSkillReturn {
  skill: Skill | null;
  mustCast: Skill[];
}

function getModifiedSkillProbability(source: CombatActor, skill: Skill) {
  let skilladdvalue = 0;

  switch (skill.category) {
    case SkillCategory.FIRE:
      skilladdvalue = source.SkillAdd0;
      break;
    case SkillCategory.WATER:
      skilladdvalue = source.SkillAdd1;
      break;
    case SkillCategory.EARTH:
      skilladdvalue = source.SkillAdd2;
      break;
    case SkillCategory.LIGHTNING:
      skilladdvalue = source.SkillAdd3;
      break;
    case SkillCategory.WIND:
      skilladdvalue = source.SkillAdd4;
      break;
    case SkillCategory.BODY:
      skilladdvalue = source.SkillAdd5;
      break;
    case SkillCategory.TOOL:
      skilladdvalue = source.SkillAdd6;
      break;
    case SkillCategory.SEALING:
      skilladdvalue = source.SkillAdd7;
      break;
    case SkillCategory.ILLUSION:
      skilladdvalue = source.SkillAdd8;
      break;
    case SkillCategory.HEALING:
      skilladdvalue = source.SkillAdd9;
      break;
    default:
      return skill.probability;
  }

  return Math.round(skill.probability + (skilladdvalue % 100));
}

export function findAttackSkill(source: CombatActor): { skill: Skill; mustCast: Skill[] } {
  const mustCast: Skill[] = [];
  const canCast: { skill: Skill; modifiedProbability: number }[] = [];
  let allmul = 0;

  if (source.canUseSkill <= 0) {
    return { skill: new (Skills[DEFAULT_ATTACK_ID] as any)(1, 1), mustCast };
  }

  source.combatSkills.attack.forEach((skill) => {
    if (skill.probability >= 100) {
      mustCast.push(skill);
    } else {
      const modifiedProbability = getModifiedSkillProbability(source, skill);

      canCast.push({ skill, modifiedProbability });
      allmul += modifiedProbability;
    }
  });

  let rand = randomInt(0, Math.max(allmul, 99));

  if (rand > allmul) {
    return { skill: new (Skills[DEFAULT_ATTACK_ID] as any)(1, 1), mustCast };
  }

  for (let i = 0, totalProbability = 0; i < canCast.length; i++) {
    if (rand >= totalProbability && rand <= totalProbability + canCast[i].modifiedProbability) {
      return { skill: canCast[i].skill, mustCast };
    }

    totalProbability += canCast[i].modifiedProbability;
  }

  return { skill: new (Skills[DEFAULT_ATTACK_ID] as any)(1, 1), mustCast };
}

export function findSkillByTrigger(source: CombatActor, trigger: SkillTrigger): FindSkillReturn {
  const mustCast: Skill[] = [];
  const canCast: { skill: Skill; modifiedProbability: number }[] = [];

  if (source.combatSkills.trigger.length === 0) {
    return { skill: null, mustCast };
  }

  let allmul = 0;

  source.combatSkills.trigger.forEach((skill) => {
    if (skill.trigger !== trigger || skill.probability === 0) {
      return;
    }

    if (skill.probability >= 100) {
      mustCast.push(skill);
    } else {
      const modifiedProbability = getModifiedSkillProbability(source, skill);

      canCast.push({ skill, modifiedProbability });
      allmul += modifiedProbability;
    }
  });

  let rand = randomInt(0, Math.max(allmul, 99));

  if (rand > allmul) {
    return { skill: null, mustCast };
  }

  for (let i = 0, totalProbability = 0; i < canCast.length; i++) {
    if (rand > totalProbability && rand <= totalProbability + canCast[i].modifiedProbability) {
      return { skill: canCast[i].skill, mustCast };
    }

    totalProbability += canCast[i].modifiedProbability;
  }

  return { skill: null, mustCast };
}
