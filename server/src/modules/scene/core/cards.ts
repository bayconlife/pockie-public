import { randomInt } from '../../../components/random';
import { CustomSocket } from '../../../interfaces';
import { Callback, SocketFunction } from '../../../types';
import { addItem } from '../../items/inventory';
import { createItem, emitItems } from '../../items/itemSystem';
import { error } from '../../kernel/errors';
import { GameModule, User } from '../../../components/classes';

function calculateCardTotal(cards: [number, number][]) {
  return cards.reduce((sum, card) => (sum += card[1]), 0);
}

function createCardPickFunction(socket: CustomSocket, cards: [number, number][], defaultIID: number) {
  const total = calculateCardTotal(cards);

  return () => {
    const roll = randomInt(1, total);
    let cur = 0;

    return createItem(
      socket,
      (cards.find((card) => {
        cur += card[1];
        if (roll <= cur) {
          return true;
        }
        return false;
      }) ?? [defaultIID, 0])[0]
    );
  };
}

export function cardsCreate(socket: CustomSocket, character: User, cards: [number, number][], defaultIID: number, amount: number) {
  const pick = createCardPickFunction(socket, cards, defaultIID);

  character.cards = {
    shown: [],
    items: Array(amount)
      .fill(null)
      .map((_) => pick()),
  };
}

const cardCheck: SocketFunction = async (socket, character, _, cb) => {
  emitCards(socket, character);
};

const cardLook: SocketFunction<number> = async (socket, character, idx, cb) => {
  if (!character.cards) {
    return;
    // return error(socket, 'Not in a card pulling state.');
  }

  if (character.stones < 10000) {
    return error(socket, 'error__invalid_stones.');
  }

  if (idx < 0 || idx > 4) {
    return error(socket, 'Invalid index.');
  }

  character.stones -= 10000;
  character.cards?.shown.push(idx);

  cb(character.cards?.items[idx]);
};

const cardSelect: SocketFunction<number> = async (socket, character, idx, cb) => {
  if (!character.cards) {
    return error(socket, 'Not in a card pulling state.');
  }

  if (idx < 0 || idx > 4) {
    return error(socket, 'Invalid index.');
  }

  const displayItems = character.cards.items;

  delete character.cards;

  addItem(character, displayItems[idx]);

  cb(displayItems);

  return [emitItems];
};

export async function emitCards(socket: CustomSocket, character: User, cb?: Callback) {
  if (!character.cards) {
    return; // error(socket, 'Not in a card pulling state.');
  }

  socket.emit(
    'showCard',
    character.cards.items.map((item, idx) => (character.cards?.shown.includes(idx) ? item : null)),
    cb
  );
}

export default class CardModule extends GameModule {
  moduleName = 'Cards';
  modules = {
    cardCheck,
    cardLook,
    cardSelect,
  };
}
