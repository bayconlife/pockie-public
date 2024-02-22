import { CustomSocket } from '../../interfaces';
import { User } from '../../components/classes';
import { emitSkills, generateUnlearnedSkill } from './skills';
import { UserSkills } from '../../enums';
import { SKILL_CONFIG } from '../../resources/skills';
import pubSub from '../kernel/pubSub';

export function expNeededForLevel(socket: CustomSocket, level: number) {
  return socket.getConfig().Leveling.EXP_FOR_LEVEL[level] ?? 999999999;
}

export function gainExp(socket: CustomSocket, user: User, amount: number = 0) {
  const { Config } = socket.getConfig().Leveling;

  if (user.level >= Config.maxLevel) {
    return {
      didLevelUp: false,
      skillsGained: [],
    };
  }

  const bonus = 1 + (user.stats.expPercent ?? 0) / 100;
  user.exp += Number(amount * bonus);

  let didLevelUp = false;
  const skillsGained = [];

  while (user.exp >= expNeededForLevel(socket, user.level + 1) && user.level < Config.maxLevel) {
    user.level += 1;
    didLevelUp = true;

    while (user.skillsKnown.length < SKILL_CONFIG.core.length && user.skillsKnown.length < user.level) {
      const newSkillId = generateUnlearnedSkill(user);
      user.skillsKnown.push({ id: newSkillId, level: 1 });
      skillsGained.push(newSkillId);
    }

    pubSub.emit('levelUp', socket, user);
  }

  if (user.level >= Config.maxLevel) {
    user.level = Config.maxLevel;
    user.exp = expNeededForLevel(socket, user.level);
  }

  return {
    didLevelUp,
    skillsGained,
  };
}

export function emitLevelUp(socket: CustomSocket, character: User, skillsGained: UserSkills[]) {
  socket.emit('levelUp', skillsGained);

  if (skillsGained.length > 0) {
    emitSkills(socket, character);
  }
}
