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
import SkillFactory from './SkillFactory';
import { CombatEvent } from './Skills/Skills';

const defaultFightTurn = {
  role: 0,
  event: 0,
  time: 0,
};

export default class SkillFactoryV2 {
  static async create(scene: CombatPlayerScene, skill: number, source: Character, target: Character, turn: FightTurn = defaultFightTurn) {
    if (skill === UserSkills.NONE) {
      return new Promise(async (resolve) => {
        resolve(null);
      });
    }

    if (!scene.skillData.has(skill)) {
      console.error(`Invalid skill for SkillFactoryV2`, skill);

      return new Promise(async (resolve) => {
        resolve(null);
      });
    }

    if (skill === UserSkills.SECRET_TECHNIQUE && (source.secretTechnique === undefined || source.secretTechnique.damageFrame === -1)) {
      skill = UserSkills.BASIC_ATTACK;
    }

    return new Promise(async (resolve) => {
      let resolveLock = 1;
      let name = '' + skill;

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
        noSprite = false,
        onPet = false,
        moved = false,
        noFlip = false,
        petAnimation = null,
      } = {
        depth: Depths.IN_FRONT_OF_CHARACTER,
        jutsu: false,
        targetAnimation: null,
        move: false,
        global: false,
        next: null,
        onTarget: false,
        noSprite: false,
        onPet: false,
        moved: false,
        noFlip: false,
        petAnimation: null,
        ...scene.skillData.get(skill),
      };

      let {
        damageMotion = HurtLiteMotion,
        offset = [0, 0],
        characterAnimation = null,
        events = {},
      } = {
        damageMotion: HurtLiteMotion,
        offset: [0, 0],
        characterAnimation: null,
        events: {},
        ...scene.skillData.get(skill),
      };
      // let events = skills[skill].events || {};

      if (turn.targetSkillId === UserSkills.MUD_WALL) {
        damageMotion = BlockMotion;
      } else if (turn.targetSkillId !== undefined) {
        damageMotion = null;
      }

      const resolveIfNotLocked = () => {
        resolveLock -= 1;

        if (resolveLock) {
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
      //   await SkillFactoryV2.create(scene, turn.targetSkillId || UserSkills.NONE, target, source);
      //   resolveIfNotLocked();
      // })();

      if (skill === UserSkills.BASIC_ATTACK || skill === UserSkills.PRIORITY_ATTACK || skill === UserSkills.PET_ATTACK) {
        name = `skill-attack-${skill === UserSkills.PET_ATTACK ? source.pet?.name : source.name}`;
        offset = { x: 0, y: 0 };
        events = {
          [skill === UserSkills.PET_ATTACK ? 11 : 6]: [CombatEvent.ATTACK],
        };
      }

      if (skill === UserSkills.SECRET_TECHNIQUE) {
        source.hide();
        name = `${source.name}-secret_technique`;
        offset = source.secretTechnique.offset;
        // events = {
        //   [source.secretTechnique.motionFrame]: {
        //     event: CombatEvent.MOTION,
        //     fn: async (scene: Phaser.Scene, source: Character, target: Character, turn, _functionWithLock?) => {
        //       _functionWithLock?.(async () => {
        //         await new SecretTechniqueMotion(scene, target).create({ transforms: source.secretTechnique.transforms });
        //       });
        //     },
        //   },
        //   [source.secretTechnique.damageFrame]: { event: CombatEvent.ATTACK },
        // };

        if (source.secretTechnique.characterAnimation) {
          source.show();
          characterAnimation = source.secretTechnique.characterAnimation;
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

      if (noFlip) {
        scale = 1;
      }

      if (skill === UserSkills.PUPPET || skill === UserSkills.BOMB_KICK) {
        // TODO flip the images before texutre packing should also work and would be better
        scale *= -1;
      }

      scene.motions.get(skill)?.apply(source);

      const frameEventCheck = (index: number) => {
        if (index in events) {
          if (events[index][0] === CombatEvent.ATTACK) {
            source.decreaseMp(decMp);
            target.decreaseMp(decTargetMp);

            source.damage(incHp * -1, isCrit, null);

            statChange.forEach((change) => EventEmitter.emit('combatStatUpdate', change));

            EffectFactory.remove(scene, removeEffect);
            EffectFactory.add(scene, addEffect);

            functionWithLock(async () => {
              if (turn.targetSkillId !== undefined && scene.skillData.has(turn.targetSkillId)) {
                await SkillFactoryV2.create(scene, turn.targetSkillId, target, source);
              } else if (turn.targetSkillId !== undefined) {
                await SkillFactory.create(scene, turn.targetSkillId, target, source);
              }
            });

            if (isHit) {
              functionWithLock(async () => {
                source.damage(reflectedDamage + selfLastDamage, isCrit, null);
              });

              functionWithLock(async () => {
                await target.damage(targetLastDamage, isCrit, damageMotion);
              });
            } else {
              functionWithLock(async () => {
                new DodgeMotion(scene, target).create();
                await SkillFactoryV2.create(scene, 7000, target, source);
              });
            }
          }

          if (events[index][0] === 'Animation') {
            source.animate(events[index][1]);
          }

          if (events[index][0] === 'Skill') {
            const additionalSkill = events[index][1];

            functionWithLock(async () => {
              await SkillFactoryV2.create(scene, additionalSkill, source, target);
            });
          }

          if (events[index][0] === 'Motion') {
            functionWithLock(async () => {
              await scene.motions.get(events[index][1])?.apply(source);
            });
          }

          if (events[index][0] === 'PetMotion') {
            source.pet.setTempOffset(events[index][1], events[index][2]);
          }

          if (events[index].event === CombatEvent.ATTACK_MOTION) {
            if (isHit) {
              target.damage(targetLastDamage, damageMotion);
            }
          }
        }
      };

      frameEventCheck(0);

      if (onPet) {
        const petEvents: any = {};
        Object.keys(events).forEach(
          (key) =>
            (petEvents[key] = async () => {
              frameEventCheck(Number(key));
            })
        );
        await source.pet.animate(petAnimation ?? name, {
          ...petEvents,
        });
        source.pet.animate(CharacterAnimation.IDLE);

        return resolveIfNotLocked();
      } else {
        if (characterAnimation !== null) {
          functionWithLock(async () => {
            await source.animate(characterAnimation!);
            source.animate(CharacterAnimation.IDLE);
          });
        }

        if (petAnimation !== null) {
          functionWithLock(async () => {
            await source.pet?.animate(petAnimation);
            source.pet?.animate(CharacterAnimation.IDLE);
          });
        }

        if (targetAnimation !== null) {
          functionWithLock(async () => {
            await target.animate(targetAnimation);
            target.animate(CharacterAnimation.IDLE);
          });
        }

        if (noSprite) {
          return resolveIfNotLocked();
        }

        const sprite = scene.add
          .sprite(dx + offset[0] * scale, dy + offset[1], name)
          .setOrigin(0)
          .setDepth(depth);

        sprite.play(name);
        sprite.scaleX *= scale;
        sprite.on(`animationupdate-${name}`, (_: any, frame: Phaser.Animations.AnimationFrame) => {
          frameEventCheck(frame.index);
        });
        sprite.on(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, async () => {
          sprite.destroy();

          if (next !== null) {
            await SkillFactoryV2.create(scene, next, source, target, turn);
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

      source.animate(CharacterAnimation.IDLE);
    });
  }
}
