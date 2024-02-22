import Phaser from 'phaser';
import { Socket } from 'socket.io-client';
import { createLoader } from '../../components/phaser/Loader';
import { Scene } from '../../enums';
import store from '../../store';
import EventEmitter from '../../util/EventEmitter';
import { SERVER_CONFIG } from '../../util/serverConfig';
import { toServer } from '../../util/ServerSocket';

const zoneData: any = {
  3: { x: 30, y: 303, map: Scene.SMELTING_MOUNTAIN },
  8: { x: 64, y: 350, map: Scene.FIRE_VILLAGE },
  13: { x: 99, y: 328, map: Scene.FIERY_RIDGE },
  18: { x: 51, y: 254, map: Scene.EVENTIDE_BARREN },
  23: { x: 639, y: 297, map: 211 },
  28: { x: 601, y: 288, map: 2201 },
  33: { x: 545, y: 245, map: 2202 },
  38: { x: 616, y: 245, map: 2203 },
  43: { x: 222, y: 268, map: 2402 },
  48: { x: 331, y: 304, map: 2403 },
  53: { x: 230, y: 311, map: 2401 },
  58: { x: 344, y: 351, map: 411 },
  63: { x: 481, y: 132, map: 2503 },
  68: { x: 590, y: 134, map: 511 },
  73: { x: 480, y: 165, map: 2502 },
  78: { x: 602, y: 198, map: 2501 },
  83: { x: 25, y: 171, map: 311 },
  88: { x: 44, y: 218, map: 2301 },
  93: { x: 95, y: 213, map: 2302 },
  98: { x: 86, y: 162, map: 2303 },
  103: { x: 350, y: 46, map: Scene.Demon_City },
  108: { x: 304, y: 102, map: Scene.Eerie_Passage },
  113: { x: 304, y: 122, map: Scene.ANGEL_CITY },
  118: { x: 197, y: 175, map: Scene.CROSSROADS },
  123: { x: 386, y: 167, map: Scene.Glowing_Forest },
  128: { x: 386, y: 111, map: Scene.Dawning_Wilds },
  133: { x: 409, y: 133, map: Scene.Surprise_Village },
  138: { x: 147, y: 93, map: Scene.Abandoned_Evernight_City },
  143: { x: 76, y: 88, map: Scene.Soulshatter_Valley },
  148: { x: 113, y: 61, map: Scene.Marsh_Of_Death },
  153: { x: 197, y: 53, map: Scene.Plains_Of_Despair },
  158: { x: 388, y: 281, map: Scene.Dragontame_Valley },
  163: { x: 462, y: 276, map: Scene.Dragontame_Forest },
  168: { x: 448, y: 311, map: Scene.Amegakure },
  173: { x: 477, y: 280, map: Scene.Dragontame_Coast },
};

export class WorldMapScene extends Phaser.Scene {
  protected map: Map;

  constructor() {
    super({ key: 'world-map' });
  }

  init(config: any) {
    this.map = new Map(this, config.socket, config.onClose);

    this.add.text(-100, -100, '', { fontFamily: 'KOMIKAK' });
  }

  preload() {
    createLoader(this);

    this.load.setBaseURL(process.env.REACT_APP_CDN_PATH);
    if (process.env.NODE_ENV === 'development') {
      this.load.crossOrigin = 'anonymous';
    }
    this.map.load();
  }

  create() {
    this.map.create();
  }
}

export default class Map {
  private scene: Phaser.Scene;
  private onClose: () => void;

  constructor(scene: Phaser.Scene, socket: Socket, onClose: () => void) {
    this.scene = scene;
    this.onClose = onClose;
  }

  load() {
    this.scene.load.setPath('ui/SmallMap/map');

    this.scene.load.image('ui-map-world-idle', 'worldmap_idle.png');
    this.scene.load.image('ui-map-world-hover', 'worldmap_hover.png');
    this.scene.load.image('ui-map-world-active', 'worldmap_active.png');
    this.scene.load.image('ui-map-leave-idle', 'leave_idle.png');
    this.scene.load.image('ui-map-leave-hover', 'leave_hover.png');
    this.scene.load.image('ui-map-leave-active', 'leave_active.png');

    this.scene.load.image('ui-map', 'map.jpg');
    this.scene.load.multiatlas('ui-map-locations', 'locations.json');

    this.scene.load.image('ui-map-close-inactive', 'closeInactive.png');
    this.scene.load.image('ui-map-close-hover', 'closeHover.png');
    this.scene.load.image('ui-map-close-pressed', 'closePressed.png');

    // this.scene.load.image('ui-map-name', 'name.png');
    this.scene.load.image('ui-map-name-bg', 'nameBg.png');

    this.scene.load.setPath('');
  }

