import { Server } from 'socket.io';
import { http } from './http';

export const io = new Server(http, {
  pingTimeout: 60000,
  upgradeTimeout: 30000,
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
