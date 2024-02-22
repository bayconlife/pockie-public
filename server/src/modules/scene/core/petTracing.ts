import { SocketFunction } from '../../../types';
import { GameModule } from '../../../components/classes';
import { onLogin, onRequestLoginData } from '../../../modules/kernel/pubSub';
import { randomInt } from '../../../components/random';
import { Item } from '../../../interfaces';
import { addItemToLocation, createItem, emitItems, getItemLocation } from '../../../modules/items/itemSystem';
import { getTomorrow } from '../../../modules/kernel/time';
import { dropItems } from '../../../modules/drop/drops';
import { addItemToContainer } from '../../../modules/items/container';
import { ItemLocations } from '../../../enums';
import { addItem } from '../../../modules/items/inventory';
import { error } from '../../../modules/kernel/errors';

const MODULE_NAME = 'PetTracing';

onLogin(MODULE_NAME, (socket, character) => {
  if (character.petTracing === undefined) {
    character.petTracing = {
      board: [],
      powers: [0, 0, 0],
      score: 0,
      highScore: 0,
      attemptsLeft: 0,
      resetTime: 0,
      started: false,
    };
  }

  if (character.petTracing.resetTime > Date.now()) {
    return;
  }

  if (character.petTracing.board.length === 0) {
    character.petTracing.board = createPetTraceBoard();
  }

  character.petTracing.attemptsLeft = socket.getConfig().PetTracing.perDay;
  character.petTracing.score = 0;
  character.petTracing.resetTime = getTomorrow();
});

onRequestLoginData(MODULE_NAME, (c) => ({
  petTracing: c.petTracing,
}));

function generateCell(i: number) {
  switch (i) {
    case 0:
      return randomInt(2, 3);
    case 1:
      return randomInt(2, 4);
    case 2:
      return randomInt(3, 4);
    case 3:
      return randomInt(1, 3);
    case 4:
      return randomInt(1, 4);
    case 5:
      return [1, 3, 4][randomInt(0, 2)];
    case 6:
      return randomInt(1, 2);
    case 7:
      return [1, 2, 4][randomInt(0, 2)];
    case 8:
      return [1, 4][randomInt(0, 1)];
    default:
      return 0;
  }
}

function createPetTraceBoard() {
  const board: number[] = [];

  for (let i = 0; i < 9; i++) {
    // 1 - up, 2 - right, 3 - down, 4 - left
    board[i] = generateCell(i);

    if (randomInt(0, 99) < 10) {
      // broken
      board[i] += 10;
    }

    if (randomInt(0, 99) < 10) {
      // mystery
      board[i] = 0;
    }
  }

  return board;
}

const buyPetTraceAttempts: SocketFunction = async (socket, character, _, cb) => {
  const amount = socket.getConfig().PetTracing.refreshCost;

  if (character.currency.giftCertificates < amount) {
    return error(socket, 'error__invalid_currency');
  }

  character.petTracing.attemptsLeft = Math.min(character.petTracing.attemptsLeft + socket.getConfig().PetTracing.perDay, 9999);
  character.currency.giftCertificates -= amount;

  socket.emit('updateCharacter', {
    currency: character.currency,
    petTracing: character.petTracing,
  });
};

const claimPetTraceRewards: SocketFunction = async (socket, character, _, cb) => {
  // TODO use container logic
  Object.keys(character.items)
    .filter((uid) => getItemLocation(character.items[uid]) === ItemLocations.PetTrace)
    .forEach((uid) => addItem(character, character.items[uid]));

  return [emitItems];
};

const newPetTraceBoard: SocketFunction = async (socket, character, _, cb) => {
  if (!character.petTracing.started) {
    return error(socket, 'error__play_current_board');
  }

  character.petTracing.board = createPetTraceBoard();
  character.petTracing.started = false;

  socket.emit('updateCharacter', {
    petTracing: character.petTracing,
  });

  cb();
};

