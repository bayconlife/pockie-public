import * as dotenv from 'dotenv';
dotenv.config();

// import config from './config/index';
// import * as cfg from 'config';
import config, { IConfig } from 'config';
// let config = require('config');

import { CustomSocket, Item } from './interfaces';

import { calculateStatsV2, getStats } from './modules/character/stats';
import { sceneLeaveCurrentScene } from './modules/scene/core/scenes';
import itemLoader from './resources/items';
import dropTableLoader from './resources/dropTables';
import monsterLoader from './resources/monsters';
import sceneLoader from './resources/scenes';
import lineLoader from './resources/lines';
import questLoader from './resources/quests';
import shopLoader from './resources/shops';
import lasNochesLoader from './resources/lasNoches';
import { sendMessage } from './modules/chat/chat';
import { io } from './components/io';
import { http } from './components/http';
import valhallaLoader from './resources/valhalla';
import synthesisLoader from './resources/synthesis';
import inscribeLoader from './resources/inscribe';
import slotFightLoader from './resources/slotFight';
import enhanceLoader from './resources/enhance';
import petLoader from './resources/pet';
import skillLoader from './resources/skills';
import arenaLoader from './resources/arena';
import titleLoader from './resources/titles';
import cardLoader from './resources/cards';
import explorationLoader from './resources/exploration';
import fieldBossLoader from './resources/fieldBoss';
import refineLoader from './resources/refine';
import gemLoader from './resources/gems';
import {
  accountAddToLoginCache,
  accountCheckIfInLoginCache,
  accountRemoveFromLoginCache,
  connectCache,
  getCharacter,
  getSocketIdFromAccountId,
  getUnlockedCharacter,
  removeCharacterFromCache,
  saveAllCharactersInCache,
  updateCharacterInCache,
} from './infrastructure/cache';
import { connectDB, saveUser } from './infrastructure/db';
import { viewCharacter } from './modules/character/character';
import { registerAdminListeners } from './modules/admin';
import serverLoader, { getServerConfig } from './resources/servers';
import enchantLoader from './resources/enchant';
import { addAchievement } from './modules/character/achievements';
import characterHook from './modules/character';
import sceneHooks from './modules/scene';
import accountHooks from './modules/account';
import { ping } from './modules/kernel/heartbeat';
import itemHooks from './modules/items';
import { Callback } from './types';
import { emitFight } from './modules/fight/fightSystem';
import { query } from './infrastructure/postgres/pg';
import { User } from './components/classes';
import { client } from './infrastructure/redis/redis';
import { dungeons } from './modules/scene/core/dungeons';
import app from './components/app';
import { Request, Response, json } from 'express';
import { login, register, selectServer } from './site/login';
import { verify } from 'jsonwebtoken';
import { loadModulesForSocket } from './modules/kernel/moduleLoader';
import { updateCharacterAfterLogin } from './modules/character/update';
import { createLoginData } from './modules/account/login';
import { adminLogin } from './modules/admin/login';
import { getItemBase } from './modules/items/itemSystem';

const PORT = Number(config.get('server.port'));

process.on('uncaughtException', function (exception) {
  // handle or ignore error
  console.error(exception);
});

(async () => {
  Promise.all([connectDB(), connectCache()])
    .then(() => console.log('Connections established'))
    .then(() => loadConfig(config))
    .then(() => loadHooks())
    .then(saveAllCharactersInCache)
    .then(() => startServer());
})();

/**
 * Load Resources from config files
 */
const loadConfig = (c: IConfig) => {
  skillLoader(c);
  lineLoader(c);
  itemLoader(c);
  dropTableLoader(c);
  monsterLoader(c);
  cardLoader(c);
  lasNochesLoader(c);
  valhallaLoader(c);
  sceneLoader(c);
  questLoader(c);
  shopLoader(c);
  synthesisLoader(c);
  inscribeLoader(c);
  slotFightLoader(c);
  enhanceLoader(c);
  enchantLoader(c);
  petLoader(c);
  arenaLoader(c);
  titleLoader(c);
  explorationLoader(c);
  fieldBossLoader(c);
  refineLoader(c);
  gemLoader(c);
  serverLoader(c);

  console.log('Config loaded');
};

const loadHooks = () => {
  itemHooks();
  accountHooks();
  characterHook();
  sceneHooks();
};

