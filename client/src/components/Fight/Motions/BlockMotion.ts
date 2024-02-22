import { CustomMotion } from './CustomMotion';

export default class BlockMotion extends CustomMotion {
  key = 'block_motion';
  frames = 9;
  transforms = {
    1: [1, 0, 0, 1, 0, 0],
    2: [1, 0, 0, 1, 740 / 20, 0],
    3: [1, 0, 0, 1, 820 / 20, 0],
    8: [1, 0, 0, 1, 180 / 20, 0],
    9: [1, 0, 0, 1, 0, 0],
  };
}
