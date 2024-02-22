import { CustomMotion } from './CustomMotion';

export default class GreatStrengthMotion extends CustomMotion {
  key = 'great_strength_motion';
  frames = 18;
  transforms = {
    // convert this to 0-1 based on 65536 for 16.16 and 20 for twips
    1: [1, 0, 0, 1, 48 / 20, -4160 / 20],
    8: [1, 0, 0, 1, 0 / 20, 0 / 20], // Changed this from 10 since it seemed to be a frame behind the great strength animation
  };
}
