import { isEqual } from 'lodash';
import { User } from '../../components/classes';
import { CustomSocket } from '../../interfaces';
import { emitStats } from '../character/stats';
import { getCharacter, updateCharacterInCache } from '../../infrastructure/cache';

export async function checkErrors(socket: CustomSocket, fn: (character: User) => boolean | void) {
  const character = await socket.getUnlockedCharacter();

  return fn(character) ?? false;
}

export async function updateCharacter(socket: CustomSocket, fn: (character: User) => Promise<boolean> | void) {
  const character = await socket.getCharacter();
  const copyOfCharacter = JSON.parse(JSON.stringify(character));

  const wereThereErrors = await fn(copyOfCharacter);

  if (typeof wereThereErrors === 'undefined' || !wereThereErrors) {
    await socket.save(copyOfCharacter);

    if (!isEqual(character.stats, copyOfCharacter.stats)) {
      emitStats(socket, copyOfCharacter);
    }

    character.unlock?.();

    return copyOfCharacter;
  }

  character.unlock?.();

  return character;
}

export async function updatePossibleCharacter(accountId: number, serverId: number, fn: (character: User) => Promise<boolean> | void) {
  const character = await getCharacter(serverId, accountId);
  const copyOfCharacter = JSON.parse(JSON.stringify(character));

  const wereThereErrors = await fn(copyOfCharacter);

  if (typeof wereThereErrors === 'undefined' || !wereThereErrors) {
    updateCharacterInCache(serverId, accountId, copyOfCharacter);

    character.unlock?.();

    return copyOfCharacter;
  }

  character.unlock?.();

  return character;
}
