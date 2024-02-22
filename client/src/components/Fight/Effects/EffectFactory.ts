import { Depths, Effects } from '../../../enums';
import { CombatPlayerScene } from '../../../features/Fight/Scenes/CombatPlayerScene';
import { FightEffect } from '../../interfaces/Interfaces';
import AnimatedQuad from '../Characters/AnimatedQuad';
import { effects } from './Effects';

const ignore = [Effects.MUD_WALL, Effects.SUBSTITUTE];

export default class EffectFactory {
  static add(scene: CombatPlayerScene, fightEffects: FightEffect[]) {
    fightEffects.forEach(({ role, id }) => {
      if (ignore.includes(id)) {
        return;
      }

      const target = scene.getCharacter(role);
      const effect = EffectFactory.create(scene, id);
      const { global } = effects[id] ?? { global: false };

      if (target === null) {
        return console.error('Target not found for role', role);
      }

      scene.events.emit('addEffect', { id, isTarget: !target.isOnOffense });

      if (global) {
        scene.addEffect(effect);
      } else {
        target.addEffect(effect, effect.depth);
      }
    });
  }

  static create(scene: CombatPlayerScene, effect: Effects) {
    if (effect in scene.cache.json.get('effect-offsets')) {
      const effectConfig = scene.cache.json.get('effect-offsets')[effect];
      const [offsetX, offsetY] = effectConfig.offset ?? [0, 0];
      const depth = effectConfig.isBehindActor ?? false ? Depths.BEHIND_CHARACTER : Depths.IN_FRONT_OF_CHARACTER;
      const sprite = new AnimatedQuad(scene, 0, 0, `effect-${effect}`).setDepth(depth).animate2(`effect-${effect}`, [offsetX, offsetY]);

      sprite.name = '' + effect;
      sprite.setData('config', effectConfig);

      return sprite;
    }

    if (!(effect in effects)) {
      const sprite = new AnimatedQuad(scene, 0, 0, `custom-blank`);
      sprite.name = '' + effect;

      return sprite;
    }

    const { name, offset, depth = Depths.IN_FRONT_OF_CHARACTER } = effects[effect];
    const sprite = new AnimatedQuad(scene, 0, 0, `effect-${name}`).setDepth(depth).animate2(`effect-${name}`, [offset.x, offset.y]);
    sprite.name = '' + effect;

    return sprite;
  }

  static getName(effect: Effects) {
    return effects[effect].name;
  }

  static remove(scene: CombatPlayerScene, fightEffects: FightEffect[]) {
    fightEffects.forEach(({ role, id }) => {
      if (ignore.includes(id)) {
        return;
      }

      const target = scene.getCharacter(role);
      const name = '' + id;
      let { global } = effects[id] ?? { name: '' + id, global: false };

      if (
        [
          Effects.DOOR_ONE,
          Effects.DOOR_TWO,
          Effects.DOOR_THREE,
          Effects.DOOR_FOUR,
          Effects.DOOR_FIVE,
          Effects.DOOR_SIX,
          Effects.DOOR_SEVEN,
          Effects.DOOR_EIGHT,
        ].includes(id)
      ) {
        target?.removeEffect('door_one');
      }

      if (target === null) {
        return console.error('Target not found for role', role);
      }

      scene.events.emit('removeEffect', { name, isTarget: !target.isOnOffense });

      if (global) {
        scene.removeEffect(name);
      } else {
        target.removeEffect(name);
      }
    });
  }
}
