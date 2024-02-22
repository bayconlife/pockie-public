import { useEffect, useRef } from 'react';
import { createLoader } from '../../components/phaser/Loader';
import store from '../../store';
import { useAppSelector } from '../../hooks';
import EventEmitter from '../../util/EventEmitter';
import { toServer } from '../../util/ServerSocket';

export function HomeScene() {
  const loadingRef = useRef(false);
  const scale = useAppSelector((state) => state.ui.scale);
  const home = useAppSelector((state) => state.character.home);

  useEffect(() => {
    const _game = new Phaser.Game({ ...config, parent: 'home-scene' });
    const removePlotId = EventEmitter.on('removePlot', (id) => {
      if (!loadingRef.current) {
        loadingRef.current = true;
        toServer('removePlot', id, () => {
          loadingRef.current = false;
        });
      }
    });

    return () => {
      _game.destroy(true);
      EventEmitter.off(removePlotId);
    };
  }, []);

  useEffect(() => {
    EventEmitter.emit('homeUpdate');
  }, [home]);

  return (
    <div style={{ position: 'absolute', top: 0 * scale, left: 0 * scale }}>
      <div id="home-scene" style={{ width: 1920 * scale, height: 1080 * scale }} />
    </div>
  );
}

class Scene extends Phaser.Scene {
  fieldContainer: Phaser.GameObjects.Container;

  preload() {
    createLoader(this);

    this.load.setBaseURL(process.env.REACT_APP_CDN_PATH);
    if (process.env.NODE_ENV === 'development') {
      this.load.crossOrigin = 'anonymous';
    }
    this.load.setPath('scenes/home');
    ['0', '1', '2', '3', '4', '5', '6'].forEach((i) => {
      this.load.image(`${i}_active`, `f_${i}_active.png`);
      this.load.image(`${i}_inactive`, `f_${i}_inactive.png`);
    });
    [0, 1, 2, 3].forEach((i) => {
      this.load.image(`plant_${170001 + i}`, `plants/${170001 + i}.png`);
    });
    this.load.image('plant_growing', 'plants/growing.png');
    this.load.image('egg_bar', 'egg_bar.png');
    this.load.image('egg', 'egg.png');
    this.load.image('egg_bad', 'egg_bad.png');
  }

  create() {
    const scale = store.getState().ui.scale;
    this.fieldContainer = this.add.container(227 * scale, 705 * scale).setScale(scale);

    this.updateFields();

    this.scale.on('resize', (gameSize: any) => {
      const newScale = gameSize.width / Number(this.game.config.width);

      this.fieldContainer.setScale(newScale);
      this.fieldContainer.setPosition(227 * newScale, 705 * newScale);
    });

    // const eggBar = this.add.sprite(this.cameras.main.centerX, 60, 'egg_bar');
    // this.add.sprite(100, 100, 'egg');
    // [1, 2, 3, 4, 5].forEach((i, idx) => this.add.sprite(this.cameras.main.centerX - 95 + 42 * idx, 58, 'egg_bad'));

    // this.scale.on('resize', (gameSize: any) => {
    //   const newScale = gameSize.width / Number(this.game.config.width);

    //   eggBar.setPosition(this.cameras.main.centerX, 60);
    // });

    const eventId = EventEmitter.on('homeUpdate', () => {
      this.updateFields();
    });
    this.events.on('destroy', () => EventEmitter.off(eventId));
  }

  updateFields() {
    this.fieldContainer.removeAll(true);

    const fields = [
      {
        img: '0',
        position: [0, 0],
      },
      {
        img: '1',
        position: [473, 0],
      },
      {
        img: '2',
        position: [238, 0],
      },
      {
        img: '3',
        position: [23, 65],
      },
      {
        img: '4',
        position: [316, 65],
      },
      {
        img: '5',
        position: [607, 65],
      },
    ];
    const farm = store.getState().character.home.farm;

    fields.forEach((field) => {
      const isActive = !!farm[Number(field.img)];
      const plot = this.add
        .sprite(field.position[0], field.position[1], `${field.img}_${isActive ? 'active' : 'inactive'}`)
        .setOrigin(0)
        .setInteractive({ pixelPerfect: true });
      const plant = this.add
        .sprite(plot.x + (plot.width * 5) / 12, plot.y + (plot.height * 7) / 9, `plant_${farm[Number(field.img)]?.[0] ?? 0}`)
        .setOrigin(0.5, 1);

      if (isActive) {
        if (Date.now() < farm[Number(field.img)][1]) {
          plant.setTexture('plant_growing');
        }
      } else {
        plant.setVisible(false);
      }

      plot.on(Phaser.Input.Events.POINTER_UP, () => {
        if (isActive) {
          EventEmitter.emit('removePlot', Number(field.img));
        } else {
          EventEmitter.emit('showFarmOptions', Number(field.img));
        }
      });

      plot.on(Phaser.Input.Events.POINTER_OVER, () => {
        plot.setTint(0xaaaaaa);
        plant.setTint(0xaaaaaa);

        this.input.setDefaultCursor('pointer');
      });

      plot.on(Phaser.Input.Events.POINTER_OUT, () => {
        plot.clearTint();
        plant.clearTint();

        this.input.setDefaultCursor('default');
      });

      this.input.on(Phaser.Input.Events.GAME_OUT, () => {
        plot.clearTint();
        plant.clearTint();

        this.input.setDefaultCursor('default');
      });

      this.fieldContainer.add(plot);
      this.fieldContainer.add(plant);
    });
  }
}

const config = {
  type: Phaser.WEBGL,
  scene: [Scene],
  transparent: true,
  scale: {
    width: 1920,
    height: 1080,
    mode: Phaser.Scale.RESIZE,
  },
};
