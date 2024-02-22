import positions from '../config';
import UIElement from '../../../components/Fight/UIElement';
import { Depths, Effects } from '../../../enums';
import { effects } from '../../../components/Fight/Effects/Effects';
import Character from '../../../components/Fight/Characters/Character';
import { Tooltip } from '../../../components/Fight/Tooltip';
import EventEmitter from '../../../util/EventEmitter';
import { PreloadScene } from '../../Fight/Scenes/PreloadScene';

interface ElementPositions {
  obj: UIElement;
  x: number;
  y: number;
  flip: boolean;
}

interface Health {
  current: number;
  max: number;
  previous: number;
}

interface Stats {
  source: {
    health: Health;
    mp: Health;
  };
  target: {
    health: Health;
    mp: Health;
  };
}

export class TopUI {
  private scene: Phaser.Scene;
  private elements: { [key: string]: ElementPositions };
  private elementMap: { [key: string]: Phaser.GameObjects.GameObject } = {};
  private stats: Stats;
  private effectList: { player: Phaser.GameObjects.Image[]; enemy: Phaser.GameObjects.Image[] } = {
    player: [],
    enemy: [],
  };
  private tooltip: Tooltip;
  private sourceIcons: Phaser.GameObjects.Image[] = [];
  private targetIcons: Phaser.GameObjects.Image[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.elements = {};
    this.stats = {
      source: {
        health: { max: 0, current: 0, previous: 0 },
        mp: { max: 0, current: 0, previous: 0 },
      },
      target: {
        health: { max: 0, current: 0, previous: 0 },
        mp: { max: 0, current: 0, previous: 0 },
      },
    };
    this.effectList = {
      player: [],
      enemy: [],
    };

    this.scene.events.on('damage', ({ amount, isTarget }: { amount: number; isTarget: boolean }) => {
      isTarget ? this.targetReduceHp(amount) : this.playerReduceHp(amount);
    });

    this.scene.events.on('addEffect', ({ id, isTarget }: { id: Effects; isTarget: boolean }) => {
      this.addEffectIcon(isTarget, id);
    });

    this.scene.events.on('removeEffect', ({ name, isTarget }: { name: string; isTarget: boolean }) => {
      this.removeEffectIcon(name, isTarget);
    });

    this.scene.events.on('decreaseMp', ({ amount, isTarget }: { amount: number; isTarget: boolean }) => {
      isTarget ? this.modifyMPTarget(amount) : this.modifyMPSource(amount);
    });

    Object.keys(positions).forEach((key) => {
      const element = positions[key];
      const config = {
        key: key,
        ...element.config,
      };

      this.elements[key] = {
        obj: new element.class(scene, config),
        x: element.x,
        y: element.y,
        flip: 'flip' in element ? element.flip || false : false,
      };
    });
  }

  static load(scene: PreloadScene) {
    scene.load.setPath(`ui/combat/`);
    scene.loadMultiatlas('combat-ui', 'combat.json');
    scene.loadMultiatlas('combat-ui-2', 'combat.json');
    scene.load.setPath('');
  }

  create(sources: Character[], targets: Character[]) {
    const source = sources[0];
    const target = targets[0];

    this.stats.source.health = { current: source.hp, max: source.maxHp, previous: source.hp };
    this.stats.target.health = { current: target.hp, max: target.maxHp, previous: target.hp };

    this.stats.source.mp = { current: source.fightRole.mp, max: source.fightRole.maxMp, previous: source.fightRole.mp };
    this.stats.target.mp = { current: target.fightRole.mp, max: target.fightRole.maxMp, previous: target.fightRole.mp };

    Object.keys(this.elements).forEach((key) => {
      const element = this.elements[key];
      this.elementMap[key] = this.scene.add.existing(element.obj.create(element.x, element.y, element.flip));
    });

    this.tooltip = new Tooltip(this.scene);

    sources.forEach((character, idx) => {
      const base = character.name.startsWith('people/') ? 'people-icons' : 'monster-icons';
      const icon = this.scene.add
        .image(45 + idx * 50 + (idx > 0 ? 5 : 0), 60 + (idx > 0 ? 10 : 0), base, character.fightRole.avatar)
        .setDepth(Depths.COMBAT_UI + 1);

      if (idx > 0) {
        icon.setScale(-0.5, 0.5);
      } else {
        icon.setScale(-0.75, 0.75);
      }

      this.sourceIcons.push(icon);
    });

    for (let i = 3; i > sources.length; i--) {
      this.elementMap[`ally_${i - 1}`].destroy();
    }

    targets.forEach((character, idx) => {
      const base = character.name.startsWith('people/') ? 'people-icons' : 'monster-icons';
      const icon = this.scene.add
        .image(955 - idx * 50 + (idx > 0 ? -5 : 0), 60 + (idx > 0 ? 10 : 0), base, character.fightRole.avatar)
        .setDepth(Depths.COMBAT_UI + 1);

      if (idx > 0) {
        icon.setScale(0.5);
      } else {
        icon.setScale(0.75);
      }

      this.targetIcons.push(icon);
    });

    for (let i = 3; i > targets.length; i--) {
      this.elementMap[`target_${i - 1}`].destroy();
    }

    this.playerReduceHp(0);
    this.targetReduceHp(0);

    this.modifyMPSource(0);
    this.modifyMPTarget(0);
  }

