import { Callback, SocketFunction } from '../../types';
import { CustomSocket } from '../../interfaces';
import { calculateStatsV2 } from './stats';
import { error } from '../kernel/errors';
import { SKILL_CONFIG } from '../../resources/skills';
import { randomInt } from '../../components/random';
import { GameModule, User } from '../../components/classes';
import { updateCharacter } from '../kernel/cache';
import { onRequestLoginData, onRequestLoginServerData } from '../kernel/pubSub';

interface SetSkillInput {
  slot: number;
  id: number;
}

const MODULE_NAME = 'Skills';

onRequestLoginData(MODULE_NAME, (character) => ({
  skills: character.skills,
  skillsKnown: character.skillsKnown,
}));

onRequestLoginServerData(MODULE_NAME, (config) => ({
  skill_info: config.Skills.SKILL_INFO,
}));

export async function emitSkills(socket: CustomSocket, character: User) {
  socket.emit('updateSkillsKnown', character.skillsKnown);
}

export function generateRandomSkill() {
  return SKILL_CONFIG.core[randomInt(0, SKILL_CONFIG.core.length - 1)];
}

export function generateUnlearnedSkill(user: User) {
  let id = generateRandomSkill();

  while (user.skillsKnown.find((skill) => skill.id === id)) {
    id = generateRandomSkill();
  }

  return id;
}

const setSkill: SocketFunction<{ slot: number; id: number }> = async (socket, character, { slot, id }, cb) => {
  if (slot > 6) {
    return error(socket, 'Invalid slot selected');
  }

  if (character.skillsKnown.find((skill) => skill.id === id) === undefined) {
    return error(socket, 'Invalid skill selected');
  }

  if (character.skills.includes(id)) {
    return error(socket, 'error__skill_already_selected');
  }

  character.skills[slot] = id;
  character.stats = calculateStatsV2(socket, character);

  cb();
};

const removeSkill: SocketFunction<{ slot: number }> = async (socket, character, { slot }, cb) => {
  if (slot > 6) {
    return error(socket, 'Invalid slot selected');
  }

  character.skills[slot] = null;
  character.stats = calculateStatsV2(socket, character);

  cb();
};

const resetSkills: SocketFunction = async (socket, character, data, cb) => {
  const amount = character.skillsKnown.length;

  character.skills = [];
  character.skillsKnown = [];

  for (let i = 0; i < SKILL_CONFIG.core.length; i++) {
    character.skillsKnown.push({
      id: generateUnlearnedSkill(character),
      level: 1,
    });
  }

  character.stats = calculateStatsV2(socket, character);

  return [emitSkills];
};

export default class SkillModule extends GameModule {
  moduleName = MODULE_NAME;
  modules = {
    setSkill: setSkill,
    removeSkill: removeSkill,
    resetSkills: resetSkills,
  };
}
