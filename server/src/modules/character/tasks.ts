import { SocketFunction } from '../../types';
import { GameModule, User } from '../../components/classes';
import { randomInt } from 'crypto';
import { createItem, getItemAmount, reduceItem, removeItem, setItemAmount } from '../items/itemSystem';
import { onLogin, onRequestLoginData, onWonFight } from '../kernel/pubSub';
import { CustomSocket, DailyQuest, Item } from '../../interfaces';
import { error } from '../kernel/errors';
import { getTomorrow } from '../kernel/time';
import { QuestType } from '../../resources/quests';
import { gainExp } from './level';
import { addItem } from '../items/inventory';
import { notice } from '../kernel/notices';
import { dropItems } from '../drop/drops';
import { createAddItemPatch, createReduceItemPatch, createRemoveItemPatch } from '../items/patches/inventoryPatch';
import { emitItemPatches } from '../items/patches';

const MODULE_NAME = 'Tasks';

onLogin(MODULE_NAME, (socket, character) => {
  if (character.tasks === undefined) {
    character.tasks = {};
  }

  if (character.tasks.daily === undefined) {
    character.tasks.daily = {
      available: [],
      inProgress: [],
      nextRefreshTime: 0,
      resetTime: 0,
    };
  }

  character.tasks.daily.available = character.tasks.daily.available.filter((q) => q !== null);
  character.tasks.daily.inProgress = character.tasks.daily.inProgress.filter((q) => q !== null);

  character.tasks.daily.nextRefreshTime = 0;

  if (character.tasks.daily.resetTime > Date.now()) {
    return;
  }

  character.tasks.daily.available = _generateWeightedQuestList(socket, character);
  character.tasks.daily.resetTime = getTomorrow();
});

onRequestLoginData(MODULE_NAME, (character) => ({
  tasks: character.tasks,
}));

onWonFight(MODULE_NAME, (socket, character, id) => {
  if (character.tasks === undefined || character.tasks.daily === undefined) {
    return [[], []];
  }

  const itemList: any[] = [];
  let updateQuests = false;

  character.tasks.daily.inProgress.forEach((quest) => {
    if (quest.steps[quest.step].type === 2 && quest.steps[quest.step].monster.toString() === id.toString()) {
      quest.steps[quest.step].current = Math.min(quest.steps[quest.step].current + 1, quest.steps[quest.step].amount);

      quest.steps[quest.step];

      if (quest.steps[quest.step].current >= quest.steps[quest.step].amount) {
        _completeTaskStep(quest);
      }

      updateQuests = true;
    }

    if (quest.steps[quest.step].type === QuestType.Collect && quest.steps[quest.step].monster.toString() === id.toString()) {
      if (randomInt(0, 99) < quest.steps[quest.step].rate) {
        quest.steps[quest.step].current = Math.min(quest.steps[quest.step].current + 1, quest.steps[quest.step].amount);

        if (quest.steps[quest.step].current >= quest.steps[quest.step].amount) {
          _completeTaskStep(quest);
        }

        itemList.push(quest.steps[quest.step].item);

        updateQuests = true;
      }
    }
  });

  return [[_emitTasks], itemList];
});

function _completeTaskStep(task: DailyQuest) {
  if (task.step === task.steps.length - 1) {
    task.completed = true;
  } else {
    task.step += 1;
  }
}

function _emitTasks(socket: CustomSocket, character: User) {
  socket.emit('updateCharacter', {
    tasks: character.tasks,
  });
}

function _generateWeightedQuestList(socket: CustomSocket, character: User): DailyQuest[] {
  const config = socket.getConfig().Tasks;
  const currentTasks = character.tasks?.daily?.inProgress.map((q) => q.id) ?? [];
  const weightedQuestList = Object.keys(config.QUESTS).map((taskId) => [Number(taskId), config.QUESTS[Number(taskId)].weight]);
  // .filter((line) => !currentTasks.includes(line[0]));
  let weightedQuestTotal = weightedQuestList.reduce((sum, q) => {
    sum += q[1];
    return sum;
  }, 0);

  function _generateWeightedQuest(): DailyQuest {
    const r = randomInt(0, weightedQuestTotal - 1);
    let questId = 0;

    for (let i = 0, runningTotal = 0; i < weightedQuestList.length; i++) {
      const q = weightedQuestList[i];

      runningTotal += q[1];

      if (runningTotal + q[1] > r) {
        questId = q[0];
        // weightedQuestTotal -= q[1];
        // weightedQuestList.splice(i, 1);

        break;
      }
    }

    return {
      id: questId,
      ...config.QUESTS[questId],
      rewards: {
        ...config.QUESTS[questId].rewards,
        items: config.QUESTS[questId].rewards.items?.map(([iid, amount]) => [createItem(socket, iid), amount]),
      },
      step: 0,
      completed: false,
    };
  }

  return [
    _generateWeightedQuest(),
    _generateWeightedQuest(),
    _generateWeightedQuest(),
    _generateWeightedQuest(),
    _generateWeightedQuest(),
  ].sort((a, b) => b.grade - a.grade);
}

const abandonTask: SocketFunction<number> = async (socket, character, idx, cb) => {
  if (character.tasks === undefined) {
    return error(socket, 'error__tasks_not_initialized');
  }

  if (character.tasks.daily === undefined) {
    return error(socket, 'error__daily_tasks_not_initialized');
  }

  if (idx < 0 || idx > character.tasks.daily.inProgress.length) {
    return error(socket, 'error__invalid_index');
  }

  character.tasks.daily.inProgress.splice(idx, 1)[0];

  socket.emit('updateCharacter', {
    tasks: character.tasks,
  });

  cb();

  return [_emitTasks];
};

