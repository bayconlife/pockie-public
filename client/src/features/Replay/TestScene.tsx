import { useEffect, useRef } from 'react';
import { Blur } from '../../components/Blur';
import { CenterContainer } from '../../components/CenterContainer/CenterContainer';

export function TestScene() {
  const gameRef = useRef<Phaser.Game>();

  useEffect(() => {
    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current?.destroy(true);
    };
  }, []);

  return (
    <div>
      <Blur />
      <CenterContainer zIndex={20021}>
        <div id="fightContainer" style={{ width: 1000, height: 600 }}></div>
      </CenterContainer>
    </div>
  );
}

class Scene extends Phaser.Scene {
  preload() {
    this.load.setPath('assets/actors/test/');
    this.load.multiatlas('weapon-1', 'weapon-1.json');
    this.load.multiatlas('1', '1.json');
  }
  create() {
    this.add.text(0, 0, 'Hello World');
    console.log(
      this.anims.generateFrameNames('weapon-1', {
        prefix: '52/',
        end: Object.keys(this.textures.get('weapon-1').frames).filter((k) => k.startsWith(`${52}/`)).length,
      })
    );
    console.log(this.textures);
    console.log(Object.keys(this.textures.get('weapon-1').frames).filter((k) => k.startsWith(`${52}/`)).length);
    [52, 999].forEach((id) => {
      this.anims.create({
        key: `${id}`,
        frameRate: 12,
        frames: this.anims.generateFrameNames('weapon-1', {
          prefix: `${id}/`,
          end: Object.keys(this.textures.get('weapon-1').frames).filter((k) => k.startsWith(`${id}/`)).length,
        }),
        repeat: -1,
      });

      this.anims.create({
        key: `people-${id}`,
        frameRate: 12,
        frames: this.anims.generateFrameNames('1', {
          prefix: `${id}/`,
          end: Object.keys(this.textures.get('1').frames).filter((k) => k.startsWith(`${id}/`)).length,
        }),
        repeat: -1,
      });
    });
    this.add.sprite(100, 100, 'weapon-1').play('52');
    const s = this.add.sprite(200, 200, 'weapon-1').play('999');
    this.add.sprite(300, 100, '1').play('people-52');

    console.log(this.textures);

    setTimeout(() => {
      s.play('52');
    }, 2000);
  }
}

const config = {
  type: Phaser.WEBGL,
  height: 600,
  width: 1000,
  scene: [Scene],
  parent: 'fightContainer',
  scale: {
    mode: Phaser.Scale.CENTER_BOTH,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
  },
  dom: {
    createContainer: true,
  },
  fps: {
    target: 24,
    forceSetTimeOut: true,
  },
};
