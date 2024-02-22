import { CustomSocket } from '../../interfaces';
import { logoutAccount, muteAccount, unmuteAccount } from './account';
import { changeCharacterName, lookupCharacter } from './character';

export function registerAdminListeners(socket: CustomSocket) {
  socket.data.permission = 2;

  socket.on('adminChangeCharacterName', (data, cb) => changeCharacterName(socket, data, cb));
  socket.on('adminCharacterLookup', (data, cb) => lookupCharacter(socket, data, cb));
  socket.on('adminLogoutAccount', (data, cb) => logoutAccount(socket, data, cb));
  socket.on('adminMuteAccount', (data, cb) => muteAccount(socket, data, cb));
  socket.on('adminUnmuteAccount', (data, cb) => unmuteAccount(socket, data, cb));
}
