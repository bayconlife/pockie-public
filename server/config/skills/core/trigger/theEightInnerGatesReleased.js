const { Effect } = require("../../../effects");
const DoorEight = require("../../../effects/doorEight");
const DoorFive = require("../../../effects/doorFive");
const DoorFour = require("../../../effects/doorFour");
const DoorOne = require("../../../effects/doorOne");
const DoorSeven = require("../../../effects/doorSeven");
const DoorSix = require("../../../effects/doorSix");
const DoorThree = require("../../../effects/doorThree");
const DoorTwo = require("../../../effects/doorTwo");
const { TriggerSkill, SkillTrigger, SkillCategory, UserSkillResult } = require("../../util");

module.exports = class TheEightInnerGatesReleased extends TriggerSkill {
  trigger = SkillTrigger.AFTER_BEING_HURT;
  category = SkillCategory.BODY;
  mpModifier = 0;
  probability = 100;
  doorTime = 1000;
  backDamage = 0;
  lastTime = -1000;

  onLevel(level) {}

  onUse(fight, source, target) {
    if (fight.currentTime - this.lastTime < this.doorTime) {
      return UserSkillResult.SKILL_LOSE;
    }

    this.lastTime = fight.currentTime;

    const doorTime = Math.floor(this.doorTime / (1 + source.SkillAdd5 * 0.0001));

    if (source.hasEffect(Effect.DOOR_ONE)) {
      fight.removeEffect(this.action, source, Effect.DOOR_ONE);
      fight.addEffect(this.action, source, new DoorTwo(source, doorTime));
    } else if (source.hasEffect(Effect.DOOR_TWO)) {
      fight.removeEffect(this.action, source, Effect.DOOR_TWO);
      fight.addEffect(this.action, source, new DoorThree(source, doorTime));
    } else if (source.hasEffect(Effect.DOOR_THREE)) {
      fight.removeEffect(this.action, source, Effect.DOOR_THREE);
      fight.addEffect(this.action, source, new DoorFour(source, doorTime));
    } else if (source.hasEffect(Effect.DOOR_FOUR)) {
      fight.removeEffect(this.action, source, Effect.DOOR_FOUR);
      fight.addEffect(this.action, source, new DoorFive(source, doorTime));
    } else if (source.hasEffect(Effect.DOOR_FIVE)) {
      fight.removeEffect(this.action, source, Effect.DOOR_FIVE);
      fight.addEffect(this.action, source, new DoorSix(source, doorTime));
    } else if (source.hasEffect(Effect.DOOR_SIX)) {
      fight.removeEffect(this.action, source, Effect.DOOR_SIX);
      fight.addEffect(this.action, source, new DoorSeven(source, doorTime));
    } else if (source.hasEffect(Effect.DOOR_SEVEN)) {
      fight.removeEffect(this.action, source, Effect.DOOR_SEVEN);
      fight.addEffect(this.action, source, new DoorEight(source, doorTime));
    } else if (source.hasEffect(Effect.DOOR_EIGHT)) {
      return UserSkillResult.SKILL_LOSE;
    } else {
      fight.addEffect(this.action, source, new DoorOne(source, doorTime));
    }

    return UserSkillResult.SKILL_SUCCESS;
  }
}