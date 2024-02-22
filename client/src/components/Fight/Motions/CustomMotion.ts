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

export class CustomMotion {
  protected scene: Phaser.Scene;
  protected source: Character;
  protected transforms: Transforms = {};
  protected animationKey: string;
  protected key: string;
  protected frames: number;
  protected meshes: Phaser.GameObjects.Mesh[];
  private quads: Phaser.GameObjects.GameObject[];
  private frame = 0;
  protected frameRate = 1;
  protected debug = false;
  protected offsetX = 0;
  protected offsetY = 0;
  protected characterAnimation: string;
  protected characterAnimationFrame: number;
  protected characterAnimationFreeze = false;
  protected colorTransforms: ColorTransforms = {};

  constructor(scene: Phaser.Scene, source: Character) {
    this.scene = scene;
    this.source = source;
    this.meshes = [];
    this.quads = [];
  }

  async create(motionArgs: any = {}) {
    if (Array.isArray(motionArgs.transforms) && motionArgs.transforms.length === 0) {
      return new Promise((resolve) => resolve(null));
    }

    if (motionArgs.transforms) {
      console.log(typeof motionArgs.transforms, motionArgs.transforms);
      this.transforms = motionArgs.transforms;
      this.frames = Number(Object.keys(this.transforms).sort((a, b) => Number(b) - Number(a))[0]);
    }

    return new Promise((resolve) => {
      if (this.characterAnimationFrame === undefined && this.characterAnimation) {
        this.source.animate(this.characterAnimation);
      }

      if (!this.scene.anims.exists(`custom-${this.key}`)) {
        this.scene.anims.create({
          key: `custom-${this.key}`,
          frames: new Array(this.frames).fill({ key: `custom-blank` }),
          frameRate: 12,
        });
      }

      const sprite = this.scene.add
        .sprite(this.source.container.x, this.source.container.y, `custom-blank`)
        .setDepth(100)
        .setVisible(false);
      sprite.play(`custom-${this.key}`);

      sprite.on(`animationupdate-custom-${this.key}`, (_: any, frame: Phaser.Animations.AnimationFrame) => {
        if (frame.index in this.transforms && !this.debug) {
          if (this.characterAnimationFrame !== undefined && frame.index === this.characterAnimationFrame && this.characterAnimation) {
            this.source.animate(this.characterAnimation);
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

        this.source.transformFinish();

        resolve(null);
      });

      if (this.debug) {
        this.scene.input.keyboard.addKey('B').on('up', () => {
          if (this.frame < this.frames) {
            this.frame += 1;
          }

          if (this.frame in this.transforms) {
            this.updateMeshes(this.frame);
          }
        });
      }

      if (1 in this.transforms) {
        this.updateMeshes(1);
      }

      if (1 in this.colorTransforms) {
        this.updateColors(1);
      }
    }).catch((e) => console.log(e, this.key));
  }

  updateColors(frame: number) {
    const transform = this.colorTransforms[frame];
    // [red, green, blue, alpha]
    this.source.container.setAlpha(transform[3]);
  }

  updateMeshes(frame: number) {
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
