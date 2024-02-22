import { SocketFunction } from '../../types';
import { CustomSocket } from '../../interfaces';
import { updateCharacter } from './cache';
import { emitTitles } from '../character/titles';

type OnFunction = (name: string, fn: SocketFunction) => void;

const _registry = new Map<string, (on: OnFunction) => void>();
const allowNullData = ['register', 'login', 'adminLogin'];

function on(socket: CustomSocket) {
  return (name: string, fn: SocketFunction) => {
    socket.on(name, async (data, cb = () => {}) => {
      // console.log('calling', name);
      if (socket.getAccountId() === undefined && !allowNullData.includes(name)) {
        // console.log('Invalid socket connection');
        return socket.emit('relog');
      } else {
        return await updateCharacter(socket, async (character) => {
          const achievementsBefore = Object.keys(character.achievements).length;
          const emits = await fn(socket, character, data, cb);

          if (typeof emits === 'undefined') {
            return false;
          }

          if (typeof emits === 'boolean') {
            cb();

            return true;
          }

          emits.forEach((emit) => {
            emit(socket, character);
          });

          if (achievementsBefore !== Object.keys(character.achievements).length) {
            emitTitles(socket, character);
          }

          return false;
        });
      }
    });
  };
}

export function registerModule(moduleName: string, fn: (on: OnFunction) => void) {
  _registry.set(moduleName, fn);
  console.log('Register', moduleName);
}

export function loadModulesForSocket(socket: CustomSocket) {
  const modules = socket.getConfig().Modules;

  _registry.forEach((fn, key) => {
    if (modules.includes(key)) {
      fn(on(socket));
    }
  });
}
