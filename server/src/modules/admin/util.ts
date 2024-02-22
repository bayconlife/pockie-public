import { CustomSocket } from '../../interfaces';

export function hasPermissionLevel(socket: CustomSocket, level: number) {
  return (socket.data.permission ?? 0) >= level;
}
