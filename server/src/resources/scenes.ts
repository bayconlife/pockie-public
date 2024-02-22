import { IConfig } from 'config';

interface IScene {
  [name: string]: number;
}

interface IScenes {
  [id: number]: {
    level: number;
    monsters: number[];
    npcs: number[];
    boss?: string;
  };
}

export let Scene: IScene = {};
export let SCENES: IScenes = {};

export default function sceneLoader(config: IConfig) {
  Scene = config.get('Scenes.Scene');
  SCENES = config.get('Scenes.Scenes');
}
