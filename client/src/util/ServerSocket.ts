import { io } from 'socket.io-client';
import store from '../store';
import { switchState } from '../slices/stateSlice';
import { SiteState } from '../enums';
import { clearScene } from '../slices/sceneSlice';
import { LoadState, setLoadState } from '../slices/accountSlice';
import { batch } from 'react-redux';

const socket = io(process.env.REACT_APP_SOCKET_URL as string, {
  auth: {
    token: '',
  },
  autoConnect: false,
  reconnectionAttempts: 3,
});

socket.on('authFailed', () => localStorage.removeItem('jwt'));
socket.on('connect', () => {
  console.log('Connected to the game server.');
});
socket.on('disconnect', () => {
  console.log('Disconnected from game server.');
  batch(() => {
    store.dispatch(clearScene());
    store.dispatch(switchState(SiteState.LANDING));
    store.dispatch(setLoadState(LoadState.NOT_LOADED));
  });
});
// socket.onAny((event, ...args) => {
//   console.log(`got ${event}`);
// });

export function connectWithJWT(jwt: string) {
  // @ts-ignore
  socket.auth.token = jwt;
  socket.connect();
}

export function logOff() {
  localStorage.removeItem('jwt');
  socket.disconnect();
}

export const toServer = (event: string, data: any = null, cb: (...args: any[]) => void = () => {}) => socket.emit(event, data, cb);
export const fromServer = (event: string, cb: (...args: any[]) => void) => socket.on(event, cb);
export const cancelFromServer = (event: string, cb?: (...args: any[]) => void) => socket.off(event, cb);
