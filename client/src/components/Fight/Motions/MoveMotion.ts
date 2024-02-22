import { CustomMotion } from './CustomMotion';

export default class MoveMotion extends CustomMotion {
  key = 'move_motion';
  frames = 9;
  transforms = {
    1: [1, 0, 0, 1, -0 / 20, 0],
    2: [1, 0, 0, 1, -840 / 20, 0],
    3: [1, 0, 0, 1, -1660 / 20, 0],
    4: [1, 0, 0, 1, -2480 / 20, 0],
    5: [1, 0, 0, 1, -3300 / 20, 0],
    6: [1, 0, 0, 1, -4140 / 20, 0],
    7: [1, 0, 0, 1, -4960 / 20, 0],
    8: [1, 0, 0, 1, -5780 / 20, 0],
    9: [1, 0, 0, 1, -6600 / 20, 0],
  };
}
