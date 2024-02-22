import { CustomMotion } from './CustomMotion';

export default class BombMotion extends CustomMotion {
  key = 'bomb_motion';
  frames = 20;
  transforms = {
    1: [1, 0, 0, 1, 0, 0],
  };
}
