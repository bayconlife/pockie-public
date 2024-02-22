import { CustomSocket } from '../interfaces';
import { getUser } from '../components/redis';
import { connect, query as pgQuery } from './postgres/pg';
import { queryAccount, queryCharacter } from './postgres/queries';
import { User } from '../components/classes';

export async function connectDB() {
  await connect();
}

export async function getAccountFromDB(username: string) {
  return await queryAccount(username);
}

export async function getCharacterFromDB(accountId: number, serverId: number) {
  return await queryCharacter(accountId, serverId);
}

export async function getUserFromDB(username: string) {
  return await getUser(username);
}

// export async function query(fn: (client: any) => void) {
//   return pgQuery;
// }
export const query = pgQuery;

export async function saveUser(socket: CustomSocket, user: User) {
  return await pgQuery((client) => {
    return client.query('UPDATE characters SET data = $1 WHERE account_id = $2 AND server_id = $3', [
      user,
      socket.getAccountId(),
      socket.getServerId(),
    ]);
  });
}
