import { User } from '../../components/classes';
import { QuestType } from '../../enums';
import { CustomSocket, Quest } from '../../interfaces';
import { Quests } from '../../resources/quests';

function addProps(type: number) {
  switch (type) {
    case QuestType.Collect:
    case QuestType.Kill:
      return { current: 0 };
  }

  return {};
}

export function addAvailableQuest(user: User, id: number) {
  user.quests.available.push(createQuest(id));
}

export function createQuest(id: number): Quest {
  const quest = Quests[id];
  const steps = quest.steps.map((step) => ({ ...step, ...addProps(step.type) }));
  const fullQuest: Quest = {
    id,
    ...quest,
    steps,
    step: 0,
    completed: false,
  };

  return fullQuest;
}

export async function findQuestsAvailableOnLevelUp(socket: CustomSocket, level: number) {
  const user = await socket.getCharacter();

  return Object.entries(Quests)
    .filter((entry) => {
      const levelMet = entry[1].level === level;
      const requiredQuestsMet = (entry[1] as Quest).requires.every((requiredQuest) => user.quests.completed.includes(requiredQuest));

      return levelMet && requiredQuestsMet;
    })
    .map((entry) => parseInt(entry[0], 10));
}

export async function emitQuests(socket: CustomSocket, character: User) {
  socket.emit('updateQuests', {
    inProgress: character.quests.inProgress,
    available: character.quests.available,
    completed: character.quests.completed,
  });
}
