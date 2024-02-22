import { compare, hash } from 'bcrypt';
import { getAccountFromDB, getCharacterFromDB, query } from '../infrastructure/db';
import { accountCheckIfInLoginCache, getCharacter } from '../infrastructure/cache';
import { getSocketIdFromAccountId } from '../infrastructure/cache';
import { io } from '../components/io';
import { SERVERS } from '../resources/servers';
import { sign, verify } from 'jsonwebtoken';
import { User } from '../components/classes';

export async function login(username: string, password: string) {
  const dbAccount = await getAccountFromDB(username);

  if (dbAccount === null || dbAccount.rowCount === 0) {
    return { error: 'Invalid username or password.' };
  }

  const isValidLogin = await compare(password, dbAccount.rows[0].password);

  if (!isValidLogin) {
    return { error: 'Invalid username or password.' };
  }

  if (dbAccount.rows[0].permission < 0) {
    return { error: 'Account banned.' };
  }

  const characters = await query((client) => {
    return client.query(
      'SELECT characters.server_id FROM accounts JOIN characters ON characters.account_id = accounts.id WHERE accounts.username = $1;',
      [username]
    );
  });

  const servers = characters === null ? [] : characters.rows.map((row) => row.server_id);
  const ret = {
    id: dbAccount.rows[0].id,
    muted: dbAccount.rows[0].muted,
  };

  const mainCharacter = await getCharacterFromDB(ret.id, 1);
  const valid = Object.keys(SERVERS)
    .map((key) => Number(key))
    .filter((id) => {
      if (servers.includes(id) || SERVERS[id].newCharacter) {
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

  return {
    ...ret,
    valid,
    servers: Object.keys(SERVERS).map((key) => Number(key)),
    jwt: sign({ type: 0, accountId: ret.id, muted: ret.muted }, process.env.JWT_SECRET ?? '', { expiresIn: '20m' }),
  };
}

export async function register(username: string, password: string) {
  if (username === '' || password === '') {
    return { error: 'Invalid username or password.' };
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters long.' };
  }

  const dbAccount = await getAccountFromDB(username);

  if (dbAccount !== null && dbAccount.rowCount > 0) {
    return { error: 'Username already in use.' };
  }

  // await useKey(key);

  const saltRounds = 10;
  const encryptedPassword = await hash(password, saltRounds);

  const res = await query((client) => {
    return client.query('INSERT INTO accounts(username, password) VALUES ($1, $2) RETURNING id', [username, encryptedPassword]);
  });

  if (res === null || res.rowCount === 0) {
    return { error: 'Account creation failed.' };
  }

  return { message: 'Account created.' };
}

interface ServerSelectToken {
  type: number;
  accountId: number;
  muted: boolean;
}

export async function selectServer(jwt: string, serverId: number) {
  let decoded: ServerSelectToken = {
    type: -1,
    accountId: -1,
    muted: true,
  };

  try {
    decoded = verify(jwt, process.env.JWT_SECRET ?? '') as ServerSelectToken;
  } catch (err) {
    return { error: 'error__invalid_signature' };
  }

  if (decoded.accountId === undefined || decoded.type === undefined || decoded.type !== 0) {
    return { error: 'error__not_logged_in' };
  }

  const accountId = decoded.accountId;

  if (!(serverId in SERVERS)) {
    return { error: 'error__invalid_server' };
  }

  let character: User | null = null;

  try {
    character = await getCharacter(serverId, accountId);
  } catch (e) {
    // You haven't created a character on this server yet.
    if (SERVERS[serverId].newCharacter) {
      character = new User();
    } else {
      const dbCharacter = await getCharacterFromDB(accountId, 1);

      if (dbCharacter === null || dbCharacter.rowCount === 0) {
        return { error: 'error__no_character_on_main_server' };
      }

      character = dbCharacter.rows[0].data;

      if (character !== null) {
        character.scenes.current = character.village;
        character.arena = new User().arena;
      }
    }

    await query((client) =>
      client.query('INSERT INTO characters(account_id, server_id, data) VALUES ($1, $2, $3)', [accountId, serverId, character])
    );
  }

  if (character === null) {
    return { error: 'error__invalid_character_data' };
  }

  character.unlock?.();

  return { jwt: sign({ type: 1, accountId, serverId, muted: decoded.muted }, process.env.JWT_SECRET ?? '', { expiresIn: '7d' }) };
}
