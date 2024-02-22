import { SERVERS } from '../../resources/servers';
import { CustomSocket } from '../../interfaces';
import { User } from '../../components/classes';
import { updateItems } from '../items/itemSystem';
import { calculateStatsV2 } from './stats';
import pubSub from '../kernel/pubSub';
import { updateCharacter } from '../kernel/cache';

export async function updateCharacterAfterLogin(socket: CustomSocket) {
  const serverId = socket.getServerId();
  // let character = await socket.getCharacter();

  await updateCharacter(socket, (character) => {
    const unlock = character.unlock;

    // if (character.version !== SERVERS[serverId].config.get('version')) {
    // This will add any missing keys, won't remove old keys though.
    // try {
    //   const deepCopy = (base: any, current: any, copy: any) => {
    //     Object.keys(base).forEach((key) => {
    //       if (key in current) {
    //         copy[key] = current[key];
    //       } else {
    //         copy[key] = base[key];
    //       }

    //       if (typeof base[key] === 'object' && !Array.isArray(base[key]) && !!base[key]) {
    //         deepCopy(base[key], current[key] ?? {}, copy[key] ?? {});
    //       }
    //     });

    //     return copy;
    //   };

    //   character = deepCopy(new User(), character, {}) as User;
    // } catch (e) {
    //   console.error(e);
    // }

    character.version = SERVERS[serverId].config.get('version');
    updateItems(socket, character);
    // }

    pubSub.emit('login', socket, character);

    character.stats = calculateStatsV2(socket, character);
    character.unlock = unlock;
  });

  socket.data.achievements = [];
  socket.join('global');
  socket.join(`server-${socket.getServerId()}`);
}