  playerReduceHp(amount: number) {
    this.stats.source.health.previous = this.stats.source.health.current;
    this.stats.source.health.current = Math.min(Math.max(this.stats.source.health.current - amount, 0), this.stats.source.health.max);

    const percent = Math.min(Math.max(this.stats.source.health.current / this.stats.source.health.max, 0), 1);

    // @ts-ignore
    this.elements['playerHealth'].obj.update(percent);
  }

  targetReduceHp(amount: number) {
    this.stats.target.health.previous = this.stats.target.health.current;
    this.stats.target.health.current = Math.min(Math.max(this.stats.target.health.current - amount, 0), this.stats.target.health.max);

    const percent = Math.min(Math.max(this.stats.target.health.current / this.stats.target.health.max, 0), 1);

    // @ts-ignore
    this.elements['targetHealth'].obj.update(percent);
  }

  addEffectIcon(isTarget: boolean, id: Effects) {
    const list = isTarget ? this.effectList.enemy : this.effectList.player;
    const bars = this.elements['buffBars'].obj.image;
    const mod = isTarget ? 1 : -1;
    const name = '' + id;

    const icon = this.scene.add
      .image(bars.getCenter().x + (80 + 25 * list.length) * mod, bars.getCenter().y, 'icons-effects', name)
      .setName(name)
      .setDepth(Depths.COMBAT_UI)
      .setInteractive();

    icon.on(Phaser.Input.Events.POINTER_OVER, () => {
      EventEmitter.emit('effect-icon-enter', { id, x: icon.x, y: icon.y });
    });

    icon.on(Phaser.Input.Events.POINTER_OUT, () => {
      EventEmitter.emit('effect-icon-leave', { id });
    });

    list.push(icon);
  }

  modifyMPSource(amount: number) {
    this.stats.source.mp.previous = this.stats.source.mp.current;
    this.stats.source.mp.current = Math.min(Math.max(this.stats.source.mp.current - amount, 0), this.stats.source.mp.max);

    const percent = Math.min(Math.max(this.stats.source.mp.current / this.stats.source.mp.max, 0), 1);

    // @ts-ignore
    this.elements['playerMana'].obj.update(percent);
  }

  modifyMPTarget(amount: number) {
    this.stats.target.mp.previous = this.stats.target.mp.current;
    this.stats.target.mp.current = Math.min(Math.max(this.stats.target.mp.current - amount, 0), this.stats.target.mp.max);

    const percent = Math.min(Math.max(this.stats.target.mp.current / this.stats.target.mp.max, 0), 1);

    // @ts-ignore
    this.elements['targetMana'].obj.update(percent);
  }

  removeEffectIcon(name: string, isTarget: boolean) {
    const list = isTarget ? this.effectList.enemy : this.effectList.player;
    const bars = this.elements['buffBars'].obj.image;
    const mod = isTarget ? 1 : -1;
    const idx = list.findIndex((icon) => icon.name === name);

    if (idx === -1) {
      return;
    }

    list[idx].destroy();
    list.splice(idx, 1);

    list.forEach((icon, idx) => {
      icon.setPosition(bars.getCenter().x + (80 + 25 * idx) * mod, bars.getCenter().y);
    });

    EventEmitter.emit('effect-icon-leave', { id: name });
  }

  shiftSourceIcons() {
    this.sourceIcons[0].setTint(0xcccccc);

    const icon = this.sourceIcons.shift();

    if (icon !== undefined) {
      this.sourceIcons.push(icon);
    }

    this.sourceIcons.forEach((icon, idx) => {
      icon.setPosition(45 + idx * 50 + (idx > 0 ? 5 : 0), 60 + (idx > 0 ? 10 : 0));

      if (idx > 0) {
        icon.setScale(0.5);
      } else {
        icon.setScale(0.75);
      }
    });
  }

  shiftTargetIcons() {
    this.targetIcons[0].setTint(0x333333);

    const icon = this.targetIcons.shift();

    if (icon !== undefined) {
      this.targetIcons.push(icon);
    }

    this.targetIcons.forEach((icon, idx) => {
      icon.setPosition(955 - idx * 50 + (idx > 0 ? -5 : 0), 60 + (idx > 0 ? 10 : 0));

      if (idx > 0) {
        icon.setScale(0.5);
      } else {
        icon.setScale(0.75);
      }
    });
  }

  newSource(source: Character) {
    this.stats.source.health = { current: source.hp, max: source.maxHp, previous: source.hp };
    this.stats.source.mp = { current: source.fightRole.mp, max: source.fightRole.maxMp, previous: source.fightRole.mp };

    for (let i = this.effectList.player.length - 1; i >= 0; i--) {
      this.removeEffectIcon(this.effectList.player[i].name, false);
    }

    this.playerReduceHp(0);
    this.modifyMPSource(0);
    this.shiftSourceIcons();
  }

  newTarget(target: Character) {
    this.stats.target.health = { current: target.hp, max: target.maxHp, previous: target.hp };
    this.stats.target.mp = { current: target.fightRole.mp, max: target.fightRole.maxMp, previous: target.fightRole.mp };

    for (let i = this.effectList.enemy.length - 1; i >= 0; i--) {
      this.removeEffectIcon(this.effectList.enemy[i].name, true);
    }

    this.targetReduceHp(0);
    this.modifyMPTarget(0);
    this.shiftTargetIcons();
  }
}