const startServer = () => {
  const allowNullData = ['register', 'login', 'adminLogin'];

  app.post('/login', json(), async (req: Request, res: Response) => {
    res.send(await login(req.body.username, req.body.password));
  });

  app.post('/register', json(), async (req: Request, res: Response) => {
    res.send(await register(req.body.username, req.body.password));
  });

  app.post('/selectServer', json(), async (req: Request, res: Response) => {
    res.send(await selectServer(req.body.jwt, req.body.server));
  });

  app.post('/adminLogin', json(), async (req: Request, res: Response) => {
    res.send(await adminLogin(req.body.username, req.body.password));
  });

  app.listen(PORT + 1, () => {
    console.log(`Login client listening on port ${PORT + 1}`);
  });

  io.of(config.get('socket.path')).adapter.on('create-room', (room) => {
    // console.log(`room ${room} was created`);
  });

  io.of(config.get('socket.path')).adapter.on('join-room', (room, id) => {
    // console.log(`socket ${id} has joined room ${room}`);
  });

  //@ts-ignore
  io.of(config.get('socket.path')).on('connection', async (socket: CustomSocket) => {
    console.log('CONNECTION ', socket.id);
    // console.log(socket.handshake.auth.token);

    try {
      if (!socket.handshake.auth || !socket.handshake.auth.token) {
        throw new Error('Token not found.');
      }
      const jwt = verify(socket.handshake.auth.token, process.env.JWT_SECRET ?? '');

      // console.log('JWT', jwt);
      if (typeof jwt === 'string') {
        throw new Error('Token invalid format.');
      }

      if (jwt.type < 1) {
        throw new Error('Invalid token type.');
      }

      if (jwt.type === 2) {
        return registerAdminListeners(socket);
      }

      socket.data.id = jwt.accountId;
      socket.data.serverId = jwt.serverId;
      socket.data.muted = jwt.muted;

      if (accountCheckIfInLoginCache(jwt.accountId)) {
        const socketId = getSocketIdFromAccountId(jwt.accountId);

        if (socketId !== '') {
          io.to(socketId).emit('authFailed');
          io.to(socketId).emit('relog');
        }

        accountRemoveFromLoginCache(jwt.accountId);
      }
    } catch (err) {
      // console.log(err);
      socket.emit('authFailed', err);
      return socket.disconnect(true);
    }

    socket.getAccountId = () => socket.data.id;
    socket.getCharacter = async () => {
      const character = await getCharacter(socket.getServerId(), socket.getAccountId());

      socket.data.lastCharacter = character;

      return character;
    };
    socket.getUnlockedCharacter = async () =>
      Object.freeze({ ...(await getUnlockedCharacter(socket.getServerId(), socket.getAccountId())) });
    socket.getConfig = () => getServerConfig(socket.getServerId());
    socket.getServerId = () => socket.data.serverId;
    socket.shout = (room, event, ...args) => {
      socket.emit(event, ...args);
      socket.to(room).emit(event, ...args);
    };
    socket.save = async (character) => {
      if (socket.data.achievements?.length > 0) {
        socket.data.achievements.forEach((id: number) => addAchievement(socket, character, id));
        socket.data.achievements = [];
      }

      const unlock = character.unlock;
      delete character.unlock;
      await updateCharacterInCache(socket.getServerId(), socket.getAccountId(), character);
      character.unlock = unlock;
    };
    socket.unlock = (character) => {
      character?.unlock?.();
    };

    await updateCharacterAfterLogin(socket);

    loadModulesForSocket(socket);

    const on = (name: string, fn: (...args: any[]) => void) => {
      socket.on(name, async (...any) => {
        // console.log('calling', name);
        if (socket.getAccountId() === undefined && !allowNullData.includes(name)) {
          // console.log('Invalid socket connection');
          return socket.emit('relog');
        } else {
          await fn(...any);
          socket.unlock(socket.data.lastCharacter);
          return;
        }
      });
    };

    on('ping', (data, cb) => ping(socket, data, cb));
    on('stats', (data, cb) => getStats(socket, data, cb));
    on('sendMessage', (data, cb) => sendMessage(socket, data, cb));
    on('checkFight', (data, cb) =>
      (async (socket: CustomSocket, _: any, cb: Callback) => {
        const character = await socket.getCharacter();

        if (character.fight.timeForNextFight > Date.now()) {
          character.unlock?.();

          emitFight(socket, character.fight.results);
        }
      })(socket, data, cb)
    );
    on('viewCharacter', (data, cb) => viewCharacter(socket, data, cb));
    on('disconnect', async (reason) => {
      console.log('Disconnect ', socket.id, reason);
      if (!!socket.getAccountId()) {
        accountRemoveFromLoginCache(socket.id);

        if (!!socket.getServerId()) {
          const user = await socket.getCharacter();

          if (user === null) {
            return console.log('Could not find user to save.');
          }

          sceneLeaveCurrentScene(socket, user);

          await saveUser(socket, user);
          console.log('Saved ', user.displayName, 'instance', socket.getAccountId());
          await removeCharacterFromCache(socket);
          console.log('Removed from cache ', user.displayName, 'instance', socket.getAccountId());

          user.unlock?.();
        }
      }
    });

    accountAddToLoginCache(socket);

    socket.emit('loadData', await createLoginData(socket));
  });

  http.listen(PORT);
  console.log(`Server started on ${PORT}`);
};

