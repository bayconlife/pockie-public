import { CustomMotion } from './CustomMotion';

export default class AssassinateMotion extends CustomMotion {
  key = 'assassinate_motion';
  frames = 29;
  transforms = {
    1: [1, 0, 0, 1, -3920 / 20, 0],
    10: [1, 0, 0, 1, -480 / 20, 0],
    23: [1, 0, 0, 1, 0, 0],
  };
}
