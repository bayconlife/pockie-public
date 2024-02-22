import { Callback } from '../../../types';
import { CustomSocket } from '../../../interfaces';
import { error } from '../../kernel/errors';
import { monsters } from '../../../resources/monsters';
import pubSub, { onRequestLoginData } from '../../kernel/pubSub';
import { User } from '../../../components/classes';

const MODULE_NAME = 'Hunt';

// registerModule('Hunt', (socket, on) => {
//   on('huntBegin', (data, cb) => huntBegin(socket, data, cb));
//   on('huntComplete', (data, cb) => huntComplete(socket, data, cb));
//   on('huntInfo', (data, cb) => emitHunt(socket));
// });

// pubSub.on('fightWon', (character: User, monsterId: string) => {
//   if (character.hunt.monsters.length <= 0) {
//     return;
//   }

//   const index = character.hunt.monsters.findIndex((id, idx) => id === Number(monsterId) && !character.hunt.killed.includes(idx));

//   if (index === -1) {
//     return;
//   }

//   character.hunt.killed.push(index);
// });

onRequestLoginData(MODULE_NAME, (character: User) => {
  return {
    hunt: formatCharacterHuntData(character),
  };
});

export async function emitHunt(socket: CustomSocket) {
  const character = await socket.getUnlockedCharacter();

  socket.emit('huntInfo', formatCharacterHuntData(character));
}

function formatCharacterHuntData(character: User) {
  return {
    killed: character.hunt.killed,
    monsters: character.hunt.monsters.map((id) => ({ id, avatar: monsters[id].avatar })),
  };
}

async function huntBegin(socket: CustomSocket, data: any, cb?: Callback) {
  const character = await socket.getCharacter();

  if (character.hunt.monsters.length > 0) {
    return error(socket, 'error__hunt_in_progress');
  }

  character.hunt = {
    killed: [],
    monsters: [33017, 33017, 33017],
  };

  await socket.save(character);

  emitHunt(socket);
}

async function huntComplete(socket: CustomSocket, data: any, cb?: Callback) {
  const character = await socket.getCharacter();

  if (character.hunt.monsters.length <= 0) {
    return error(socket, 'error__hunt_not_started');
  }

  if (character.hunt.killed.length !== character.hunt.monsters.length) {
    return error(socket, 'error__hunt_not_finished');
  }

  character.hunt = {
    killed: [],
    monsters: [],
  };

  character.arena.tickets += 5;

  await socket.save(character);

  emitHunt(socket);
}

export default () => {};
