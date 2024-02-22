import { CustomMotion } from './CustomMotion';

export default class SubstitueMotion extends CustomMotion {
  key = 'substitute_motion';
  frames = 14;
  transforms = {
    1: [1, 0, 0, 1, 0, 0],
  };
  colorTransforms = {
    1: [256, 256, 256, 0],
    14: [256, 256, 256, 1],
  };
}
