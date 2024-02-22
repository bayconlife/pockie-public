import server from 'http';
import app from './app';

export const http = server.createServer(app);
