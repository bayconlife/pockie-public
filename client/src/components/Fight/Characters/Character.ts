import { CharacterAnimation, Depths } from '../../../enums';
import EventEmitter from '../../../util/EventEmitter';
import { FightRole } from '../CharacterFactoryV2';
import { Effect } from '../Effects/Effect';
import { CustomMotion } from '../Motions/CustomMotion';
import HurtLiteMotion from '../Motions/DamageHeavyMotion';
import MoveMotion from '../Motions/MoveMotion';
import { FightScene } from '../Scenes';
import AnimatedQuad from './AnimatedQuad';

// [CharacterAnimation.BOMB_KICK]: [], // 2
// [CharacterAnimation.BOMB_THROW]: [], // 3
// // // [CharacterAnimation.??]: [], // 4
// [CharacterAnimation.JUTSU]: [], // 6
// [CharacterAnimation.BUFF]: [], // 7
// [CharacterAnimation.GREAT_STRENGTH]: [], // 17
// [CharacterAnimation.WINDUP_ATTACK]: [], // 21
// // // [CharacterAnimation.??]: [], // 51
// [CharacterAnimation.ATTACK]: [], // 52
// [CharacterAnimation.ATTACK_2]: [], // 53
// [CharacterAnimation.ATTACK_3]: [], // 54
// [CharacterAnimation.MOVE]: [], // 55
// [CharacterAnimation.DEAD]: [], // 57
// [CharacterAnimation.WIN]: [], // 59
// [CharacterAnimation.HURT_LITE]: [], // 63
// [CharacterAnimation.HURT_HEAVY]: [], // 64
// [CharacterAnimation.REVIVE]: [], // 66
// [CharacterAnimation.KISS]: [], // 67
// [CharacterAnimation.DODGE]: [], // 68
// [CharacterAnimation.BLOCK]: [], // 69
// [CharacterAnimation.TAUNT]: [], // 72
// // // [CharacterAnimation.??]: [], // 73
// [CharacterAnimation.ZONE_ENTRANCE]: [], // 75
// [CharacterAnimation.BOMB_KNOCKBACK]: [], // 203
// [CharacterAnimation.IDLE]: [], // 999

export default class Character {
  public animations: { [key: string]: number[] } = {};
  public weaponAnimations: { [key: string]: { [key: string]: number[] } } = {};
  protected scene: Phaser.Scene;

  private sprite: AnimatedQuad;
  private weapon: AnimatedQuad;
  private lastTransform: number[];
  private hasWeapon = false;
  private weaponId = '5';

  public name = '';
  public moved = false;
  public startingPosition = { x: 0, y: 0 };
  public x: number;
  public y: number;
  public container: Phaser.GameObjects.Container;
  public isOnOffense = false;
  public hp = 0;
  public maxHp = 0;
  public mp = 0;
  public maxMp = 0;
  public shield = 0;
  public index = -1;
  public secretTechnique: {
    offset: any;
    damageFrame: number;
    motionFrame: number;
    transforms: any;
    characterAnimation?: CharacterAnimation;
    concurrent?: string;
  };
  public animation: string;

  public fightRole: FightRole = {
    avatar: 0,
    index: 0,
    isOnOffense: true,
    hp: 100,
    maxHp: 100,
    mp: 100,
    maxMp: 100,
  };
  public pet: Character;
  public usedAnimations = new Set<string>();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  create() {
    if (Object.keys(this.weaponAnimations).length !== 0 && this.fightRole.weaponId !== undefined) {
      this.hasWeapon = true;
      this.weaponId = '' + this.fightRole.weaponId;
    } else {
      this.weaponId = '1';
    }

    this.sprite = new AnimatedQuad(
      this.scene,
      this.animations[CharacterAnimation.IDLE][0],
      this.animations[CharacterAnimation.IDLE][1],
      `${this.name}-avatar`
    ).setDepth(Depths.CHARACTER);

    if (this.hasWeapon) {
      this.weapon = new AnimatedQuad(
        this.scene,
        this.weaponAnimations[CharacterAnimation.IDLE][this.weaponId][0],
        this.weaponAnimations[CharacterAnimation.IDLE][this.weaponId][1],
        `${this.name}-weapon-${this.weaponId}`
      );
      this.container = this.scene.add.container(-1000, -1000, [this.sprite, this.weapon]);
    } else {
      this.container = this.scene.add.container(-1000, -1000, [this.sprite]);
    }

    this.container.depth = Depths.CHARACTER;

    if (this.fightRole.pet) {
      this.pet.create().setDepth(Depths.BEHIND_CHARACTER);
    }

    return this;
  }

  addEffect(effect: Effect, depth: Depths) {
    if (effect.getData('config')) {
      if (effect.getData('config').isOnPet && this.pet) {
        this.pet.addEffect(effect, depth);

        return;
      }
    }

    if (this.container.getByName(effect.name) === null) {
      if (depth === Depths.BEHIND_CHARACTER) {
        this.container.addAt(effect, 0);
      } else {
        this.container.add(effect);
      }
    }
  }

  removeEffect(name: string) {
    this.container.remove(this.container.getByName(name), true);
    this.pet?.removeEffect(name);
  }

