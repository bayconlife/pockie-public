import { CustomSocket } from '../../interfaces';

export function error(socket: CustomSocket, message: string) {
  return socket.emit('error', message);
}

export function errorInvalidItem(socket: CustomSocket) {
  return error(socket, 'error__invalid_item');
}

export function errorInvalidLocation(socket: CustomSocket) {
  return error(socket, 'error__invalid_location');
}