  create(): this {
    const level = store.getState().stats.stats.level;
    const scenes = SERVER_CONFIG.SCENES;
    const village = store.getState().ui.homeVillage;
    const map = this.scene.add.image(0, 0, 'ui-map').setOrigin(0);
    // this.scene.add.zone(0, 0, map.width, map.height).setInteractive();

    const tlx = map.getTopLeft().x ?? 0;
    const tly = map.getTopLeft().y ?? 0;

    const villageId = Math.floor(village / 100);

    Object.keys(zoneData).forEach((key) => {
      const data = zoneData[key];
      const dx = tlx + data.x;
      const dy = tly + data.y;
      const mapIcon = this.scene.add.image(dx, dy, 'ui-map-locations', key).setOrigin(0).setInteractive({ pixelPerfect: true });
      let isUnlocked = data.map in scenes && level >= scenes[data.map].level;

      const canAccessAllVillages = level >= 16;
      const mapIdReducedToVillage = Math.floor((data.map % 2000) / 100);
      // This logic will prevent players from accessing villages and paths before reaching crossroads
      if (data.map >= 2100 && data.map < 2600 && !canAccessAllVillages && mapIdReducedToVillage !== villageId) {
        isUnlocked = false;
      }

      if (!canAccessAllVillages && [111, 211, 311, 411, 511].includes(data.map) && data.map !== village) {
        isUnlocked = false;
      }

      mapIcon
        .on(Phaser.Input.Events.POINTER_OVER, () => {
          if (data.map === undefined) {
            return;
          }

          if (isUnlocked) {
            mapIcon.setTint(0xcc6666);
            this.scene.input.setDefaultCursor('pointer');
          } else {
            mapIcon.setTint(0x999999);
          }

          // clearTimeout(timeout);
          // timeout = setTimeout(
          // () =>
          EventEmitter.emit('mapTooltip', { key: data.map, x: mapIcon.getCenter().x, y: mapIcon.getTopCenter().y });
          //   100
          // );
        })
        .on('pointerout', () => {
          if (isUnlocked) {
            mapIcon.clearTint();
            this.scene.input.setDefaultCursor('default');
          } else {
            mapIcon.setTint(0x666666);
          }

          EventEmitter.emit('mapTooltipExit');
          // clearTimeout(timeout);
          // timeout = setTimeout(() => EventEmitter.emit('mapTooltipExit'), 100);
        })
        .on('pointerdown', () => {
          if (!isUnlocked) {
            return;
          }

          mapIcon.setTint(0xaaaaaa);
        })
        .on('pointerup', () => {
          if (!isUnlocked) {
            return;
          }

          toServer('switchScene', data.map);
        });

      if (!isUnlocked) {
        mapIcon.setTint(0x666666);
      }
    });

    const close = this.scene.add
      .image(tlx + 732 + 7, tly + 4 + 3, 'ui-map-close-inactive')
      .setOrigin(0)
      .setInteractive({ pixelPerfect: true });

    close
      .on('pointerover', () => {
        close.setTexture('ui-map-close-hover');
        this.scene.input.setDefaultCursor('pointer');
      })
      .on('pointerout', () => {
        close.setTexture('ui-map-close-inactive');
        this.scene.input.setDefaultCursor('default');
      })
      .on('pointerdown', () => {
        close.setTexture('ui-map-close-pressed');
      })
      .on('pointerup', () => {
        close.setVisible(false);
        this.onClose();
      });

    this.scene.add.image(28, 18, 'ui-map-name-bg').setOrigin(0).setTint(0x471800);
    this.scene.add.image(28, 18, 'ui-map-name-bg').setOrigin(0);

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        this.scene.add.text(41 + x, 21 + y, 'Sakura of Mainland', { fontFamily: 'KOMIKAK', fontSize: 12, color: 'black' });
      }
    }

    this.scene.add.text(41, 21, 'Sakura of Mainland', { fontFamily: 'KOMIKAK', fontSize: 12, color: 'gold' });

    return this;
  }
}
