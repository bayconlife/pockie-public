import Phaser from 'phaser';
import { createLoader } from '../../components/phaser/Loader';
import store from '../../store';

export class LevelUpScene extends Phaser.Scene {
  config: any;

  constructor() {
    super({ key: 'level-up' });
  }

  init(config: any) {
    this.config = config;
  }

  preload() {
    createLoader(this);

    this.load.setBaseURL(process.env.REACT_APP_CDN_PATH);
    if (process.env.NODE_ENV === 'development') {
      this.load.crossOrigin = 'anonymous';
    }
    this.load.setPath('ui/LevelUp');
    this.load.multiatlas('level-up', 'levelup.json');
  }

  create() {
    this.anims.create({
      key: 'level-up',
      frameRate: 12,
      frames: this.anims.generateFrameNames(`level-up`, {
        start: 1,
        end: this.textures.get(`level-up`).frameTotal - 1,
      }),
    });

    const sprite = this.add.sprite(0, 0, 'level-up').setOrigin(0).setScale(store.getState().ui.scale).play('level-up');

    this.scale.on('resize', (gameSize: any) => {
      sprite.setScale(gameSize.width / Number(this.game.config.width));
    });
  }
}
