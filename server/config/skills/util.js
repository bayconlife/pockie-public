const { Effect } = require("../effects");
const { Stat } = require("../lines");

const SkillCategory = {
  INVALID: -1,
  FIRE: 0,
  WATER: 1,
  EARTH: 2,
  LIGHTNING: 3,
  WIND: 4,
  BODY: 5,
  TOOL: 6,
  SEALING: 7,
  ILLUSION: 8,
  HEALING: 9,
}

const ELEMENTAL_CATEGORIES = [SkillCategory.FIRE, SkillCategory.WATER, SkillCategory.EARTH, SkillCategory.LIGHTNING, SkillCategory.WIND];

const SkillType = {
  INVALID: 0,
  ATTACK: 1,
  PASSIVE: 2,
  TRIGGER: 3,
}

class Skill {
  static type = SkillType.INVALID;

  id;
  mpModifier;
  probability;

  level = 1;
  mpCost;
  isInitilized = false;
  removeAction = false;

  damageModifier = 0;
  action;
  uses = -1;

  category = SkillCategory.INVALID;

  constructor(id, level) {
		this.id = id;
    this.level = level;
  }

  use(fight, action, source, target) {
    if (!this.isInitilized) {
      this.isInitilized = true;
      this.onLevel(this.level);
    }

    const isElementalSkill = ELEMENTAL_CATEGORIES.includes(this.category);

    this.action = action;

    if (this.uses === 0) {
      return UserSkillResult.SKILL_CANT_USE;
    }

    if (isElementalSkill && source.hasEffect(Effect.ELEMENTAL_SEAL)) {
      return UserSkillResult.SKILL_CANT_USE;
    }

    const BaseMPCost = (200 + 20 * (source.level - 1) * (1 + ((20 + source.level - 1 + Math.round(source.level / 3 + 1) * 8 + ((Math.round((source.level - 1) / 10) * 7 + 14) / 3) * 8) / 12) * 0.01)) / 30;
    this.mpCost = Math.floor(BaseMPCost * this.mpModifier);

    if (source.hasEffect(Effect.DOUBLE_MP)) {
      this.mpCost *= 2;
    }

    if (source.chakra < this.mpCost) {
      return UserSkillResult.SKILL_NO_MANA;
    }

    if (isElementalSkill) {
      // Random chance for sunset to apply 2x damage the longer the fight goes on.
      const sunset = source.getEffect(Effect.SUNSET);

      if (sunset !== null) {
        if (fight.random(0, 99) < sunset.chance) {
          this.damageModifier += 1;
        }
      }

      if (source.hasEffect(Effect.ELEMENT_MASTERY)) {
        this.damageModifier += 0.15;
      }
    }

		const result = this.onUse(fight, source, target);

    if (result === UserSkillResult.SKILL_SUCCESS) {
      if (this.mpCost != 0) {
        fight.useChakra(action, source, this.mpCost);
      }

      this.uses -= 1;
		}

    return result;
  }

  onLevel(level) {};
  onUse(fight, source, target) {};
}

class AttackSkill extends Skill {
  static type = SkillType.ATTACK;
}

class PassiveSkill extends Skill {
  static type = SkillType.PASSIVE;
  static modifier = Stat.None;
  static amount = 0;
}

class TriggerSkill extends Skill {
  static type = SkillType.TRIGGER;
}

const FightEvents = {
  START_FIGHTING: 0,
  BEGIN_ATTACK: 1,
  END_ATTACK: 2,
  CANT_MOVE: 3,
  PRIORITY_MUL: 5,
  BACK_THROWED: 6,
  COUNTER_DAMAGE: 7,
  CHANGE_BUFF: 9,
  USER_SKILL: 14,
  BE_DIE: 20,
  CHANGE_ROLE: 21,
}

const SkillMethod = {
  NONE: 0, // Only bomb?
  RANGED: 1,
  MELEE: 2,
  MELEE_NO_ADDITIONAL_SKILLS: 3,
}

const SkillTrigger = {
  START_THE_FIGHT: 1,
  BEFORE_ATTACK: 2,
  BEFORE_BEING_ATTACKED: 3,
  AFTER_BEING_HURT: 4,
  AFTER_DEATH: 5,
  DOES_NOT_EXISTS: 6, //Why did they skip/remove ???
  MELEE_TRIGGER_AFTER_SKILL_HIT: 7,
  PET_TRIGGER_AFTER_SKILL_HIT: 8,
  MELEE_TOUCH_AFTER_BEING_HIT_BY_A_SKILL: 9,
  
  AFTER_AURA: 10,
  START_OF_TURN: 11,
}

const UserSkillResult = {
  SKILL_SUCCESS: 0,
  SKILL_NO_MANA: 1,
  SKILL_CANT_USE: 2,
  SKILL_LOSE: 3,
}

module.exports = {
	AttackSkill,
	PassiveSkill,
	TriggerSkill,
  FightEvents,
	SkillCategory,
	SkillMethod,
	SkillTrigger,
	UserSkillResult
}