setInterval(() => {
  saveAllCharactersInCache();
}, 10 * 60 * 1000);

setInterval(() => {
  const converted = Array.from(dungeons).reduce((o: any, [k, v]) => {
    o[k] = v;

    return o;
  }, {});

  client.json.set('dungeons', '.', converted);
}, 10 * 60 * 1000);

function reloadConfigs() {
  const config = require('config');
  const sources = config.util.getConfigSources();
  for (const { name } of sources) {
    if (name === '$NODE_CONFIG' || name === '--NODE-CONFIG') {
      continue;
    }

    delete require.cache[name];
  }

  delete require.cache[require.resolve('config')];
  return require('config');
}

process.stdin.setEncoding('utf8');

process.stdin.on('readable', async () => {
  let chunk;
  // Use a loop to make sure we read all available data.
  while ((chunk = process.stdin.read()) !== null) {
    process.stdout.write(`data: ${chunk}`);

    const input = chunk?.toString()?.trim();

    if (input === 'reloadConfig') {
      const t = reloadConfigs();

      loadConfig(t);
    }

    if (input === 'updateCharacters') {
      const characters = await query((client) => {
        return client.query('select * from characters');
      });

      if (!!characters) {
        for (let i = 0; i < characters.rows.length; i++) {
          const character: User = characters.rows[i].data;

          // updateItems(character);
          // character.stats = calculateStatsV2(socket,(character);
          // [480000, 480001, 480002, 480003, 480004, 480005, 480006, 480007, 480008, 480009]

          // character.stones = Number(character.stones);
          // const removeList = [];
          // Object.keys(character.items).forEach(uid => {
          //   if (character.items)
          // });

          const newItems: any = {};

          enum Core {
            BOUND,
            AMOUNT,
            LOCATION,
            POSITION,
            TYPE,
            SIZE,
          }

          Object.entries(character.items).forEach(([uid, item]: [string, any]) => {
            if (item.core !== undefined) {
              newItems[uid] = item;

              return;
            }

            const base = getItemBase(item.iid);
            const core: Partial<Item['core']> = [];

            core[Core.BOUND] = item.isBound;
            core[Core.AMOUNT] = item.count;
            core[Core.LOCATION] = item.location;
            core[Core.POSITION] = item.position;
            core[Core.TYPE] = base.type;
            core[Core.SIZE] = base.size;

            newItems[uid] = {
              uid: item.uid,
              iid: item.iid,
              core,
              props: item.props,
            };

            if (character.containers === undefined) {
              character.containers = {};
            }

            if (character.containers[item.location] === undefined) {
              character.containers[item.location] = {};
            }

            character.containers[item.location][item.position] = item.uid;

            // console.log(newItems[uid]);
          });

          character.items = newItems;

          await query((client) =>
            client.query('update characters set data = $1 where account_id=$2 and server_id=$3;', [
              character,
              characters.rows[i].account_id,
              characters.rows[i].server_id,
            ])
          );
          console.log('Updated', character.displayName);
        }
      }
    }

    if (input.startsWith('script')) {
      (async () => {
        const inputs = input.split(';');

        if (inputs.length <= 1) {
          return;
        }

        const module = await import(`./scripts/${inputs[1]}`);

        module?.default?.();
      })();
    }

    if (input === 'end') {
      console.log('ending');
      io.of(config.get('socket.path')).emit('relog');
      io.close();
      http.close();
      break;
    }
  }
});

process.stdin.on('end', async () => {
  process.stdout.write('end');

  // io.of(config.get('socket.path')).emit('relog');
  io.of(config.get('socket.path')).disconnectSockets();
});

process.on('SIGTERM', () => {
  console.log('killing servers');
  io.of(config.get('socket.path')).disconnectSockets();
});
