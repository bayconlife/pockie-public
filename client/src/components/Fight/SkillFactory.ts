import { CharacterAnimation, Depths } from '../../enums';
import { CombatPlayerScene } from '../../features/Fight/Scenes/CombatPlayerScene';
import EventEmitter from '../../util/EventEmitter';
import { FightTurn, UserSkills } from '../interfaces/Interfaces';
import Character from './Characters/Character';
import EffectFactory from './Effects/EffectFactory';
import BlockMotion from './Motions/BlockMotion';
import HurtLiteMotion from './Motions/DamageHeavyMotion';
import DodgeMotion from './Motions/DodgeMotion';
import SecretTechniqueMotion from './Motions/SecretTechniqueMotion';
import { FightScene } from './Scenes';
import SkillFactoryV2 from './SkillFactoryV2';
import { CombatEvent, skills } from './Skills/Skills';

const defaultFightTurn = {
  role: 0,
  event: 0,
  time: 0,
};

export default class SkillFactory {
  static async create(
    scene: CombatPlayerScene,
    skill: UserSkills,
    source: Character,
    target: Character,
    turn: FightTurn = defaultFightTurn
  ) {
    if (skill === UserSkills.NONE) {
      return new Promise(async (resolve) => {
        resolve(null);
      });
    }

    if (skill === UserSkills.SECRET_TECHNIQUE && (source.secretTechnique === undefined || source.secretTechnique.damageFrame === -1)) {
      skill = UserSkills.BASIC_ATTACK;
    }

    return new Promise(async (resolve) => {
      let resolveLock = 1;

      const {
        targetLastDamage = 0,
        selfLastDamage = 0,
        reflectedDamage = 0,
        isHit = true,
        isCrit = false,
        incHp = 0,
        addEffect = [],
        removeEffect = [],
        decMp = 0,
        incMp = 0,
        decTargetMp = 0,
        statChange = [],
      } = turn;

      const {
        depth = Depths.IN_FRONT_OF_CHARACTER,
        jutsu = false,
        targetAnimation = null,
        move = false,
        global = false,
        next = null,
        onTarget = false,
        onPet = false,
      } = skills[skill];

      let { name, noSprite = false, damageMotion = HurtLiteMotion, offset, characterAnimation = null } = skills[skill];
      let events = skills[skill].events || {};

      if (turn.targetSkillId === UserSkills.MUD_WALL) {
        damageMotion = BlockMotion;
      } else if (turn.targetSkillId !== undefined) {
        damageMotion = null;
      }

      const resolveIfNotLocked = () => {
        resolveLock -= 1;

        if (resolveLock > 0) {
          return;
        }

        resolve(null);
      };

      async function functionWithLock(fn: (...args: any[]) => void) {
        resolveLock += 1;
        await fn();
        resolveIfNotLocked();
      }

      if (move) {
        await source.move();
        source.animate(CharacterAnimation.IDLE);
      }

      if (jutsu) {
        // source.animate(CharacterAnimation.JUTSU);
        SkillFactory.create(scene, UserSkills.JUTSU, source, target);
      }

      // if (reflectedDamage > 0) {
      //   (async () => {
      //     resolveLock += 1;
      //     await SkillFactory.create(scene, UserSkills.MUD_WALL, target, source);
      //     resolveIfNotLocked();
      //   })();
      // }

      // (async () => {
      //   resolveLock += 1;
      //   await SkillFactory.create(scene, turn.targetSkillId || UserSkills.NONE, target, source);
      //   resolveIfNotLocked();
      // })();

      if (skill === UserSkills.BASIC_ATTACK || skill === UserSkills.PRIORITY_ATTACK || skill === UserSkills.PET_ATTACK) {
        name = `skill-attack-${source.name}`;
        offset = { x: 0, y: 0 };
        events = {
          6: { event: CombatEvent.ATTACK },
        };
        noSprite = true;
      }

      if (skill === UserSkills.SECRET_TECHNIQUE) {
        source.hide();
        name = `${source.name}-secret_technique`;
        offset = { x: source.secretTechnique.offset[0], y: source.secretTechnique.offset[1] };
        events = {
          [source.secretTechnique.motionFrame]: {
            event: CombatEvent.MOTION,
            fn: async (scene: Phaser.Scene, source: Character, target: Character, turn, _functionWithLock?) => {
              _functionWithLock?.(async () => {
                target.secretTechniqueDamage();
                await new SecretTechniqueMotion(scene, target).create({ transforms: source.secretTechnique.transforms });
              });
            },
          },
          [source.secretTechnique.damageFrame]: { event: CombatEvent.ATTACK },
        };

        if (source.secretTechnique.characterAnimation) {
          source.show();
          characterAnimation = source.secretTechnique.characterAnimation;
        }

        if (source.secretTechnique.concurrent) {
          const x = source.isOnOffense ? 1000 : 0;
          const scaleX = source.isOnOffense ? -1 : 1;
          const s = scene.add
            .sprite(
              x + source.animations[source.secretTechnique.concurrent][0] * scaleX,
              source.animations[source.secretTechnique.concurrent][1],
              `${source.name}-${source.secretTechnique.concurrent}`
            )
            .setOrigin(0)
            .setDepth(Depths.BEHIND_CHARACTER)
            .setScale(scaleX, 1)
            .play(`${source.name}-${source.secretTechnique.concurrent}`)
            .on(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => s.destroy());
        }
      }

      let dx = onTarget ? target.x : source.x;
      let dy = onTarget ? target.y : source.y;
      let scale = Math.sign(source.container.scaleX);

      if (global) {
        dx = 0;
        dy = 0;
        scale = 1;
      }

      if (skill === UserSkills.PUPPET || skill === UserSkills.BOMB_KICK) {
        // TODO flip the images before texutre packing should also work and would be better
        scale *= -1;
      }

      const frameEventCheck = (index: number) => {
        if (index in events) {
          functionWithLock(async () => await events[index].fn?.(scene, source, target, turn, functionWithLock));

          if (events[index].event === CombatEvent.ATTACK) {
            if (decMp !== 0) {
              source.decreaseMp(decMp);
            }

            if (decTargetMp !== 0) {
              target.decreaseMp(decTargetMp);
            }

            EffectFactory.remove(scene, removeEffect);
            EffectFactory.add(scene, addEffect);

            functionWithLock(async () => {
              if (turn.targetSkillId !== undefined && scene.skillData.has(turn.targetSkillId)) {
                await SkillFactoryV2.create(scene, turn.targetSkillId, target, source);
              } else if (turn.targetSkillId !== undefined) {
                await SkillFactory.create(scene, turn.targetSkillId, target, source);
              }
            });

            source.damage(incHp * -1, isCrit, null);

            statChange.forEach((change) => EventEmitter.emit('combatStatUpdate', change));

            if (isHit) {
              functionWithLock(async () => {
                await source.damage(reflectedDamage + selfLastDamage, isCrit, null);
              });

              functionWithLock(async () => {
                await target.damage(targetLastDamage, isCrit, damageMotion);
              });
            } else {
              functionWithLock(async () => {
                new DodgeMotion(scene, target).create();
                await SkillFactoryV2.create(scene, 7000, target, source);
              });

              // target.animate(CharacterAnimation.DODGE);
            }
          }

          if (events[index].event === CombatEvent.MOTION) {
          }

          if (events[index].event === CombatEvent.ATTACK_MOTION) {
            if (isHit) {
              target.damage(targetLastDamage, isCrit, damageMotion);
            }
          }
        }
      };

      if (onPet) {
        await source.pet.animate(name, {
          10: async () => {
            source.damage(reflectedDamage + selfLastDamage, isCrit, null);
            await target.damage(targetLastDamage, isCrit, damageMotion);

            source.damage(incHp * -1, isCrit, null);
            source.decreaseMp(decMp);

            EffectFactory.remove(scene, removeEffect);
            EffectFactory.add(scene, addEffect);
            return resolve(null);
          },
        });
        source.pet.animate(CharacterAnimation.IDLE);
      } else {
        if (characterAnimation !== null) {
          functionWithLock(async () => {
            await source.animate(characterAnimation!);
            source.animate(CharacterAnimation.IDLE);
          });
        }

        if (targetAnimation !== null) {
          functionWithLock(async () => {
            await target.animate(targetAnimation);
            target.animate(CharacterAnimation.IDLE);
          });
        }

        const sprite = scene.add
          .sprite(dx + offset.x * scale, dy + offset.y, name)
          .setOrigin(0)
          .setDepth(depth);

        sprite.setVisible(!noSprite);
        sprite.play(name);
        sprite.scaleX *= scale;
        sprite.on(Phaser.Animations.Events.SPRITE_ANIMATION_UPDATE, (_: any, frame: Phaser.Animations.AnimationFrame) => {
          frameEventCheck(frame.index);
        });
        sprite.on(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, async () => {
          sprite.destroy();

          if (next !== null) {
            await SkillFactory.create(scene, next, source, target, turn);
          }

          if (skill === UserSkills.SECRET_TECHNIQUE) {
            source.show();
          }

          resolveIfNotLocked();
        });
      }

      frameEventCheck(1);
    });
  }

  static async counter(scene: Phaser.Scene, source: Character, target: Character, damage: number = 0) {
    return new Promise(async (resolve) => {
      await source.animate(CharacterAnimation.ATTACK, {
        6: async () => {
          await target.damage(damage, false, HurtLiteMotion);
          return resolve(null);
        },
      });

      // source.animate(CharacterAnimation.IDLE);
    });
  }
}
