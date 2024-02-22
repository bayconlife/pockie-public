import { IConfig } from 'config';

interface AchievementsByType {
  [key: number]: any;
}

interface Achievements {
  [key: string]: {
    requirements: any[];
    rewards: any[][];
  };
}

interface RewardType {
  [key: string]: number;
}

export interface AchievementConfig {
  Achievements: {
    Achievements: Achievements;
    AchievementsByType: AchievementsByType;
    RewardType: RewardType;
  };
}

export default function achievementLoader(config: IConfig) {
  return {
    Achievements: {
      Achievements: config.get<Achievements>('Achievements.Achievements'),
      AchievementsByType: config.get<AchievementsByType>('Achievements.AchievementsByType'),
      RewardType: config.get<RewardType>('Achievements.RewardType'),
    },
  };
}
