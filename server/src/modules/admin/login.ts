import { getAccountFromDB } from '../../infrastructure/db';
import { compare } from 'bcrypt';
import { howMany } from '../../infrastructure/cache';
import { dungeons } from '../scene/core/dungeons';
import { parties } from '../character/party';
import { sign } from 'jsonwebtoken';

export async function adminLogin(username: string, password: string) {
  const dbAccount = await getAccountFromDB(username);

  if (dbAccount === null || dbAccount.rowCount === 0) {
    return { error: 'Invalid username or password.' };
  }

  const isValidLogin = await compare(password, dbAccount.rows[0].password);

  if (!isValidLogin) {
    return { error: 'Invalid username or password.' };
  }

  if (dbAccount.rows[0].permission <= 0) {
    return { error: 'Permission denied.' };
  }

  console.log(`---Accounts-----------${howMany()}----------------------`);
  console.log(`---Dungeons-----------${dungeons.size}----------------------`);
  console.log(`---Parties-----------${parties.size}----------------------`);

  return { jwt: sign({ type: 2 }, process.env.JWT_SECRET ?? '', { expiresIn: '7d' }) };
}
