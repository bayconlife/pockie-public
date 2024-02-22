import { QuestType } from '../../resources/quests';
import { NpcId, SocketFunction } from '../../types';
import { addAvailableQuest, createQuest, emitQuests } from '../quests/quests';
import { emitLevelUp, gainExp } from './level';
import { UserSkills } from '../../enums';
import { emitLevelStats } from './stats';
import { GameModule, User } from '../../components/classes';
import { emitStones } from './character';
import { error } from '../kernel/errors';
import pubSub, { onRequestLoginData } from '../kernel/pubSub';
import { Quest } from '../../interfaces';
import { randomInt } from '../../components/random';

const MODULE_NAME = 'Quests';

onRequestLoginData(MODULE_NAME, (character) => ({
  quests: character.quests,
}));

const abandonQuest: SocketFunction<{ id: number }> = async (socket, character, data, cb) => {
  const idx = character.quests.inProgress.findIndex((quest) => quest.id === data.id);

  if (idx === -1) {
    return cb({ error: 'Quest not accepted.' });
  }

  character.quests.inProgress.splice(idx, 1);
  addAvailableQuest(character, data.id);

  cb();

  return [emitQuests];
};

const acceptQuest: SocketFunction<{ id: number }> = async (socket, character, data, cb) => {
  const idx = character.quests.available.findIndex((quest) => quest.id === data.id);

  if (idx === -1) {
    return socket.emit('error', 'Quest not acceptable.');
  }

  const quest = createQuest(data.id);

  if (character.level < quest.level) {
    return socket.emit('error', 'Your level is too low.');
  }

  if (quest.requires.some((requiredQuest) => !character.quests.completed.includes(requiredQuest))) {
    return socket.emit('error', "You haven't completed the required quests for this.");
  }

  character.quests.available.splice(idx, 1);
  character.quests.inProgress.push(quest);

  cb();

  return [emitQuests];
};

const completeQuest: SocketFunction<{ id: number }> = async (socket, character, data, cb) => {
  const idx = character.quests.inProgress.findIndex((quest) => quest.id === data.id);

  if (idx === -1) {
    return socket.emit('error', 'Quest not accepted.');
  }

  const quest = character.quests.inProgress[idx];
  let isValid = quest.completed;

  switch (quest.steps[quest.step].type) {
    case 3: // Talk
      isValid = quest.step >= quest.steps.length - 1;

      if (!isValid) {
        quest.step += 1;

        return [emitQuests];
      }

      break;
  }

  if (!isValid) {
    return socket.emit('error', 'Quest not ready to be finished.');
  }

  quest.completed = true;

  return [emitQuests];
};

const finishQuest: SocketFunction<{ id: number }> = async (socket, character, data, cb) => {
  const idx = character.quests.inProgress.findIndex((quest) => quest.id === data.id);

  if (idx === -1) {
    return error(socket, 'error__quest_not_accepted');
  }

  const quest = character.quests.inProgress[idx];

  if (!quest.completed) {
    return error(socket, 'error__quest_not_finished');
  }

  if (quest.rewards.stones) {
    character.stones += quest.rewards.stones;

    emitStones(socket, character);
  }

  let skills: UserSkills[] = [];

  if (quest.rewards.exp) {
    const { didLevelUp, skillsGained } = gainExp(socket, character, quest.rewards.exp);

    skills = skillsGained;

    setTimeout(() => emitLevelStats(socket, character), 200);

    if (didLevelUp) {
      setTimeout(() => emitLevelUp(socket, character, skillsGained), 200);
    }
  }

  character.quests.completed.push(quest.id);
  quest.unlocks.forEach((id) => addAvailableQuest(character, id));
  character.quests.inProgress.splice(idx, 1);

  cb();

  return [emitQuests];
};

const getQuestInfo: SocketFunction<{ id: number }> = async (socket, character, data, cb) => {
  if (character.quests.available.find((quest) => quest.id === data.id) === undefined) {
    return cb({ error: 'Quest not acceptable.' });
  }

  cb(createQuest(data.id));
};

const getQuestsForNpc: SocketFunction<{ npc: NpcId }> = async (socket, character, data, cb) => {
  const acceptedQuests = character.quests.inProgress
    .filter((quest) => {
      if (!quest.completed && quest.steps[quest.step].type === QuestType.Talk) {
        return quest.steps[quest.step].npc === data.npc;
      }

      if (quest.turnIn !== data.npc) {
        return false;
      }

      return quest.completed;
    })
    .map((quest) => quest.id);
  const questList = character.quests.available.filter((quest) => quest.acceptFrom === data.npc).map((quest) => quest.id);

  questList.push(...acceptedQuests);
  const taskList: number[][] = [];

  if (character.tasks && character.tasks.daily) {
    character.tasks.daily.inProgress
      .filter((q) => {
        if (!q.completed && q.steps[q.step].type === QuestType.Talk) {
          return q.steps[q.step].npc === data.npc;
        }

        return false;
      })
      .forEach((q) => taskList.push([q.id, q.group ?? 0]));
  }

  cb(questList, taskList);
};

pubSub.on('fightWon', (character: User, monsterId: string) => {
  let questsUpdated = false;
  const questItems: any[] = [];

  character.quests.inProgress.forEach((quest) => {
    if (quest.completed) {
      return;
    }

    if (quest.steps[quest.step].type === QuestType.Kill && quest.steps[quest.step].monster === monsterId) {
      questsUpdated = questsUpdated || updateQuestKill(quest);
    }

    if (quest.steps[quest.step].type === QuestType.Collect && quest.steps[quest.step].monster === monsterId) {
      const { updated, items } = updateQuestCollect(quest);

      questsUpdated = questsUpdated || updated;
      questItems.push(...items);
    }
  });

  return [questsUpdated, questItems];
});

function updateQuestKill(quest: Quest) {
  quest.steps[quest.step].current = Math.min(quest.steps[quest.step].current + 1, quest.steps[quest.step].amount);

  if (quest.steps[quest.step].current >= quest.steps[quest.step].amount) {
    if (quest.step === quest.steps.length - 1) {
      quest.completed = true;
    } else {
      quest.step += 1;
    }
  }

  return true;
}

function updateQuestCollect(quest: Quest) {
  if (randomInt(0, 99) >= quest.steps[quest.step].rate) {
    return { updated: false, items: [] };
  }

  quest.steps[quest.step].current = Math.min(quest.steps[quest.step].current + 1, quest.steps[quest.step].amount);

  if (quest.steps[quest.step].current >= quest.steps[quest.step].amount) {
    if (quest.step === quest.steps.length - 1) {
      quest.completed = true;
    } else {
      quest.step += 1;
    }
  }

  return { updated: true, items: [`[[item__${quest.steps[quest.step].item}--name]]`] };
}

export default class QuestModule extends GameModule {
  moduleName = MODULE_NAME;
  modules = {
    abandonQuest,
    acceptQuest,
    completeQuest,
    finishQuest,
    getQuestInfo,
    getQuestsForNpc,
  };
}
