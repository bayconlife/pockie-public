import { useEffect } from 'react';
import { createLoader } from '../../components/phaser/Loader';
import { IItem } from '../../slices/inventorySlice';
import { JButton } from '../../components/UI/JButton';
import Phaser from 'phaser';

interface Props {
  image: string;
  onClose: () => void;
}

export function Pot({ image, onClose }: Props) {
  useEffect(() => {
    const _game = new Phaser.Game({ ...config, parent: 'pot-container' });
    _game.scene.start('pot', { image: image });

    return () => {
      _game.destroy(true);
    };
  }, []);

  return (
    <>
      <div
        id="pot-container"
        style={{
          position: 'absolute',
          top: '30%',
          left: '40%',
          display: 'flex',
          flexDirection: 'column-reverse',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
        }}>
        <JButton onClick={onClose} text="Close" />
      </div>
    </>
  );
}

export class Scene extends Phaser.Scene {
  id: number;
  customScale: number;
  onClick: () => void;
  image: string;

  constructor() {
    super({ key: 'pot' });
  }

  init(config: any) {
    this.id = config.id;
    // this.customScale = config.scale;
    this.onClick = config.onClick;
    this.image = config.image;
  }

  preload() {
    createLoader(this);

    this.load.setBaseURL(process.env.REACT_APP_CDN_PATH);
    if (process.env.NODE_ENV === 'development') {
      this.load.crossOrigin = 'anonymous';
    }
    this.load.setPath('scenes/arena');
    this.load.multiatlas('pot', 'pot_no_bg.json');
    this.load.multiatlas('bg', 'pot_bg.json');
    this.load.setPath('');
    this.load.image('item', `icons/items/${this.image}.png`);
  }

  create() {
    this.anims.create({
      key: 'pot',
      frameRate: 12,
      frames: this.anims.generateFrameNames(`pot`, {
        start: 0,
        end: this.textures.get(`pot`).frameTotal - 1,
      }),
      repeat: 0,
    });

    this.anims.create({
      key: 'bg',
      frameRate: 12,
      frames: this.anims.generateFrameNames(`bg`, {
        start: 0,
        end: this.textures.get(`bg`).frameTotal - 1,
      }),
      repeat: 0,
    });

    const frame = 21;
    const bg = this.add.sprite(94.55, 58.05, 'bg').setOrigin(0).play('bg');
    this.add.image(bg.getCenter().x, bg.getCenter().y, 'item');
    this.add.sprite(0, 0, 'pot').setOrigin(0).play('pot');

    // const sprite = this.add.sprite(247, 105, 'lever').setOrigin(0).setInteractive({ pixelPerfect: true }).setFrame(1);

    // sprite.on(Phaser.Input.Events.POINTER_OVER, () => {
    //   if (sprite.anims.isPlaying) {
    //     this.input.setDefaultCursor('not-allowed');
    //   } else {
    //     sprite.setTint(0xffbf00);
    //     this.input.setDefaultCursor('pointer');
    //   }
    // });

    // sprite.on(Phaser.Input.Events.POINTER_OUT, () => {
    //   if (!sprite.anims.isPlaying) {
    //     sprite.clearTint();
    //   }
    //   this.input.setDefaultCursor('default');
    // });

    // sprite.on(Phaser.Input.Events.POINTER_DOWN, () => {
    //   if (!sprite.anims.isPlaying) {
    //     this.onClick();
    //     sprite.clearTint();
    //     this.input.setDefaultCursor('not-allowed');
    //   }
    //   sprite.play('lever', true);
    // });

    // sprite.on(Phaser.Animations.Events.SPRITE_ANIMATION_UPDATE, (_: any, frame: Phaser.Animations.AnimationFrame) => {
    //   if (frame.index === 14) {
    //     sprite.setTint(0xaaaaaa);
    //   }
    // });

    // sprite.on(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
    //   sprite.clearTint();
    // });
  }
}

const config = {
  type: Phaser.WEBGL,
  scene: [Scene],
  transparent: true,
  scale: {
    mode: Phaser.Scale.NONE,
  },
  width: 333,
  height: 200,
};