const startPetTracingBoard: SocketFunction<number> = async (socket, character, starting, cb) => {
  if (character.petTracing.attemptsLeft <= 0) {
    return error(socket, 'error__no_more_attempts');
  }

  if (character.petTracing.started) {
    return error(socket, 'error__board_completed_already');
  }

  const config = socket.getConfig().PetTracing;
  const reveal: { [idx: number]: number } = {};
  const board = character.petTracing.board.map((dir, idx) => {
    if (dir === 0) {
      dir = generateCell(idx);
      reveal[idx] = dir;
    }

    return dir;
  });
  let finished = false;
  let nextPosition = starting;
  const route: number[] = [];
  const rewards: Item[] = [];

  if (board[starting] > 10) {
    return error(socket, 'error__cannot_start_on_broken_card');
  }

  while (!finished) {
    let item = dropItems(socket, config.rewards[route.length]);

    if ([100001, 100002, 100003].includes(item[0].iid)) {
      const power = [100001, 100003, 100002].indexOf(item[0].iid);

      character.petTracing.powers[power] = Math.min(character.petTracing.powers[power] + 1, 99);
    }

    route.push(nextPosition);
    rewards.push(item[0]);
    let direction = board[nextPosition];

    nextPosition = (() => {
      switch (direction) {
        case 1:
          return nextPosition - 3;
        case 2:
          return nextPosition + 1;
        case 3:
          return nextPosition + 3;
        case 4:
          return nextPosition - 1;
        default:
          return -1;
      }
    })();

    if (
      nextPosition < 0 ||
      nextPosition > board.length ||
      nextPosition === -1 ||
      route.includes(nextPosition) ||
      board[nextPosition] > 10
    ) {
      finished = true;
    }
  }

  rewards.forEach((item) => {
    if (![100001, 100002, 100003].includes(item.iid)) {
      addItemToContainer(character, item, { locations: [ItemLocations.PetTrace], rows: 6, rowLength: 4 });
    }
  });

  character.petTracing.score += config.score[rewards.length - 1];
  character.petTracing.attemptsLeft -= 1;
  character.petTracing.started = true;
  character.petTracing.board = board;

  if (character.petTracing.score > character.petTracing.highScore) {
    character.petTracing.highScore = character.petTracing.score;
    // add to leaderboard
  }

  cb({ route, rewards, trace: character.petTracing });
};

const usePetTracingPower: SocketFunction<number> = async (socket, character, position, cb) => {
  const board = character.petTracing.board;
  const power = board[position] === 0 ? 2 : board[position] > 10 ? 0 : 1;

  if (character.petTracing.powers[power] <= 0) {
    return error(socket, 'error__no_power_left');
  }

  const direction = board[position];

  if (power === 0 && direction > 10) {
    board[position] -= 10;
  } else if (power === 1 && direction !== 0) {
    board[position] = (() => {
      switch (position) {
        case 0:
          return direction === 2 ? 3 : 2;
        case 1:
          return direction === 4 ? 2 : direction + 1;
        case 2:
          return direction === 3 ? 4 : 3;
        case 3:
          return direction === 3 ? 1 : direction + 1;
        case 4:
          return direction === 4 ? 1 : direction + 1;
        case 5:
          return direction === 1 ? 3 : direction === 4 ? 1 : 4;
        case 6:
          return direction === 2 ? 1 : 2;
        case 7:
          return direction === 4 ? 1 : direction === 2 ? 4 : 2;
        case 8:
          return direction === 4 ? 1 : 4;
        default:
          return direction;
      }
    })();
  } else if (power === 2 && direction === 0) {
    board[position] = generateCell(position);
  }

  character.petTracing.powers[power] -= 1;

  socket.emit('updateCharacter', {
    petTracing: character.petTracing,
  });

  cb();
};

export default class PetTracingModule extends GameModule {
  moduleName = MODULE_NAME;
  modules = {
    buyPetTraceAttempts,
    claimPetTraceRewards,
    newPetTraceBoard,
    startPetTracingBoard,
    usePetTracingPower,
  };
}