const acceptTask: SocketFunction<number> = async (socket, character, idx, cb) => {
  if (character.tasks === undefined) {
    return error(socket, 'error__tasks_not_initialized');
  }

  if (character.tasks.daily === undefined) {
    return error(socket, 'error__daily_tasks_not_initialized');
  }

  if (idx < 0 || idx > character.tasks.daily.available.length) {
    return error(socket, 'error__invalid_index');
  }

  if (character.tasks.daily.inProgress.length >= 10) {
    return error(socket, 'error__tasks_full');
  }

  const task = character.tasks.daily.available.splice(idx, 1)[0];

  character.tasks.daily.inProgress.push(task);

  cb();

  return [_emitTasks];
};

const deliverTaskItem: SocketFunction<number> = async (socket, character, idx, cb) => {
  if (character.tasks === undefined) {
    return error(socket, 'error__tasks_not_initialized');
  }

  if (character.tasks.daily === undefined) {
    return error(socket, 'error__daily_tasks_not_initialized');
  }

  if (idx < 0 || idx >= character.tasks.daily.inProgress.length) {
    return error(socket, 'error__invalid_index');
  }

  const task = character.tasks.daily.inProgress[idx];

  if (task.completed) {
    return error(socket, 'error__finished_complete');
  }

  const step = task.steps[task.step];

  if (step.type !== QuestType.GiveItem) {
    return error(socket, 'error__invalid_step_type');
  }

  let items = Object.keys(character.items)
    .filter((k) => character.items[k].iid === step.item)
    .map((k) => character.items[k]);

  if (items.reduce((sum, i) => (sum += getItemAmount(i)), 0) < step.amount) {
    return notice(socket, `Not enough [[item__${step.item}--name]] found.`);
  }

  const inventoryUpdate = [];

  for (let i = items.length - 1, itemsLeft = step.amount; i >= 0 && itemsLeft > 0; i--) {
    const count = getItemAmount(items[i]);

    if (count > itemsLeft) {
      inventoryUpdate.push(createReduceItemPatch(items[i], itemsLeft));
      reduceItem(character, items[i], itemsLeft);
    } else {
      itemsLeft -= count;

      inventoryUpdate.push(createRemoveItemPatch(items[i]));
      removeItem(character, items[i]);
    }
  }

  _completeTaskStep(task);

  emitItemPatches(socket, inventoryUpdate);

  return [_emitTasks];
};

const talkToNpcForTask: SocketFunction<number> = async (socket, character, npc, cb) => {
  if (character.tasks === undefined) {
    return error(socket, 'error__tasks_not_initialized');
  }

  if (character.tasks.daily === undefined) {
    return error(socket, 'error__daily_tasks_not_initialized');
  }

  const task = character.tasks.daily.inProgress.find((t) => t.steps[t.step].npc === npc);

  if (task === undefined || task.completed) {
    return error(socket, 'error__invalid_npc');
  }

  _completeTaskStep(task);

  cb();

  return [_emitTasks];
};

const refreshTasks: SocketFunction = async (socket, character, data, cb) => {
  if (character.tasks === undefined) {
    return error(socket, 'error__tasks_not_initialized');
  }

  if (character.tasks.daily === undefined) {
    return error(socket, 'error__daily_tasks_not_initialized');
  }

  if (character.tasks.daily.nextRefreshTime > Date.now()) {
    return error(socket, 'error__not_enough_time_has_passed');
  }

  character.tasks.daily.available = _generateWeightedQuestList(socket, character);
  character.tasks.daily.nextRefreshTime = Date.now() + 30 * 60 * 1000 * 0;

  cb();

  return [_emitTasks];
};

const turnInTask: SocketFunction<number> = async (socket, character, idx, cb) => {
  if (character.tasks === undefined) {
    return error(socket, 'error__tasks_not_initialized');
  }

  if (character.tasks.daily === undefined) {
    return error(socket, 'error__daily_tasks_not_initialized');
  }

  if (idx < 0 || idx >= character.tasks.daily.inProgress.length) {
    return error(socket, 'error__invalid_index');
  }

  // if (!character.tasks.daily.inProgress[idx].completed) {
  //   return error(socket, 'error__task_not_complete');
  // }

  const task = character.tasks.daily.inProgress.splice(idx, 1)[0];
  const itemPatches: any[] = [];

  if (task.rewards.exp) {
    gainExp(socket, character, task.rewards.exp);
  }

  if (task.rewards.stones) {
    character.stones += Number(task.rewards.stones);
  }

  if (task.rewards.items) {
    task.rewards.items.forEach(([item, amount]: [Item, number]) => {
      setItemAmount(item, amount);

      if (!addItem(character, item)) {
        notice(socket, `Failed to gain [[item__${item.iid}--name]] due to full bag.`);
      } else {
        itemPatches.push(createAddItemPatch(item));
      }
    });
  }

  if (task.rewards.table) {
    const items = dropItems(socket, task.rewards.table);

    items.forEach((i) => {
      if (!addItem(character, i)) {
        notice(socket, `Failed to gain [[item__${i.iid}--name]] due to full bag.`);
      } else {
        notice(socket, `Gained [[item__${i.iid}--name]].`);
        itemPatches.push(createAddItemPatch(i));
      }
    });
  }

  cb(true);

  emitItemPatches(socket, itemPatches);
};

export default class TaskModule extends GameModule {
  moduleName = MODULE_NAME;
  modules = {
    abandonTask,
    acceptTask,
    deliverTaskItem,
    refreshTasks,
    talkToNpcForTask,
    turnInTask,
  };
}
