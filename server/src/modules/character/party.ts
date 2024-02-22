import { Callback, SocketFunction } from '../../types';
import { CustomSocket } from '../../interfaces';
import { randomUUID } from 'crypto';
import { error } from '../kernel/errors';
import { getAvatar } from '../account/avatars';
import { GameModule, User } from '../../components/classes';
import {
  getSocketIdFromAccountId,
  getCharacter,
  isOnline,
  updateUserWithoutSocket,
  getUnlockedCharacter,
} from '../../infrastructure/cache';
import { isCharacterInDungeon } from '../scene/core/dungeons';
import { onLogin, onRequestLoginData } from '../kernel/pubSub';

interface Party {
  id: string;
  leader: number;
  positions: number[];
  players: {
    [id: number]: {
      avatar: any;
      displayName: string;
      level: number;
    };
  };
}

const MODULE_NAME = 'Party';

onLogin(MODULE_NAME, (socket, character) => {
  if (isCharacterInParty(character)) {
    socket.join(`party-${character.party}`);
  } else {
    delete character.party;
  }
});

onRequestLoginData(MODULE_NAME, (character) => ({
  party: character.party,
}));

export const parties = new Map<string, Party>();

export function getUsersParty(character: User) {
  if (character.party === undefined) {
    return null;
  }

  return parties.get(character.party) ?? null;
}

export function isCharacterInParty(character: User) {
  if (character.party === undefined) {
    return false;
  }

  if (parties.has(character.party)) {
    return true;
  }

  return false;
}

export function isCharacterPartyLeader(socket: CustomSocket, character: User) {
  if (character.party === undefined) {
    return false;
  }

  if (!parties.has(character.party)) {
    return false;
  }

  return parties.get(character.party)!.leader === socket.getAccountId();
}

const partyAccept: SocketFunction<string> = async (socket, character, partyId, cb) => {
  if (isCharacterInParty(character)) {
    return error(socket, 'You are already in a party.');
  }

  if (!parties.has(partyId)) {
    return error(socket, 'Party does not exist.');
  }

  if (parties.get(partyId)!.positions.length >= 3) {
    return error(socket, 'error__party_full');
  }

  character.party = partyId;

  const party = parties.get(partyId)!;

  party.positions.push(socket.getAccountId());
  party.players[socket.getAccountId()] = {
    avatar: getAvatar(character),
    displayName: character.displayName,
    level: character.level,
  };

  socket.join(`party-${character.party}`);
  socket.shout(`party-${character.party}`, 'partyUpdate', parties.get(character.party));
};

export function partyCreate(socket: CustomSocket, character: User) {
  if (character === null) {
    error(socket, 'error__invalid_character');

    return null;
  }

  if (character.party !== undefined) {
    error(socket, 'error__already_in_party');

    return null;
  }

  character.party = randomUUID();

  parties.set(character.party, {
    id: character.party,
    leader: socket.getAccountId(),
    positions: [socket.getAccountId()],
    players: {
      [socket.getAccountId()]: {
        avatar: getAvatar(character),
        displayName: character.displayName,
        level: character.level,
      },
    },
  });

  socket.join(`party-${character.party}`);
  socket.emit('partyUpdate', parties.get(character.party));

  return parties.get(character.party) ?? null;
}

export const partyInfo: SocketFunction = async (socket, character, _, cb) => {
  socket.emit('partyUpdate', parties.get(character.party ?? ''));
};

const partyInvite: SocketFunction<number> = async (socket, character, accountId, cb) => {
  try {
    const invitedUser = await getUnlockedCharacter(socket.getServerId(), accountId);

    if (invitedUser.dungeon) {
      return error(socket, 'error__character_busy');
    }

    if (invitedUser.party) {
      return error(socket, 'error__character_already_in_party');
    }

    if (!isCharacterInParty(character)) {
      partyCreate(socket, character);

      await socket.save(character);
    }

    if (parties.get(character.party!)!.positions.length >= 3) {
      return error(socket, 'error__party_limit');
    }

    socket.to(getSocketIdFromAccountId(accountId)).emit('partyInvite', `${character.displayName} invited you to a party.`, character.party);
  } catch (e) {
    return error(socket, 'error__character_does_not_exist');
  }
};

