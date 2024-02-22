import { useEffect } from 'react';
import { createLoader } from '../../components/phaser/Loader';
import store from '../../store';
import { useAppSelector } from '../../hooks';

export function Crops() {
  const scale = useAppSelector((state) => state.ui.scale);

  useEffect(() => {
    const _game = new Phaser.Game({ ...config, parent: 'crops-container' });

    return () => {
      _game.destroy(true);
    };
  }, []);

  return (
    <div style={{ position: 'absolute', top: 705 * scale, left: 227 * scale }}>
      <div id="crops-container" style={{ width: 1165 * scale, height: 178 * scale }} />
    </div>
  );
}

class Scene extends Phaser.Scene {
  id: number;
  customScale: number;
  onClick: () => void;

  preload() {
    createLoader(this);

    this.load.setBaseURL(process.env.REACT_APP_CDN_PATH);
    if (process.env.NODE_ENV === 'development') {
      this.load.crossOrigin = 'anonymous';
    }
    this.load.setPath('scenes/home');
    this.load.image('1', '1.png');
    this.load.image('2', 'f_2_active.png');
  }

  create() {
    const scale = store.getState().ui.scale;
    const fields = [
      {
        img: '1',
        position: [473, 0],
      },
      {
        img: '2',
        position: [238, 0],
      },
    ];

    fields.forEach((field) => {
      const s = this.add
        .sprite(field.position[0] * scale, field.position[1], field.img)
        .setOrigin(0)
        .setScale(scale)
        .setInteractive({ pixelPerfect: true });

      this.scale.on('resize', (gameSize: any) => {
        const newScale = gameSize.width / Number(this.game.config.width);

        s.setScale(newScale);
        s.setPosition(field.position[0] * newScale, field.position[1] * newScale);
      });

      s.on(Phaser.Input.Events.POINTER_OVER, () => {
        s.setTint(0xaaa);

        this.input.setDefaultCursor('pointer');
      });

      s.on(Phaser.Input.Events.POINTER_OUT, () => {
        s.clearTint();

        this.input.setDefaultCursor('default');
      });

      this.input.on(Phaser.Input.Events.GAME_OUT, () => {
        s.clearTint();

        this.input.setDefaultCursor('default');
      });
    });
  }
}

const config = {
  type: Phaser.WEBGL,
  scene: [Scene],
  transparent: true,
  scale: {
    width: 1165,
    height: 178,
    mode: Phaser.Scale.RESIZE,
  },
};
