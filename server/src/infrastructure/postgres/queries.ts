import { query } from './pg';

export async function queryAccount(username: string) {
  return await query((client) => {
    return client.query('SELECT * FROM accounts WHERE accounts.username = $1;', [username]);
  });
}

export async function queryCharacter(accountId: number, serverId: number) {
  return await query((client) => {
    return client.query('SELECT data, reset FROM characters WHERE account_id = $1 AND server_id = $2;', [accountId, serverId]);
  });
}
