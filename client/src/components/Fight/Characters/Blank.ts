import { CharacterAnimation } from '../../../enums';
import Character from './Character';

export default class Blank extends Character {
  name = 'blank';
  animations = {
    [CharacterAnimation.BOMB_KICK]: [], // 2
    [CharacterAnimation.BOMB_THROW]: [], // 3
    // // [CharacterAnimation.??]: [], // 4
    [CharacterAnimation.JUTSU]: [], // 6
    [CharacterAnimation.BUFF]: [], // 7
    [CharacterAnimation.GREAT_STRENGTH]: [], // 17
    [CharacterAnimation.WINDUP_ATTACK]: [], // 21
    // // [CharacterAnimation.??]: [], // 51
    [CharacterAnimation.ATTACK]: [], // 52
    [CharacterAnimation.ATTACK_2]: [], // 53
    [CharacterAnimation.ATTACK_3]: [], // 54
    [CharacterAnimation.MOVE]: [], // 55
    [CharacterAnimation.DEAD]: [], // 57
    [CharacterAnimation.WIN]: [], // 59
    [CharacterAnimation.HURT_LITE]: [], // 63
    [CharacterAnimation.HURT_HEAVY]: [], // 64
    [CharacterAnimation.REVIVE]: [], // 66
    [CharacterAnimation.KISS]: [], // 67
    [CharacterAnimation.DODGE]: [], // 68
    [CharacterAnimation.BLOCK]: [], // 69
    [CharacterAnimation.TAUNT]: [], // 72
    // // [CharacterAnimation.??]: [], // 73
    [CharacterAnimation.ZONE_ENTRANCE]: [], // 75
    [CharacterAnimation.BOMB_KNOCKBACK]: [], // 203
    [CharacterAnimation.IDLE]: [], // 999
  };
}