  async animate(name: string, frameEvents?: any) {
    this.animation = name;

    if (name === CharacterAnimation.SECRET_TECHNIQUE) {
      return new Promise((resolve) => resolve(null));
    }

    return new Promise((resolve) => {
      if (!(name in this.animations)) {
        return resolve(null);
      }

      this.sprite.setFrame(`${name}/1`).animate2(
        `${this.name}-${name}`,
        [this.animations[name][0] + this.tempOffset.x, this.animations[name][1] + this.tempOffset.y],
        () => {
          resolve(null);
        },
        frameEvents
      );

      if (name in this.weaponAnimations && this.hasWeapon) {
        this.weapon.setVisible(true);
        this.weapon
          .setFrame(`${name}/1`)
          .animate2(`${this.name}-${name}-${this.weaponId}`, [
            this.weaponAnimations[name][this.weaponId][0],
            this.weaponAnimations[name][this.weaponId][1],
          ]);
      } else if (this.hasWeapon) {
        this.weapon.setVisible(false);
      }

      this.tempOffset.x = 0;
      this.tempOffset.y = 0;
    });
  }

  async attack() {
    await this.animate(CharacterAnimation.ATTACK);
  }

  async damage(damage: number, isCrit: boolean, motion?: typeof CustomMotion | null, motionArgs?: any) {
    if (damage === 0) {
      return;
    }

    if (damage !== undefined) {
      this.scene.events.emit('damage', { amount: damage, x: this.x, y: this.y, isTarget: !this.isOnOffense, isCrit });
      this.hp = Math.max(this.hp - damage, 0);
    }

    EventEmitter.emit('combatStatUpdate', { stat: 'hp', value: this.hp, index: this.index });
    if (this.hp <= 0) {
      // this.container.removeAll(true);
      await this.animate(CharacterAnimation.DEAD);
    } else if (damage > 0) {
      if (motion !== undefined && motion !== null) {
        await new motion(this.scene, this).create(motionArgs);
        this.animate(CharacterAnimation.IDLE);
      }
    }
  }

  decreaseMp(amount: number) {
    if (amount === 0) {
      return;
    }

    this.mp = Math.min(Math.max(this.mp - amount, 0), this.fightRole.maxMp);
    EventEmitter.emit('combatStatUpdate', { stat: 'mp', value: this.mp, index: this.fightRole.index });
    this.scene.events.emit('decreaseMp', { amount, isTarget: !this.isOnOffense });
  }

  async end() {
    if (!this.moved) return;
    if (this.hp <= 0) return;

    this.flip();
    this.animate(CharacterAnimation.MOVE);
    await new MoveMotion(this.scene, this).create();
    this.flip();
    this.animate(CharacterAnimation.IDLE);
    this.container.setPosition(this.x, this.y);
    this.moved = false;
  }

  flip() {
    this.container.scaleX *= -1;

    return this;
  }

  hide(removePet = false) {
    this.container.setVisible(false);

    if (removePet) {
      this.pet?.hide();
    }
  }

  secretTechniqueDamage() {
    this.sprite
      .setFrame(`${CharacterAnimation.HURT_LITE}/1`)
      .animate2(`${this.name}-damage-lock`, [
        this.animations[CharacterAnimation.HURT_LITE][0] + this.tempOffset.x,
        this.animations[CharacterAnimation.HURT_LITE][1] + this.tempOffset.y,
      ]);
    this.weapon?.setVisible(false);
  }

  async move() {
    this.moved = true;
    this.animate(CharacterAnimation.MOVE);

    await new MoveMotion(this.scene, this).create();
  }

  setDepth(depth: number) {
    this.sprite.setDepth(depth);
    this.container.setDepth(depth);

    return this;
  }

  setLocation(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.moved = true;
  }

  tempOffset = {
    x: 0,
    y: 0,
  };
  setTempOffset(x: number, y: number) {
    this.tempOffset.x = x;
    this.tempOffset.y = y;
  }

  show() {
    this.container.setVisible(true);
    this.pet?.show();
  }

  transform(matrix: number[]) {
    matrix[4] *= Math.sign(this.container.scaleX);

    const p = { x: this.x + matrix[4], y: this.y + matrix[5] };
    this.container.x = p.x;
    this.container.y = p.y;

    this.lastTransform = matrix;

    this.container.list.forEach((child) => {
      if (child instanceof AnimatedQuad && child.visible) {
        child.transform(matrix, Math.sign(this.container.scaleX) === -1);
      }
    });
  }

  transformFinish() {
    if (this.lastTransform) {
      this.x = this.x + this.lastTransform[4];
      this.y = this.y + this.lastTransform[5];
    }
  }

  async zoneIn(x: number, y: number, readyFunction?: () => void, test = false) {
    this.x = x;
    this.y = y;
    this.startingPosition = { x, y };
    this.container.x = x;
    this.container.y = y;

    if (this.fightRole.pet) {
      if (this.isOnOffense) {
        this.pet.zoneIn(160, 505);
      } else {
        this.pet.zoneIn(840, 505);
      }

      if (this.container.scaleX < 0) {
        this.pet.flip();
      }
    }

    await this.animate(CharacterAnimation.ZONE_ENTRANCE);
    await this.animate(CharacterAnimation.TAUNT);
    this.animate(CharacterAnimation.IDLE);

    readyFunction?.();
  }
}
