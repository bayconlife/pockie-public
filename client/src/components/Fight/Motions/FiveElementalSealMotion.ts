import { CustomMotion } from './CustomMotion';

export default class FiveElementalSealMotion extends CustomMotion {
  key = 'five_elemental_seal_motion';
  frames = 12;
  transforms = {
    1: [1, 0, 0, 1, -2820 / 20, 0],
    11: [1, 0, 0, 1, -780 / 20, 0],
    12: [1, 0, 0, 1, 0, 0],
  };
}
