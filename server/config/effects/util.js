const EffectAssociation = {
  BENEFICIAL: 1,
  HARMFUL: 2,
  OTHER: 3,
}

const EffectRemoveType = {
  DO_NOT_REMOVE: -1,
  DURATION: 0,
  ATTACK_HIT: 1,
  START_OF_TURN: 2,
}

const FightStatType = {
  SHIELD: 1,
  SPEED: 2,
}

class CombatEffect {
	fight;
  target;
  name;
  duration;
  data;
  timeActive = 0;
  removeType = EffectRemoveType.DURATION;
  association = EffectAssociation.HARMFUL;

  constructor(target, name) {
    this.target = target;
    this.name = name;
    this.duration = 0;
  }

  add() {}
  activate(action) {}
  remove(action) {}
}

module.exports = {
	CombatEffect,
	EffectAssociation,
	EffectRemoveType,
  FightStatType,
}