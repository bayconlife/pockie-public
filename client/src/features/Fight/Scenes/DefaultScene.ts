import store from '../../../store';
import Events from '../../../util/EventEmitter';
import { loadCharacterData } from '../CombatLoader';
import { CombatPlayerScene } from './CombatPlayerScene';
import { PreloadScene } from './PreloadScene';

export default class DefaultScene extends Phaser.Scene {
  eventId = '';

  init() {
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      Events.off(this.eventId);
    });
  }

  create() {
    if (store.getState().fight.fight) {
      this.start(store.getState().fight.fight);
    }

    this.eventId = Events.on('setFightData', async (data) => {
      this.start(data);
    });

    this.events.addListener(Phaser.Scenes.Events.DESTROY, () => {
      Events.off(this.eventId);
    });
  }

  async start(data: any) {
    const timer = Date.now();
    const res = await loadCharacterData(this, data);

    this.safelyRemoveScene('combatPlayer');
    this.safelyRemoveScene('preload');
    this.scene.add('combatPlayer', CombatPlayerScene, false);
    this.scene.add('preload', PreloadScene, true, { ...res, startTime: timer });
  }

  safelyRemoveScene(key: string) {
    if (key in this.game.scene.keys) {
      this.scene.remove(key);
    }
  }
}
