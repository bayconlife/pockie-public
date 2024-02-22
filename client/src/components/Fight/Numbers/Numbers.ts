import { CombatPlayerScene } from '../../../features/Fight/Scenes/CombatPlayerScene';

export class Numbers extends Phaser.GameObjects.GameObject {
  text: Phaser.GameObjects.Text;
  y: number;
  isCrit: boolean;

  constructor(scene: CombatPlayerScene, x: number, y: number, isCrit: boolean) {
    super(scene, 'number');

    this.y = y;
    this.isCrit = isCrit;
  }

  applyAnimations(container: Phaser.GameObjects.GameObject[], light: Phaser.GameObjects.GameObject[]) {
    this.scene.tweens.add({
      targets: [...container],
      scale: this.isCrit ? 1.5 : 0.8,
      duration: 200,
      ease: Phaser.Math.Easing.Linear,
      onComplete: () => {
        this.scene.tweens.add({
          targets: [...light],
          scale: this.isCrit ? 1.4 : 1.2,
          duration: 300,
          ease: Phaser.Math.Easing.Quadratic.InOut,
          yoyo: true,
        });
        this.scene.tweens.add({
          targets: [...light],
          alpha: 0,
          duration: 300,
          ease: Phaser.Math.Easing.Linear,
        });
      },
    });

    this.scene.tweens.add({
      targets: [...container],
      y: this.y - 61,
      duration: 500,
      ease: Phaser.Math.Easing.Quintic.Out,
      onComplete: () => {
        this.scene.tweens.add({
          targets: [...container],
          alpha: 0,
          y: this.y - 135,
          duration: 600,
          ease: Phaser.Math.Easing.Quintic.In,
          onComplete: () => container.forEach((obj) => obj.destroy()),
        });
      },
    });
  }
}
