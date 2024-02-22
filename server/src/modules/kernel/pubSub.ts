import { CustomSocket } from '../../interfaces';
import { User } from '../../components/classes';
import { Config } from '../../resources/servers';
import { EmitterFunction } from '../../types';

class EventEmitter {
  private counter = 1;
  private _registry: {
    [key: string]: {
      [id: string]: (...args: any[]) => any;
    };
  } = {};

  emit(key: string, ...args: any[]) {
    return Object.keys(this._registry[key] || {})
      .map((id) => this._registry[key][id](...args))
      .filter((v) => v !== null);
  }

  on(key: string, fn: (...args: any[]) => any) {
    if (!(key in this._registry)) this._registry[key] = {};

    this.counter += 1;
    const id = this.counter.toString();

    this._registry[key][id] = fn;

    return id;
  }

  off(id: string) {
    Object.keys(this._registry).forEach((key) => {
      if (id in this._registry[key]) {
        delete this._registry[key];
      }
    });
  }
}

const Events = new EventEmitter();

export default Events;

export const onWonFight = (
  moduleName: string,
  fn: (socket: CustomSocket, character: User, monsterId: number, sceneId: number) => [EmitterFunction[], ...any]
) => {
  Events.on('wonFight', (character: User, monsterId: number, socket: CustomSocket, sceneId) => {
    if (socket.getConfig().Modules.includes(moduleName)) {
      return fn(socket, character, monsterId, sceneId);
    }

    return [];
  });
};

export const onFightFinished = (moduleName: string, fn: (socket: CustomSocket, character: User) => any[]) => {
  Events.on('fightFinished', (socket: CustomSocket, character: User) => {
    return socket.getConfig().Modules.includes(moduleName) ? fn(socket, character) : [];
  });
};

export const onLogin = (moduleName: string, fn: (socket: CustomSocket, character: User) => void) => {
  Events.on('login', (socket: CustomSocket, character: User) => {
    if (socket.getConfig().Modules.includes(moduleName)) {
      return fn(socket, character);
    }

    return null;
  });
};

export const onRequestLoginData = (moduleName: string, fn: (character: User) => void) => {
  Events.on('requestLoginData', (character, modules) => {
    if (modules.includes(moduleName)) {
      return fn(character);
    }

    return null;
  });
};

export const onRequestLoginServerData = (moduleName: string, fn: (config: Config) => void) => {
  Events.on('requestLoginServerData', (config: Config) => {
    if (config.Modules.includes(moduleName)) {
      return fn(config);
    }

    return null;
  });
};
