import { Depths } from '../../../enums';
import { CombatPlayerScene } from '../../../features/Fight/Scenes/CombatPlayerScene';
import { Numbers } from './Numbers';

export class FontNumbers extends Numbers {
  constructor(scene: CombatPlayerScene, amount: number, x: number, y: number, isCrit: boolean) {
    super(scene, x, y, isCrit);

    let str = amount > 0 ? `-${amount}` : `+${Math.abs(amount)}`;
    const container = scene.add.container(x, y + 100).setDepth(Depths.COMBAT_UI);

    let fontSize = 32;
    const text = scene.add
      .text(0, 0, str, {
        fontFamily: scene.font,
        fontSize,
      })
      .setOrigin(0.5);

    while (text.height < 42) {
      fontSize++;

      text.setFontSize(fontSize);
    }

    // if (isCrit) {
    //   fontSize *= 1.25;
    // }

    for (let i = -1; i < 2; i++) {
      for (let dy = -1; dy < 2; dy++) {
        if (i === 0 && dy === 0) {
          continue;
        }

        const shadow = scene.add
          .text(i, dy, str, {
            fontFamily: scene.font,
            fontSize,
            color: '#fff',
          })
          .setOrigin(0.5);

        container.add(shadow);
      }
    }

    container.add(text);
    container.setScale(0);

    const gradient = text.context.createLinearGradient(0, 0, 0, text.height);

    if (isCrit) {
      gradient.addColorStop(0, '#993333');
    } else {
      gradient.addColorStop(0, '#fdbb2d');
    }

    gradient.addColorStop(1, amount > 0 ? '#c33222' : '#00cc00');

    text.setFill(gradient);

    const light: Phaser.GameObjects.GameObject[] = [];

    const l = scene.add
      .text(0, 0, str, {
        fontFamily: scene.font,
        fontSize,
      })
      .setOrigin(0.5)
      .setScale(0)
      .setTint(0xffffff)
      .setBlendMode('ADD')
      .setAlpha(0.9);
    light.push(l);
    container.add(l);

    this.applyAnimations([container], light);
  }
}
