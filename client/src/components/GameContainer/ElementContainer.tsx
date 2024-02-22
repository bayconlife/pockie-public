import './Building.css';

import { useEffect } from 'react';
import { useAppSelector } from '../../hooks';
import { createLoader } from '../phaser/Loader';
import { UIElement } from './UIElement';
import { NPC } from './NPC';
import { QuestState } from '../../enums';

interface Props {
  elements?: UIElement[];
}

let _game: Phaser.Game;

export function ElementContainer({ elements = [] }: Props) {
  const bounds = useAppSelector((state) => state.ui.bounds);
  // const npcs = useAppSelector((state) => state.scene.npcs);

  // elements.push(...npcs.filter((id) => id >= 20000).map((id) => new NPC(id)));

  // console.log(npcs, elements);
  useEffect(() => {
    _game = new Phaser.Game({ ...config, parent: `element-container`, width: 1920, height: 1080 });
    _game.scene.start('elements', elements);

    return () => {
      _game.destroy(true);
    };
  }, []);

  useEffect(() => {
    _game.scene.stop('elements');
    _game.scene.start('elements', elements);
  }, [elements]);

  return (
    <div
      id={`element-container`}
      style={{ position: 'absolute', top: 0, left: 0, width: bounds[2], height: bounds[3], pointerEvents: 'auto' }}
    />
  );
}

class Scene extends Phaser.Scene {
  id: number;
  customScale: number;
  onClick: () => void;
  elements: UIElement[] = [];

  constructor() {
    super({ key: 'elements' });
  }

  init(elements: UIElement[]) {
    this.elements = elements;
  }

  preload() {
    // createLoader(this);

    // this.load.image('bg', 'imgs/scenes/backgrounds/smelting_mountains.png');

    // this.load.image(`quest-${QuestState.AVAILABLE}`, 'imgs/ui/UIResource/NpcStatus/UnAccept.png');
    // this.load.image(`quest-${QuestState.CANT_ACCEPT}`, 'imgs/ui/UIResource/NpcStatus/CantAccept.png');
    // this.load.image(`quest-${QuestState.IN_PROGRESS}`, 'imgs/ui/UIResource/NpcStatus/Accept.png');
    // this.load.image(`quest-${QuestState.INTERACT}`, 'imgs/ui/UIResource/NpcStatus/SubAccept.png');
    // this.load.image(`quest-${QuestState.TURN_IN}`, 'imgs/ui/UIResource/NpcStatus/GetPrize.png');

    this.elements.forEach((element) => element.load(this));
  }

  create() {
    // this.add.image(0, 0, 'bg').setOrigin(0);

    this.elements.forEach((element) => element.create(this));
  }

  destroy() {
    this.elements.forEach((element) => element.destroy(this));
  }
}

const config = {
  type: Phaser.WEBGL,
  scene: [Scene],
  transparent: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
  },
  dom: {
    createContainer: true,
  },
};
