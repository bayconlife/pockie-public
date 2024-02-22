import { IConfig } from 'config';

interface Task {
  level: number;
  grade: number;
  steps: any[];
  rewards: {
    exp?: number;
    items?: [number, number][];
    table?: number;
  };
  weight: number;
}

interface Tasks {
  [taskId: number]: Task;
}

export function serverTasksLoader(config: IConfig) {
  const quests = config.get('Tasks.Quests') as Tasks;
  const weightedQuestList = Object.keys(quests).map((taskId) => [Number(taskId), quests[Number(taskId)].weight]);
  const weightedQuestTotal = weightedQuestList.reduce((sum, q) => {
    sum += q[1];
    return sum;
  }, 0);

  return {
    QUESTS: quests,
    WEIGHTED_QUEST_LIST: weightedQuestList,
    WEIGHTED_QUEST_TOTAL: weightedQuestTotal,
  };
}
