import { t } from 'i18next';
import { QuestState, QuestType } from '../enums';

export function getAcceptLocation(quest: any) {
  return t(`npc__${quest.acceptFrom}--name`);
}

export function getCurrentProgress(quest: any) {
  return getProgressForStep(quest.steps[quest.step]);
}

export function getProgress(quest: any) {
  let progress = '';

  quest.steps.forEach((step: any) => {
    progress += getProgressForStep(step) + '<br/>';
  });

  return progress;
}

export function getProgressForStep(step: any) {
  const replaceKey = '%';
  const progress = t(`subquest__${step.type}--progress`);

  switch (step.type) {
    case QuestType.COLLECT:
      return progress
        .replace(replaceKey, step.current)
        .replace(replaceKey, step.amount)
        .replace(replaceKey, t(`item__${step.item}--name`))
        .replace(replaceKey, t(`monster__${step.monster}--name`));
    case QuestType.KILL:
      return progress
        .replace(replaceKey, step.current)
        .replace(replaceKey, step.amount)
        .replace(replaceKey, t(`monster__${step.monster}--name`));
    case QuestType.TALK:
      return progress.replace(replaceKey, t(`npc__${step.npc}--name`));
    case QuestType.GIVE_ITEM:
      return progress.replace(replaceKey, step.amount).replace(replaceKey, t(`item__${step.item}--name`));
  }

  return progress;
}

export function getRequirementForStep(step: any) {
  const replaceKey = '%';
  const progress = t(`subquest__${step.type}--requirement`);

  switch (step.type) {
    case QuestType.COLLECT:
      return progress
        .replace(replaceKey, step.amount)
        .replace(replaceKey, t(`item__${step.item}--name`))
        .replace(replaceKey, t(`monster__${step.monster}--name`));
    case QuestType.KILL:
      return progress.replace(replaceKey, step.amount).replace(replaceKey, t(`monster__${step.monster}--name`));
    case QuestType.TALK:
      return progress.replace(replaceKey, t(`npc__${step.npc}--name`));
    case QuestType.GIVE_ITEM:
      return progress.replace(replaceKey, step.amount).replace(replaceKey, t(`item__${step.item}--name`));
  }

  return progress;
}

export function getQuestIcon(state: QuestState) {
  switch (state) {
    case QuestState.AVAILABLE:
      return 'UIResource.NpcStatus.UnAccept';
    case QuestState.CANT_ACCEPT:
      return 'UIResource.NpcStatus.CantAccept';
    case QuestState.IN_PROGRESS:
      return 'UIResource.NpcStatus.Accept';
    case QuestState.INTERACT:
      return 'UIResource.NpcStatus.SubAccept';
    case QuestState.TURN_IN:
      return 'UIResource.NpcStatus.GetPrize';
  }
}

export function getQuestIconSize(state: QuestState) {
  switch (state) {
    case QuestState.CANT_ACCEPT:
    case QuestState.AVAILABLE:
      return { width: 18, height: 52 };
    case QuestState.INTERACT:
      return { width: 34, height: 52 };
    case QuestState.IN_PROGRESS:
    case QuestState.TURN_IN:
      return { width: 33, height: 52 };
  }
  return { width: 0, height: 0 };
}

export function getTurnInLocation(quest: any) {
  return t(`npc__${quest.turnIn}--name`);
}
