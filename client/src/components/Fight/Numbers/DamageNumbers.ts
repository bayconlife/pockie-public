import { Depths } from '../../../enums';
import { CombatPlayerScene } from '../../../features/Fight/Scenes/CombatPlayerScene';
import { FightScene } from '../Scenes';
import { Numbers } from './Numbers';

export class DamageNumbers extends Numbers {
  text: Phaser.GameObjects.Text;

  constructor(scene: CombatPlayerScene, amount: number, x: number, y: number, isCrit: boolean) {
    super(scene, x, y, isCrit);

    let i = 0;
    let str = amount > 0 ? `-${amount}` : `+${Math.abs(amount)}`;
    // const container = scene.add.container(x, y + 100).setDepth(Depths.COMBAT_UI);
    const container: Phaser.GameObjects.Sprite[] = [];
    // const shadow: Phaser.GameObjects.Sprite[] = [];
    const light: Phaser.GameObjects.Sprite[] = [];

    if (amount === 0) {
      str = '0';
    }

    for (let char of str) {
      if (char === '-') char = 'less';
      if (char === '+') char = 'more';

      // const s = scene.add
      //   .sprite(x + i * 22, y, `damage-normal`, char)
      //   .setOrigin(0.5)
      //   .setScale(0)
      //   .setTint(0x444444)
      //   .setAlpha(0.7)
      //   .setDepth(Depths.COMBAT_UI);
      // shadow.push(s);
      // container.push(s);

      container.push(
        scene.add
          .sprite(x + i * 22, y, amount > 0 ? 'damage-normal' : 'damage-heal', char)
          .setOrigin(0.5)
          .setScale(0)
          .setDepth(Depths.COMBAT_UI)
      );

      const l = scene.add
        .sprite(x + i * 22, y, amount > 0 ? 'damage-normal' : 'damage-heal', char)
        .setOrigin(0.5)
        .setScale(0)
        .setTint(0xffffff)
        .setBlendMode('ADD')
        .setAlpha(0.9)
        .setDepth(Depths.COMBAT_UI);
      light.push(l);
      container.push(l);
      i++;
    }

    this.applyAnimations(container, light);
  }
}
