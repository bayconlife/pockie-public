import Phaser from 'phaser';
import { createLoader } from '../../../components/phaser/Loader';
import store from '../../../store';

export class AchievementScene extends Phaser.Scene {
  firstLoad = true;

  constructor() {
    super({ key: 'achievement' });
  }

  preload() {
    if (this.firstLoad) {
      createLoader(this);

      this.load.setBaseURL(process.env.REACT_APP_CDN_PATH);
      if (process.env.NODE_ENV === 'development') {
        this.load.crossOrigin = 'anonymous';
      }
      this.load.setPath('ui/Achievement');
      this.load.multiatlas('achievement', 'achievement.json');
      this.firstLoad = false;
    }
  }

  create() {
    this.anims.create({
      key: 'achievement',
      frameRate: 12,
      frames: this.anims.generateFrameNames(`achievement`, {
        start: 1,
        end: this.textures.get(`achievement`).frameTotal - 1,
      }),
    });

    const sprite = this.add.sprite(0, 0, 'achievement').setOrigin(0).setScale(store.getState().ui.scale).play('achievement');

    this.scale.on('resize', (gameSize: any) => {
      sprite.setScale(gameSize.width / Number(this.game.config.width));
    });
  }
}
