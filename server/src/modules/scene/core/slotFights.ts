import { Monsters, Prizes, Scenes } from '../../../resources/slotFight';
import { SocketFunction } from '../../../types';
import { error } from '../../kernel/errors';
import { randomInt } from '../../../components/random';
import { addItem } from '../../items/inventory';
import { createItem, emitItems } from '../../items/itemSystem';
import { notice } from '../../kernel/notices';
import { fight } from '../../fight/combat';
import { dropItems } from '../../drop/drops';
import { GameModule, User } from '../../../components/classes';
import { emitFight } from '../../../modules/fight/fightSystem';
import { onLogin, onRequestLoginData } from '../../../modules/kernel/pubSub';
import { CustomSocket } from '../../../interfaces';

const MODULE_NAME = 'SlotFights';

onLogin(MODULE_NAME, (socket, character) => {
  if (character.slotFights === undefined) {
    character.slotFights = { roll: [], nextRollAt: 0 };
  }
});

onRequestLoginData(MODULE_NAME, (character) => {
  return {
    slotFights: character.slotFights,
  };
});

const slotFight: SocketFunction = async (socket, character, data, cb) => {
  if (character.slotFights.roll.length === 0) {
    return error(socket, 'Slots not spun yet.');
  }

  const monsters = character.slotFights.roll.map((id) => Monsters[id[0]]);
  const fightResult = fight([character.stats], monsters, character, socket, { allowMulti: true });
  const items: number[] = [];

  if (typeof fightResult === 'string') {
    return error(socket, fightResult);
  }

  if (fightResult.victory) {
    monsters.forEach((monster) =>
      dropItems(socket, monster.dropTable ?? 3000000, character.stats.dropPercent).forEach((item) => {
        if (addItem(character, item) !== null) {
          items.push(item.iid);
        }
      })
    );

    _newSlots(socket, character);
  }

  character.energy.current -= 3;

  socket.emit('updateCharacter', {
    energy: character.energy,
  });

  emitFight(
    socket,
    { ...fightResult, rewards: { items } },
    (c, victory) => {
      emitItems(socket, c);

      if (victory) {
        socket.emit('updateSlots', c.slotFights);
      }
    },
    fightResult.victory
  );
};

const slotRoll: SocketFunction = async (socket, character, data, cb) => {
  const scene = Scenes[character.scenes.current];

  if (scene === undefined) {
    return error(socket, 'Invalid scene for slot fight.');
  }

  if (character.slotFights.nextRollAt > Date.now()) {
    return error(socket, 'error__must_wait');
  }

  _newSlots(socket, character);

  (character.slotFights.nextRollAt = Date.now() + 30 * 60 * 1000), cb(character.slotFights);
};

function _newSlots(socket: CustomSocket, character: User) {
  const scene = Scenes[character.scenes.current];

  if (!scene) {
    console.error('Invalid slot scene', character.scenes.current);
    return error(socket, 'error__invalid_scene');
  }

  const monsters = scene.monsters;
  const matching = scene.matching ?? [];
  const roll: [number, number][] = [];

  for (let i = 0; i < 3; i++) {
    const monsterId = monsters[randomInt(0, monsters.length - 1)];
    const monster = Monsters[monsterId];

    roll[i] = [monsterId, monster.avatar];
  }

  let isMatch = false;
  let prize: number | null = null;

  // 3rd place prize
  if (roll[0] === roll[1] || roll[0] === roll[2] || roll[1] === roll[2]) {
    prize = Prizes[3];
  }

  // 2nd place prize
  if (roll[0] === roll[1] && roll[0] === roll[2]) {
    prize = Prizes[2];
  }

  // 1st place prize
  if (isMatch) {
    if (matching.length > 0) {
      matching.forEach((line) => {
        if (roll.every((monsterId) => line.includes(monsterId[0]))) {
          prize = line[3];
        }
      });
    }
  }

  if (prize !== null) {
    if (addItem(character, createItem(socket, prize)) !== null) {
      notice(socket, `You obtained [[${prize}.`);
      emitItems(socket, character);
    }
  }

  character.slotFights.roll = roll;
}

export default class SlotFightsModule extends GameModule {
  moduleName = MODULE_NAME;
  modules = {
    slotRoll,
    slotFight,
  };
}
