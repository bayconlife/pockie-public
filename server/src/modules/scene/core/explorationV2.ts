import { CustomSocket, Item } from '../../../interfaces';
import { CARDS } from '../../../resources/cards';
import { cardsCreate, emitCards } from './cards';
import { EXPLORATION, EXPLORATION_CLIENT_DATA } from '../../../resources/exploration';
import { Callback, SocketFunction } from '../../../types';
import { error } from '../../kernel/errors';
import { CONTAINER_INVENTORY, addItem } from '../../items/inventory';
import { createItem, createMonsterItem, emitItems } from '../../items/itemSystem';
import { GameModule, PetAttemptCard, User } from '../../../components/classes';
import Events, { onLogin, onRequestLoginData, onRequestLoginServerData, onWonFight } from '../../kernel/pubSub';
import { getTomorrow } from '../../../modules/kernel/time';
import { getIndexFromWeightedGroup, randomInt } from '../../../components/random';
import { addItemToContainer } from '../../../modules/items/container';
import { notice } from '../../../modules/kernel/notices';
import { fight } from '../../../modules/fight/combat';
import { emitFight } from '../../../modules/fight/fightSystem';
import { emitStones } from '../../../modules/character/character';
import { emitLevelStats } from '../../../modules/character/stats';
import { gainExp } from '../../../modules/character/level';

const MODULE_NAME = 'ExplorationV2';

onLogin(MODULE_NAME, (socket, character) => {
  if (character.explorationV2 === undefined) {
    character.explorationV2 = {
      attemptsToday: 0,
      resetTime: 0,
      cards: {
        shown: [],
        cards: [],
        selected: -1,
      },
      scenes: {},
    };
  }

  if (
    character.explorationV2.cards.selected !== -1 &&
    !character.explorationV2.cards.shown.includes(character.explorationV2.cards.selected)
  ) {
    character.explorationV2.cards.shown.push(character.explorationV2.cards.selected);
  }

  if (character.explorationV2.resetTime > Date.now()) {
    return;
  }

  character.explorationV2.attemptsToday = 0;
  character.explorationV2.resetTime = getTomorrow();
});

onRequestLoginData(MODULE_NAME, (character) => ({
  exploration: _buildClientExplorationData(character),
}));

onRequestLoginServerData(MODULE_NAME, (config) => ({
  exploration: EXPLORATION_CLIENT_DATA,
}));

onWonFight(MODULE_NAME, (socket, character, monsterId, scene) => {
  if (socket.getConfig().Exploration.SCENES[scene] === undefined) {
    return [[]];
  }

  if (character.explorationV2 === undefined) {
    character.explorationV2 = {
      attemptsToday: 0,
      resetTime: 0,
      cards: {
        shown: [],
        cards: [],
        selected: -1,
      },
      scenes: {},
    };
  }

  if (character.explorationV2.scenes[scene] === undefined) {
    character.explorationV2.scenes[scene] = {
      normal: [0, 0, 0, socket.getConfig().Exploration.SCENES[scene].normal.attemptsNeededForStarUp],
      key: [],
    };
  }

  character.explorationV2.scenes[scene].normal[0] += 1;

  return [[emitExploration]];
});

const explore: SocketFunction = async (socket, character, _, cb) => {
  const scene = character.scenes.current;

  if (character.explorationV2 === undefined) {
    return error(socket, 'error__invalid_exploration');
  }

  const config = socket.getConfig().Exploration.SCENES;

  if (character.explorationV2.scenes[scene] === undefined) {
    character.explorationV2.scenes[scene] = {
      normal: [0, 0, 0, config[scene].normal.attemptsNeededForStarUp],
      key: [],
    };
  }

  if (character.explorationV2.attemptsToday >= Math.floor(7 + character.level / 10)) {
    return error(socket, 'error__out_of_daily_exploration');
  }

  if (character.explorationV2.scenes[scene].normal[0] < 10) {
    return error(socket, 'error__invalid_exploration_amount');
  }

  const explorationData = character.explorationV2.scenes[scene].normal;
  const { monsters, items, pets, rates, stones } = config[scene].normal;
  const total = rates.reduce((sum, cur) => (sum += cur), 0);

  function createCard(): [number, Item, ...any] {
    const rand = randomInt(0, total - 1);
    let selectedIdx = 0;

    for (let i = 0, cur = 0; i < rates.length; i++) {
      cur += rates[i];

      if (cur > rand) {
        selectedIdx = i;
        break;
      }
    }

    let idx = 0;

    switch (selectedIdx) {
      case 0:
        return [0, createMonsterItem(socket, monsters[randomInt(0, monsters.length - 1)])];
      case 1:
        const item = createItem(socket, 100);

        item.props.stones = stones;

        return [1, item];
      case 2:
        return [5, createItem(socket, 150046)];
      case 3:
        return [5, createItem(socket, 150078)];
      case 4:
        idx = getIndexFromWeightedGroup(pets, 2);
        return [4, createItem(socket, pets[idx][0], pets[idx][1]), randomInt(0, 99) < 50 ? true : false];
      case 5:
        idx = getIndexFromWeightedGroup(items, 2);
        return [5, createItem(socket, items[idx][0], items[idx][1])];
      default:
        return [1, createItem(socket, 170001)];
    }
  }

  character.explorationV2.attemptsToday += 1;
  character.explorationV2.cards.shown = [];
  character.explorationV2.cards.cards = [createCard(), createCard(), createCard(), createCard(), createCard()];

  explorationData[0] = 0;

  if (explorationData[1] >= 5) {
    explorationData[1] = 0;
    explorationData[2] = 1;
  } else {
    explorationData[2] += 1;

    if (explorationData[2] >= config[scene].normal.attemptsNeededForStarUp) {
      explorationData[1] += 1;
      explorationData[2] = 0;

      const { stars, starRewards } = config[scene].normal;
      const starRates = stars[explorationData[1] - 1];
      const starRoll = randomInt(0, 99);

      if (starRoll < starRates[0]) {
        if (addItem(character, createItem(socket, starRewards[0]))) {
          notice(socket, `Gained [[item__${starRewards[0]}--name}} from star up.`);
        } else {
          notice(socket, `Failed to add star reward due to inventory being full.`);
        }
      } else {
        gainExp(socket, character, starRewards[1]);
        notice(socket, `Gained ${starRewards[1]} exp from star up.`);
      }
    }
  }

  cb();

  return [emitExploration];
};

