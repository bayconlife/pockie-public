import UIElement from '../../../components/Fight/UIElement';

export class HealthBar extends UIElement {
  protected mask: Phaser.GameObjects.Image;
  protected maskAnimation: Phaser.GameObjects.Image;

  create(x: number, y: number, flip: boolean) {
    const name = flip ? 'health_bar_single_flip' : 'health_bar_single';
    const animation = this.scene.add
      .sprite(x, y, 'combat-ui', name)
      .setOrigin(flip ? 0 : 1, 0.5)
      .setTint(0x757575)
      .setDepth(100);
    this.sprite = this.scene.add
      .sprite(x, y, 'combat-ui', name)
      .setOrigin(flip ? 0 : 1, 0.5)
      .setDepth(101);
    this.mask = this.scene.make
      .image({ x, y, key: 'combat-ui-2', frame: name }, false)
      .setOrigin(flip ? 0 : 1, 0.5)
      .setScale(1, 1);
    this.maskAnimation = this.scene.make
      .image({ x, y, key: 'combat-ui-2', frame: name }, false)
      .setOrigin(flip ? 0 : 1, 0.5)
      .setScale(1, 1);

    animation.setMask(animation.createBitmapMask(this.maskAnimation));
    this.sprite.setMask(this.sprite.createBitmapMask(this.mask));

    return this.sprite;
  }

  update(percent: number) {
    this.mask.setScale(percent, this.mask.scaleY);

    this.scene.tweens.add({
      targets: [this.maskAnimation],
      scaleX: percent,
      duration: 1200,
      ease: Phaser.Math.Easing.Linear,
    });

    return this.sprite;
  }
}
