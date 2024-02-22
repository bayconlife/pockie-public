import { Callback } from '../../types';
import { CustomSocket } from '../../interfaces';
import { getCharacter } from '../../infrastructure/cache';
import { getUser } from '../../infrastructure/redis/redis';

export async function ping(socket: CustomSocket, _: any, cb?: Callback) {
  const character = await socket.getCharacter();
  character.unlock?.();

  // const character = await getCharacter(socket.getServerId(), socket.getAccountId());

  // await getUser(socket.getServerId(), socket.getAccountId());

  // console.log(socket.getServerId());
  cb?.();
}
