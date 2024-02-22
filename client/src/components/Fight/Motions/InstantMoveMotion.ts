import { CustomMotion } from './CustomMotion';

export default class InstantMoveMotion extends CustomMotion {
  key = 'instantmove_motion';
  frames = 1;
  transforms = {
    1: [1, 0, 0, 1, -6600 / 20, 0],
  };
}
