import Character from '../Characters/Character';

const ANIMATIONS = {
  THROW: 'throw',
  IDLE: 'idle',
  GREAT_STRENGTH: 'great_strength',
  DISAPPEAR: 'disappear',
  APPEAR: 'appear',
  MOVE: 'move',
  ZONE_ENTRANCE: 'zone_entrance',
  ATTACK: 'attack',
  JUTSU: 'jutsu',
  HURT_LITE: 'hurt_lite',
  HURT_HEAVY: 'hurt_heavy',
  BOMB_DAMAGE: 'bomb_damage',
};

interface Transforms {
  [key: string]: number[];
}

interface ColorTransforms {
  [key: string]: number[];
}

export class Motion {
  protected scene: Phaser.Scene;
  protected source: Character;
  protected transforms: Transforms = {};
  protected animationKey: string;
  protected key: string;
  protected frames: number;
  protected meshes: Phaser.GameObjects.Mesh[];
  private quads: Phaser.GameObjects.GameObject[];
  protected frameRate = 1;
  protected debug = false;
  protected offsetX = 0;
  protected offsetY = 0;
  protected characterAnimation: string;
  protected characterAnimationFrame: number;
  protected characterAnimationFreeze = false;
  protected colorTransforms: ColorTransforms = {};

  constructor(scene: Phaser.Scene, data: any) {
    this.scene = scene;
    this.key = data.key;
    this.transforms = data.transforms;
    this.meshes = [];
    this.quads = [];

    const frames = Object.keys(this.transforms).reduce((max, key) => {
      if (parseInt(key, 10) > max) {
        return parseInt(key, 10);
      }

      return max;
    }, 0);

    this.scene.anims.create({
      key: `custom-${this.key}`,
      frames: new Array(frames).fill({ key: `custom-blank` }),
      frameRate: 12,
    });
  }

  async apply(source: Character) {
    this.source = source;
    this.frames = Object.keys(this.transforms).length;

    return new Promise((resolve) => {
      if (this.characterAnimationFrame === undefined && this.characterAnimation) {
        source.animate(this.characterAnimation);
      }

      const sprite = this.scene.add.sprite(source.container.x, source.container.y, `custom-blank`).setDepth(100);
      sprite.play(`custom-${this.key}`);

      sprite.on(Phaser.Animations.Events.SPRITE_ANIMATION_UPDATE, (_: any, frame: Phaser.Animations.AnimationFrame) => {
        if (frame.index in this.transforms && !this.debug) {
          if (this.characterAnimationFrame !== undefined && frame.index === this.characterAnimationFrame && this.characterAnimation) {
            source.animate(this.characterAnimation);
          }
          this.updateMeshes(frame.index);
        }

        if (frame.index in this.colorTransforms && !this.debug) {
          this.updateColors(frame.index);
        }
      });

      sprite.once(`animationcomplete`, () => {
        this.quads.forEach((quad) => {
          quad.destroy();
        });

        sprite.destroy();

        source.transformFinish();

        resolve(null);
      });

      this.updateMeshes(1);
      this.updateColors(1);
    });
  }

  updateColors(frame: number) {
    if (!(frame in this.colorTransforms)) {
      return;
    }

    const transform = this.colorTransforms[frame];
    // [red, green, blue, alpha]
    this.source.container.setAlpha(transform[3]);
  }

  updateMeshes(frame: number) {
    if (!(frame in this.transforms)) {
      return;
    }

    this.meshes.forEach((mesh) => {
      mesh.destroy();
    });

    this.quads.forEach((quad) => {
      quad.destroy();
    });

    this.meshes = [];
    this.quads = [];

    const t = this.transforms[frame];
    const m = [
      t[0], // scaleX, skewY
      t[1],
      t[2], // skewX, scaleY
      t[3],
      t[4], // translateX, translateY
      t[5],
    ];

    this.source.transform(m);
  }
}
