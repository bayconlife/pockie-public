import redis, { isValidKey, useKey } from '../../components/redis';
import { CustomSocket } from '../../interfaces';
import { compare, hash } from 'bcrypt';
import { User } from '../../components/classes';
import { calculateStatsV2, emitLevelStats, emitStats } from '../character/stats';
import { switchScene } from '../scene/core/scenes';
import config from 'config';
import { SCENES } from '../../resources/scenes';
import { emitParty, isCharacterInParty, partyInfo } from '../character/party';
import { dungeons, isCharacterInDungeon } from '../scene/core/dungeons';
import { emitMultiFight } from '../scene/core/fields';
import { updateItems } from '../items/itemSystem';
import { RANKS } from '../../resources/arena';
import { SETS } from '../../resources/items';
import { emitCards } from '../scene/core/cards';
import { TITLES } from '../../resources/titles';
import { EXPLORATION, EXPLORATION_CLIENT_DATA } from '../../resources/exploration';
import { getAccountFromDB, getCharacterFromDB, getUserFromDB, query, saveUser } from '../../infrastructure/db';
import { Callback } from '../../types';
import { error } from '../kernel/errors';
import {
  accountAddToLoginCache,
  accountCheckIfInLoginCache,
  accountRemoveFromLoginCache,
  getCharacter,
  getSocketIdFromAccountId,
} from '../../infrastructure/cache';
import { VALHALLA_CLIENT_DATA } from '../../resources/valhalla';
import { Config, SERVERS } from '../../resources/servers';
import { loadModulesForSocket } from '../kernel/moduleLoader';
import { loadModulesForSocket as loadModulesForSocketV2 } from '../kernel/moduleLoader';
import pubSub from '../kernel/pubSub';
import { emitFight } from '../fight/fightSystem';
import { addAvailableQuest } from '../quests/quests';
import { Quest } from '../../resources/quests';
import { io } from '../../components/io';
import { sign } from 'jsonwebtoken';

export async function login(socket: CustomSocket, data: any, cb: any) {
  const dbAccount = await getAccountFromDB(data.username);

  if (dbAccount === null) {
    return cb({ error: 'Invalid login.' });
  }

  if (dbAccount.rowCount === 0) {
    return cb({ error: 'Invalid username.' });
  }

  compare(data.password, dbAccount.rows[0].password).then(async (isValidLogin) => {
    if (!isValidLogin) {
      return cb({ error: 'Invalid password.' });
    }

    if (dbAccount.rows[0].permission < 0) {
      return cb({ error: 'Account banned.' });
    }

    if (accountCheckIfInLoginCache(dbAccount.rows[0].id)) {
      const socketId = getSocketIdFromAccountId(dbAccount.rows[0].id);

      if (socketId !== '') {
        io.to(socketId).emit('relog');
      }

      accountRemoveFromLoginCache(dbAccount.rows[0].id);
      // return cb({ error: 'Already logged in.' });
    }

    const characters = await query((client) => {
      return client.query(
        'SELECT characters.server_id FROM accounts JOIN characters ON characters.account_id = accounts.id WHERE accounts.username = $1;',
        [data.username]
      );
    });

    socket.data.id = dbAccount.rows[0].id;
    socket.data.servers = characters === null ? [] : characters.rows.map((row) => row.server_id);
    socket.data.muted = dbAccount.rows[0].muted;

    let valid: number[] = [];

    if (socket.data.servers.length < 4) {
      const mainCharacter = await getCharacterFromDB(socket.data.id, 1);

      valid = Object.keys(SERVERS)
        .map((key) => Number(key))
        .filter((id) => {
          if (socket.data.servers.includes(id) || SERVERS[id].newCharacter) {
            return true;
          }

          if (mainCharacter === null || mainCharacter.rows.length === 0) {
            return false;
          }

          if (id in SERVERS) {
            return SERVERS[id].check(mainCharacter.rows[0].data);
          }

          return false;
        });
    }

    socket.data.valid = valid;

    accountAddToLoginCache(socket);

    cb({ id: socket.getAccountId(), servers: { servers: Object.keys(SERVERS).map((key) => Number(key)), valid } });
  });
}

export async function register(socket: CustomSocket, data: any, cb: any) {
  const { username, password, key } = data;

  // if (!(await isValidKey(key))) {
  //   return cb('Invalid key.');
  // }

  if (username === '' || password === '') {
    return cb('Invalid username or password.');
  }

  if (password.length < 8) {
    return cb('Password must be at least 8 characters long.');
  }

  const dbAccount = await getAccountFromDB(data.username);

  if (dbAccount !== null && dbAccount.rowCount > 0) {
    return cb('Username already in use.');
  }

  // await useKey(key);

  const saltRounds = 10;
  const encryptedPassword = await hash(password, saltRounds);

  const res = await query((client) => {
    return client.query('INSERT INTO accounts(username, password) VALUES ($1, $2) RETURNING id', [username, encryptedPassword]);
  });

  if (res === null || res.rowCount === 0) {
    return cb('Account creation failed.');
  }

  cb('Account created.');
}

