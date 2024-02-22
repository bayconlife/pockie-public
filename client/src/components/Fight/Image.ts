import UIElement from './UIElement';

interface Config {
  key: string;
  file: string;
}

export default class Image extends UIElement {
  constructor(scene: Phaser.Scene, config: Config) {
    super(scene);

    this.key = config.key;
    this.file = config.file;
  }
}
