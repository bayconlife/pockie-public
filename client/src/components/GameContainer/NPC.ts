import { t } from 'i18next';
import { showNPC } from '../../slices/panelSlice';
import store from '../../store';
import '../NPC/NPCContainer.css';
import { UIElement } from './UIElement';

export class NPC extends UIElement {
  private id: number;

  constructor(id: number) {
    super();
    this.id = id;
  }

  // load(scene: Phaser.Scene) {
  //   scene.load.setPath('imgs/npc');
  //   scene.load.multiatlas(`npc-${this.id}`, `${Npcs[this.id].path}.json`);
  // }

  // create(scene: Phaser.Scene) {
  //   scene.anims.create({
  //     key: `npc-${this.id}`,
  //     frameRate: 12,
  //     frames: scene.anims.generateFrameNames(`npc-${this.id}`, {
  //       start: 1,
  //       end: scene.textures.get(`npc-${this.id}`).frameTotal - 1,
  //     }),
  //     repeat: -1,
  //   });

  //   const position = Npcs[this.id].position ?? { x: 0, y: 0 };

  //   const sprite = scene.add
  //     .sprite(90 + position.x, 15 + position.y, `npc-${this.id}`)
  //     .setOrigin(1)
  //     .setInteractive({ pixelPerfect: true });

  //   sprite.play(`npc-${this.id}`);

  //   sprite.on(Phaser.Input.Events.POINTER_OVER, () => {
  //     sprite.setTint(0xffbf00);
  //     scene.input.setDefaultCursor('pointer');
  //   });
  //   sprite.on(Phaser.Input.Events.POINTER_OUT, () => {
  //     sprite.clearTint();
  //     scene.input.setDefaultCursor('default');
  //   });
  //   sprite.on(Phaser.Input.Events.POINTER_DOWN, () => {
  //     store.dispatch(showNPC(this.id));
  //   });

  //   scene.input.on(Phaser.Input.Events.GAME_OUT, () => {
  //     sprite.clearTint();
  //     scene.input.setDefaultCursor('default');
  //   });

  //   const e = document.createElement('div');
  //   e.setAttribute('data-text', t(`npc__${this.id}--name`));
  //   e.className = 'npc__name';
  //   e.style.fontSize = '34px';
  //   scene.add.dom(sprite.getBounds().centerX, sprite.getBounds().top - 10, e);
  // }
}
