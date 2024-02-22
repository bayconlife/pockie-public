import { CharacterAnimation } from '../../../enums';
import { CustomMotion } from './CustomMotion';

export default class HurtLiteMotion extends CustomMotion {
  key = 'hurt_lite_motion'; // 63
  frames = 7;
  transforms = {
    // convert this to 0-1 based on 65536 for 16.16 and 20 for twips
    1: [1, 0, 0, 1, 920 / 20, 0],
    6: [1, 0, 0, 1, 540 / 20, 0],
    7: [1, 0, 0, 1, 0, 0],
  };
  characterAnimation = CharacterAnimation.HURT_LITE;
}
