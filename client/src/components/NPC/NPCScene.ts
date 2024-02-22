import Phaser from 'phaser';
import { createLoader } from '../phaser/Loader';
import EventEmitter from '../../util/EventEmitter';
import store from '../../store';

export class NPCScene extends Phaser.Scene {
  id: number;

  constructor() {
    super({ key: 'npc' });
  }

  init(config: any) {
    this.id = config.id;
  }

  preload() {
    createLoader(this);

    this.load.setBaseURL(process.env.REACT_APP_CDN_PATH);
    if (process.env.NODE_ENV === 'development') {
      this.load.crossOrigin = 'anonymous';
    }
    this.load.setPath('actors/npcs');
    this.load.multiatlas('npc', `${this.id}.json`);
  }

  create() {
    this.anims.create({
      key: 'npc',
      frameRate: 12,
      frames: this.anims.generateFrameNames(`npc`, {
        start: 1,
        end: this.textures.get(`npc`).frameTotal - 1,
      }),
      repeat: -1,
    });

    const sprite = this.add.sprite(0, 0, 'npc').setOrigin(0).setInteractive({ pixelPerfect: true }).setScale(store.getState().ui.scale);

    this.scale.on('resize', (gameSize: any) => {
      sprite.setScale(gameSize.width / Number(this.game.config.width));
    });

    sprite.play('npc');

    sprite.on(Phaser.Input.Events.POINTER_OVER, () => {
      sprite.setTint(0xffbf00);
      this.input.setDefaultCursor('pointer');
    });
    sprite.on(Phaser.Input.Events.POINTER_OUT, () => {
      sprite.clearTint();
      this.input.setDefaultCursor('default');
    });
    sprite.on(Phaser.Input.Events.POINTER_DOWN, () => {
      EventEmitter.emit('npc-click', this.id);
    });

    this.input.on(Phaser.Input.Events.GAME_OUT, () => {
      sprite.clearTint();
      this.input.setDefaultCursor('default');
    });
  }
}
