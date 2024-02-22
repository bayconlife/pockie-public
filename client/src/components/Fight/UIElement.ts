import { Depths } from '../../enums';

export default class UIElement {
  protected scene: Phaser.Scene;
  protected key: string;
  protected file: string;
  protected w: number; // frameWidth
  protected h: number; // frameHeight
  public image: Phaser.GameObjects.Image;
  public sprite: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  create(x: number, y: number, flip: boolean): Phaser.GameObjects.Image {
    this.image = this.scene.add.image(x, y, 'combat-ui', this.key).setDepth(Depths.COMBAT_UI).setOrigin(0, 0);

    if (flip) {
      this.image.setScale(this.image.scaleX * -1, this.image.scaleY);
    }

    return this.image;
  }

  hide() {
    this.image.setVisible(false);

    // this.image.setFrame;
  }

  setFrame(frame: number) {
    if (this.image) {
      this.image.setFrame(frame);
    }

    if (this.sprite) {
      this.sprite.setFrame(frame);
    }
  }

  // animate(start: number, end: number, reverse: boolean, options?: any) {
  //   this.scene.anims.remove(`combat-ui-${this.key}`);
  //   this.scene.anims.create({
  //     key: `combat-ui-${this.key}`,
  //     frames: this.scene.anims.generateFrameNumbers(`combat-ui-${this.key}`, { start: start, end: end }),
  //     frameRate: 12,
  //     ...options,
  //   });

  //   if (reverse) {
  //     this.sprite.anims.playReverse(`combat-ui-${this.key}`);
  //   } else {
  //     this.sprite.play(`combat-ui-${this.key}`);
  //   }
  // }

  // animateReverse() {
  //   this.sprite.anims.reverse();
  // }

  tint(color: number) {
    this.sprite.setTint(color);
  }
}
