import { QuestState, QuestType } from '../enums';
import { useAppSelector } from '../hooks';

export function useNpcQuestState(npcId: number) {
  const questAvailable = useAppSelector((state) => state.quests.available);
  const questInProgress = useAppSelector((state) => state.quests.inProgress);
  const level = useAppSelector((state) => state.stats.stats.level);

  let questState = QuestState.NONE;
  const availableNpcQuests = questAvailable.filter((quest) => quest.acceptFrom === npcId);
  const turnInQuests = questInProgress.filter((quest) => quest.turnIn === npcId);
  const incompleteQuest = questInProgress.filter((quest) => !quest.completed);

  if (turnInQuests.some((quest) => quest.completed)) {
    questState = QuestState.TURN_IN;
  }

  if (turnInQuests.some((quest) => !quest.completed && quest.step === quest.steps.length)) {
    questState = QuestState.IN_PROGRESS;
  }

  if (incompleteQuest.some((quest) => quest.steps[quest.step].type === QuestType.TALK && quest.steps[quest.step].npc === npcId)) {
    questState = QuestState.INTERACT;
  }

  if (availableNpcQuests.length > 0 && availableNpcQuests.every((quest) => quest.level > level)) {
    questState = QuestState.CANT_ACCEPT;
  }

  if (availableNpcQuests.length > 0 && availableNpcQuests.some((quest) => quest.level <= level)) {
    questState = QuestState.AVAILABLE;
  }

  return questState;
}