const partyKick: SocketFunction<number> = async (socket, character, position, cb) => {
  if (!isCharacterInParty(character)) {
    return error(socket, 'error__not_in_party');
  }

  const party = parties.get(character.party!);

  if (party === undefined) {
    return error(socket, 'error__invalid_party');
  }

  const isLeader = isCharacterPartyLeader(socket, character);

  if (!isCharacterPartyLeader(socket, character)) {
    return error(socket, 'error__must_be_leader');
  }

  if (isCharacterInDungeon(character)) {
    return error(socket, 'error__cannot_kick_while_in_dungeon');
  }

  if (party.positions[position] === socket.getAccountId()) {
    return partyLeave(socket, character, null, cb);
  }

  try {
    const leavingUser = await getCharacter(socket.getServerId(), party.positions[position]);
    const leavingUserAccountId = party.positions[position];

    delete party.players[leavingUserAccountId];
    party.positions.splice(position, 1);

    delete leavingUser.party;

    updateUserWithoutSocket(socket.getServerId(), leavingUserAccountId, leavingUser);

    if (await isOnline(socket.getServerId(), leavingUserAccountId)) {
      socket.to(getSocketIdFromAccountId(leavingUserAccountId)).socketsLeave(`party-${character.party}`);
      socket.to(getSocketIdFromAccountId(leavingUserAccountId)).emit('partyClear');
    }

    leavingUser.unlock?.();
  } catch (e) {
    // leaving character doesn't exist?
  }

  socket.shout(`party-${character.party}`, 'partyUpdate', parties.get(character.party!));
};

const partyLeave: SocketFunction = async (socket, character, _, cb) => {
  if (!isCharacterInParty(character)) {
    return error(socket, 'error__not_in_party');
  }

  const party = parties.get(character.party!);

  if (party === undefined) {
    return error(socket, 'error__invalid_party');
  }

  if (isCharacterInDungeon(character)) {
    return error(socket, 'error__cannot_leave_while_in_dungeon');
  }

  const isLeader = isCharacterPartyLeader(socket, character);

  delete party.players[socket.getAccountId()];
  party.positions.splice(party.positions.indexOf(socket.getAccountId()), 1);

  delete character.party;

  if (party.positions.length === 0) {
    parties.delete(party.id);
  } else {
    if (isLeader) {
      party.leader = party.positions[0];
    }

    socket.shout(`party-${party.id}`, 'partyUpdate', parties.get(party.id));
  }

  socket.leave(`party-${party.id}`);
  socket.emit('partyClear');
};

const partyOrder: SocketFunction<{ slot: number; modifier: number }> = async (socket, character, { slot, modifier }, cb) => {
  if (!isCharacterInParty(character)) {
    return error(socket, 'error__not_in_party');
  }

  const party = parties.get(character.party!);

  if (party === undefined) {
    return error(socket, 'error__invalid_party');
  }

  if (!isCharacterPartyLeader(socket, character)) {
    return error(socket, 'error__must_be_leader');
  }

  if (slot > party.positions.length) {
    return error(socket, 'error__invalid_party_slot');
  }

  if (slot === party.positions.length - 1 && modifier > 0) {
    return error(socket, 'error__invalid_party_order');
  }

  if (slot === 0 && modifier < 0) {
    return error(socket, 'error__invalid_party_order');
  }

  if (modifier > 0) {
    const holder = party.positions[slot];

    party.positions[slot] = party.positions[slot + 1];
    party.positions[slot + 1] = holder;
  } else if (modifier < 0) {
    const holder = party.positions[slot];

    party.positions[slot] = party.positions[slot - 1];
    party.positions[slot - 1] = holder;
  }

  socket.shout(`party-${character.party}`, 'partyUpdate', party);
};

export async function emitParty(socket: CustomSocket) {
  const party = (await socket.getUnlockedCharacter()).party;

  if (party === undefined) {
    return error(socket, 'error__invalid_party');
  }

  // socket.emit('updateParty', parties.get(party));
  socket.shout(`party-${party}`, 'updateParty', parties.get(party));
}

export async function updateParty(socket: CustomSocket, character: User, party: Party, fn: (partyMember: User, idx: number) => void) {
  for (let i = 0; i < party.positions.length; i++) {
    try {
      const isMe = party.positions[i] === socket.getAccountId();
      const partyMember = isMe ? character : await getCharacter(socket.getServerId(), party.positions[i]);

      fn(partyMember, i);

      if (!isMe) {
        updateUserWithoutSocket(socket.getServerId(), party.positions[i], partyMember);

        partyMember.unlock?.();
      }
    } catch (e) {
      // party member doesn't exist
      console.log(e);
    }
  }
}

export default class PartyModule extends GameModule {
  moduleName = MODULE_NAME;
  modules = {
    partyAccept,
    partyInfo,
    partyInvite,
    partyKick,
    partyLeave,
    partyOrder,
  };
}
