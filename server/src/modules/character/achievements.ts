import { CustomSocket } from '../../interfaces';
import { GameModule, User } from '../../components/classes';
import pubSub, { onLogin } from '../kernel/pubSub';
import { SocketFunction } from '../../types';
import { emitTitles } from './titles';

const MODULE_NAME = 'Achievements';

onLogin(MODULE_NAME, (socket, character) => {
  if (character.achievements === undefined) {
    character.achievements = {};
  }
});

pubSub.on('levelUp', (socket: CustomSocket, character: User) => {
  const achievements = socket.getConfig().Achievements.AchievementsByType[0];

  if (character.level in achievements) {
    achievements[character.level].forEach((id: number) => {
      if (!socket.data.achievements.includes[id]) {
        addAchievement(socket, character, id);
      }
    });
  }
});

const checkMissedAchievements: SocketFunction = async (socket, character, id, cb) => {
  const achievements = socket.getConfig().Achievements.Achievements;

  Object.keys(achievements).forEach((id) => {
    const achievement = achievements[id];

    if (id in character.achievements) {
      return;
    }

    if (achievement.requirements[0] === 0 && achievement.requirements[1] <= character.level && character.achievements) {
      addAchievement(socket, character, Number(id));
    }
  });

  return [emitTitles];
};

export function addAchievement(socket: CustomSocket, character: User, id: number) {
  if (id in character.achievements) {
    return;
  }

  const config = socket.getConfig().Achievements;
  const achievements = config.Achievements;

  if (id in achievements) {
    character.achievements[id] = Date.now();

    achievements[id].rewards.forEach((line) => {
      if (line[0] === config.RewardType.Title) {
        if (!character.titles.unlocked.includes(line[1])) {
          character.titles.unlocked.push(line[1]);
        }
      }
    });

    socket.emit('achievement', { id: id, rewards: achievements[id].rewards });
  }
}

export default class AchievementModule extends GameModule {
  moduleName = MODULE_NAME;
  modules = {
    checkMissedAchievements,
  };
}
