import { Depths } from '../../enums';

const font = {
  color: 'white',
  fontSize: 14,
  fontFamily: 'Tahoma',
};

export class Tooltip {
  private box: Phaser.GameObjects.Rectangle;
  private text: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.box = scene.add
      .rectangle(-1000, -1000, 100, 50, 0x000000)
      .setOrigin(0.5, 0)
      .setDepth(Depths.COMBAT_UI + 1);
    this.text = scene.add
      .text(this.box.getBounds().centerX, this.box.getBounds().centerY, '', font)
      .setOrigin(0.5)
      .setDepth(Depths.COMBAT_UI + 1);
  }

  setPosition(x: number, y: number) {
    this.box.setPosition(x, y);
    this.text.setPosition(this.box.getBounds().centerX, this.box.getBounds().centerY);
  }

  setText(text: string) {
    this.text.setText(text);
  }
}