const exploreCardClaim: SocketFunction<number> = async (socket, character, idx, cb) => {
  if (character.explorationV2 === undefined) {
    return error(socket, 'error__invalid_exploration');
  }

  let selected = character.explorationV2.cards.selected;

  if (selected === -1) {
    if (!character.explorationV2.cards.shown.includes(idx)) {
      return error(socket, 'error__invalid_selection');
    }

    selected = idx;
  } else {
    if (selected !== idx) {
      return error(socket, 'error__must_take_selection');
    }
  }

  const selectedCard = character.explorationV2.cards.cards[selected];
  const type = character.explorationV2.cards.cards[selected][0];

  if (type === 0) {
    const res = fight([{ ...character.stats }], [socket.getConfig().Monsters.getMonster(selectedCard[1].iid)], character, socket, {
      ignoreFightTimer: true,
    });

    emitFight(socket, res, (c) => {
      emitStones(socket, c);
      emitLevelStats(socket, c);

      cb();
    });
  } else if (type === 1) {
    character.stones += selectedCard[1].props.stones ?? 0;

    emitStones(socket, character);
  } else if (type === 4) {
    if (selectedCard[2]) {
      if (addItemToContainer(character, selectedCard[1] as Item, CONTAINER_INVENTORY)) {
        notice(socket, 'Capture successful, visuals not implemented yet.');
        emitItems(socket, character);
      } else {
        notice(socket, 'Cannot claim item as bags are full.');
      }
    } else {
      notice(socket, 'Capture unsuccessful, visuals not implemented yet.');
    }

    cb();
  } else if (type === 5) {
    if (!addItemToContainer(character, selectedCard[1] as Item, CONTAINER_INVENTORY)) {
      notice(socket, 'Cannot claim item as bags are full.');
    } else {
      emitItems(socket, character);
    }

    cb();
  } else {
    cb();
  }

  character.explorationV2.cards = {
    shown: [],
    cards: [],
    selected: -1,
  };

  return [emitExploration];
};

const exploreCardPeek: SocketFunction<number> = async (socket, character, idx, cb) => {
  if (character.explorationV2 === undefined) {
    return error(socket, 'error__invalid_exploration');
  }

  if (character.explorationV2.cards.selected !== -1) {
    return error(socket, 'error__already_selected');
  }

  if (character.explorationV2.cards.shown.includes(idx)) {
    return error(socket, 'error__already_peeked');
  }

  if (character.explorationV2.cards.shown.length >= 3) {
    return error(socket, 'error__peek_max_reached');
  }

  if (character.stones < 10000) {
    return error(socket, 'error__not_enough_stones');
  }

  character.stones -= 10000;
  character.explorationV2.cards.shown.push(idx);

  return [emitExploration, emitStones];
};

const exploreCardSelect: SocketFunction<number> = async (socket, character, idx, cb) => {
  if (character.explorationV2 === undefined) {
    return error(socket, 'error__invalid_exploration');
  }

  if (character.explorationV2.cards.selected !== -1) {
    return error(socket, 'error__already_selected');
  }

  if (character.explorationV2.cards.shown.includes(idx)) {
    return error(socket, 'error__already_peeked');
  }

  character.explorationV2.cards.shown.push(idx);
  character.explorationV2.cards.selected = idx;

  return [emitExploration];
};

function emitExploration(socket: CustomSocket, character: User) {
  socket.emit('updateCharacter', { exploration: _buildClientExplorationData(character) });
}

function _buildClientExplorationData(character: User) {
  const shown = character.explorationV2?.cards.shown ?? [];
  const cards = character.explorationV2?.cards.cards ?? [];

  const cardData = {
    cards: cards.map((card, idx) => (shown.includes(idx) ? [card[0], card[1]] : null)),
    selected: character.explorationV2?.cards.selected ?? -1,
  };

  return {
    ...character.explorationV2,
    cards: cardData,
  };
}

export default class ExplorationV2Module extends GameModule {
  moduleName = MODULE_NAME;
  modules = {
    explore,
    exploreCardClaim,
    exploreCardPeek,
    exploreCardSelect,
  };
}