export async function selectServer(socket: CustomSocket, serverId: number, cb: Callback) {
  if (socket.getAccountId() === undefined) {
    return error(socket, 'error__not_logged_in');
  }

  if (socket.data.servers === undefined) {
    return error(socket, 'error__invalid_servers');
  }

  if (!(serverId in SERVERS)) {
    return error(socket, 'error__invalid_server');
  }

  let character: User | null = null;

  try {
    character = await getCharacter(serverId, socket.getAccountId());
  } catch (e) {
    // You haven't created a character on this server yet.
    if (SERVERS[serverId].newCharacter) {
      character = new User();
    } else {
      const dbCharacter = await getCharacterFromDB(socket.getAccountId(), 1);

      if (dbCharacter === null || dbCharacter.rowCount === 0) {
        return error(socket, 'error__no_character_on_main_server');
      }

      character = dbCharacter.rows[0].data;

      if (character !== null) {
        character.scenes.current = character.village;
        character.arena = new User().arena;
      }
    }

    await query((client) =>
      client.query('INSERT INTO characters(account_id, server_id, data) VALUES ($1, $2, $3)', [socket.getAccountId(), serverId, character])
    );
  }

  if (character === null) {
    return error(socket, 'error__invalid_character_data');
  }

  socket.data.serverId = serverId;

  if (character.version !== SERVERS[serverId].config.get('version')) {
    // This will add any missing keys, won't remove old keys though.
    try {
      const deepCopy = (base: any, current: any, copy: any) => {
        Object.keys(base).forEach((key) => {
          if (key in current) {
            copy[key] = current[key];
          } else {
            copy[key] = base[key];
          }

          if (typeof base[key] === 'object' && !Array.isArray(base[key]) && !!base[key]) {
            deepCopy(base[key], current[key] ?? {}, copy[key] ?? {});
          }
        });

        return copy;
      };

      character = deepCopy(new User(), character, {}) as User;
    } catch (e) {
      console.error(e);
    }

    character.version = SERVERS[serverId].config.get('version');
    // updateItems(character);
  }

  character.stats = calculateStatsV2(socket, character);

  if (isCharacterInParty(character)) {
    socket.join(`party-${character.party}`);
    partyInfo(socket, character, {}, () => {});
  } else {
    delete character.party;
  }

  if (isCharacterInDungeon(character)) {
    socket.join(`dungeon-${character.dungeon}`);
  } else {
    delete character.dungeon;
  }

  pubSub.emit('login', socket, character);

  socket.save(character);

  character.unlock?.();

  loadModulesForSocket(socket);
  loadModulesForSocketV2(socket);

  socket.data.achievements = [];
  socket.join('global');
  socket.join(`server-${socket.getServerId()}`);

  console.log('Logged In ', character.displayName);

  cb({
    ...composeUserData(character, socket.getConfig()),
    jwt: sign({ accountId: socket.getAccountId(), serverId: socket.getServerId() }, 'testing'),
  });

  emitStats(socket, character);
  emitMultiFight(socket, character);
  emitLevelStats(socket, character);
}

function composeUserData(user: User, config: Config) {
  const subscribedLogins = pubSub.emit('requestLoginData', user);
  const subscribedData: { [key: string]: any } = {};

  subscribedLogins.forEach((obj) => {
    Object.keys(obj).forEach((key) => (subscribedData[key] = obj[key]));
  });

  const subscribedServerDatas = pubSub.emit('login__server_data', user);
  const subscribedServerData: { [key: string]: any } = {};

  subscribedServerDatas.forEach((obj) => {
    Object.keys(obj).forEach((key) => (subscribedServerData[key] = obj[key]));
  });

  return {
    ...subscribedData,
    arena: user.arena,
    buffs: user.buffs,
    currency: user.currency,
    displayName: user.displayName,
    exploration: user.exploration,
    homeVillage: user.village,
    party: user.party,
    quests: {
      inProgress: user.quests.inProgress,
      available: user.quests.available,
      completed: user.quests.completed,
    },
    skills: user.skills,
    skillsKnown: user.skillsKnown,
    items: {
      items: user.items,
      locations: user.locations,
    },
    stones: user.stones,
    scenes: user.scenes,

    serverConfig: {
      ...subscribedServerData,
      exploration: EXPLORATION_CLIENT_DATA,
      leveling: {
        max: config.Leveling.Config.maxLevel,
      },
      ranks: RANKS,
      scenes: SCENES,
      sets: SETS,
      titles: TITLES,
      valhalla: VALHALLA_CLIENT_DATA,
    },
  };
}

export async function createLoginData(socket: CustomSocket) {
  const character = await socket.getCharacter();
  const config = socket.getConfig();
  const subscribedLogins = pubSub.emit('requestLoginData', character, config.Modules);
  const subscribedData: { [key: string]: any } = {};

  subscribedLogins.forEach((obj) => {
    Object.keys(obj).forEach((key) => (subscribedData[key] = obj[key]));
  });

  const subscribedServerDatas = pubSub.emit('requestLoginServerData', config);
  const subscribedServerData: { [key: string]: any } = {};

  subscribedServerDatas.forEach((obj) => {
    Object.keys(obj).forEach((key) => (subscribedServerData[key] = obj[key]));
  });

  character.unlock?.();

  return {
    ...subscribedData,
    accountId: socket.getAccountId(),
    serverId: socket.getServerId(),
    serverConfig: {
      ...subscribedServerData,
    },
    serverVersion: socket.getConfig().getVersion(),
  };
}
