import { useEffect } from 'react';
import { createLoader } from '../../components/phaser/Loader';
import EventEmitter from '../../util/EventEmitter';
import store from '../../store';

interface Props {
  onClick: () => void;
}

export function Handle({ onClick }: Props) {
  useEffect(() => {
    const _game = new Phaser.Game({ ...config, parent: 'handle-container' });

    _game.scene.start('lever', { onClick });

    return () => {
      _game.destroy(true);
    };
  }, []);

  return <div id="handle-container" style={{ position: 'absolute', top: 0, left: 0 }} />;
}

export class Scene extends Phaser.Scene {
  id: number;
  customScale: number;
  onClick: () => void;
  isReady = false;

  constructor() {
    super({ key: 'lever' });
  }

  init(config: any) {
    this.id = config.id;
    // this.customScale = config.scale;
    this.onClick = config.onClick;
  }

  preload() {
    createLoader(this);

    this.load.setBaseURL(process.env.REACT_APP_CDN_PATH);
    if (process.env.NODE_ENV === 'development') {
      this.load.crossOrigin = 'anonymous';
    }
    this.load.setPath('ui/SlotMachine');
    this.load.multiatlas('lever', 'lever.json');
    this.load.image('bg', 'bg.png');
  }

  create() {
    this.isReady = store.getState().ui.slotFights.nextRollAt < Date.now();
    this.anims.create({
      key: 'lever',
      frameRate: 12,
      frames: this.anims.generateFrameNames(`lever`, {
        start: 0,
        end: this.textures.get(`lever`).frameTotal - 1,
      }),
      repeat: 0,
    });

    this.add.sprite(0, 0, 'bg').setOrigin(0);

    const sprite = this.add.sprite(247, 105, 'lever').setOrigin(0).setInteractive({ pixelPerfect: true }).setFrame(1);

    sprite.on(Phaser.Input.Events.POINTER_OVER, () => {
      if (!this.isReady) {
        this.input.setDefaultCursor('not-allowed');
      } else {
        sprite.setTint(0xffbf00);
        this.input.setDefaultCursor('pointer');
      }
    });

    sprite.on(Phaser.Input.Events.POINTER_OUT, () => {
      if (this.isReady) {
        sprite.clearTint();
      }
      this.input.setDefaultCursor('default');
    });

    sprite.on(Phaser.Input.Events.POINTER_DOWN, () => {
      if (this.isReady) {
        this.onClick();
        sprite.clearTint();
        this.input.setDefaultCursor('not-allowed');
        this.isReady = false;
        sprite.play('lever', true);
      }
    });

    sprite.on(Phaser.Animations.Events.SPRITE_ANIMATION_UPDATE, (_: any, frame: Phaser.Animations.AnimationFrame) => {
      if (frame.index === 14) {
        sprite.setTint(0xaaaaaa);
      }
    });

    if (!this.isReady) {
      sprite.setTint(0xaaaaaa);
    }

    const eventId = EventEmitter.on('slotPullReady', () => {
      this.isReady = true;
      sprite.clearTint();
    });
    this.events.on('destroy', () => EventEmitter.off(eventId));
  }
}

const config = {
  type: Phaser.WEBGL,
  scene: [Scene],
  transparent: true,
  scale: {
    mode: Phaser.Scale.NONE,
  },
  width: 380,
  height: 367,
};
