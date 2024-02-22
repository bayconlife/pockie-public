import { Callback } from '../../types';
import { CustomSocket } from '../../interfaces';

export function notice(socket: CustomSocket, message: string) {
  socket.emit('notice', message);
}

export function prompt(socket: CustomSocket, message: any, cb: Callback) {
  socket.emit('prompt', message, cb);
}
