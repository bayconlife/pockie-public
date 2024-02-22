import { CustomMotion } from './CustomMotion';

export default class DodgeMotion extends CustomMotion {
  key = 'dodge_motion';
  frames = 12;
  transforms = {
    // convert this to 0-1 based on 65536 for 16.16 and 20 for twips
    1: [1, 0, 0, 1, 2220 / 20, 0 / 20],
    11: [1, 0, 0, 1, 780 / 20, 0 / 20], // Changed this from 10 since it seemed to be a frame behind the great strength animation
    12: [1, 0, 0, 1, 0, 0],
  };
}
