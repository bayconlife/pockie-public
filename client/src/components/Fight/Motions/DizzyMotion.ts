import { CustomMotion } from './CustomMotion';

export default class DizzyMotion extends CustomMotion {
  key = 'dizzy_motion';
  frames = 12;
  transforms = {
    1: [1, 0, 0, 1, -2, 0],
    2: [1, 0, 0, 1, 2, 0],
    3: [1, 0, 0, 1, -2, 0],
    4: [1, 0, 0, 1, 2, 0],
    5: [1, 0, 0, 1, -2, 0],
    6: [1, 0, 0, 1, 2, 0],
    7: [1, 0, 0, 1, -2, 0],
    8: [1, 0, 0, 1, 2, 0],
    9: [1, 0, 0, 1, -2, 0],
    10: [1, 0, 0, 1, 2, 0],
    11: [1, 0, 0, 1, -2, 0],
    12: [1, 0, 0, 1, 2, 0],
  };
}
