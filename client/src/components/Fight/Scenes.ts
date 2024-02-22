import { TopUI } from '../../features/Combat/Components/TopUI';
import { CharacterAnimation, Depths, Effects, SiteState } from '../../enums';
import { endFight, setFight, setRewards } from '../../slices/fightSlice';
import store from '../../store';
import { FightEvents, FightTurn, UserSkills } from '../interfaces/Interfaces';
import CharacterFactoryV2, { FightRole } from './CharacterFactoryV2';
import Character from './Characters/Character';
import { Effect } from './Effects/Effect';
import EffectFactory from './Effects/EffectFactory';
import { effects } from './Effects/Effects';
import DizzyMotion from './Motions/DizzyMotion';
import DodgeMotion from './Motions/DodgeMotion';
import SkillFactory from './SkillFactory';
import { skills } from './Skills/Skills';
import { createLoader } from '../phaser/Loader';
import HurtLiteMotion from './Motions/DamageHeavyMotion';
import SkillFactoryV2 from './SkillFactoryV2';
import { Motion } from './Motions/Motion';
import { FontNumbers } from './Numbers/FontNumbers';
import { DamageNumbers } from './Numbers/DamageNumbers';
import EventEmitter from '../../util/EventEmitter';

interface FightData {
  fight: FightTurn[];
  roles: FightRole[];
}

let timer = 0;

export class CharacterDataLoader extends Phaser.Scene {
  d: FightData;
  loadedSkills = new Set<number>();
  loadedMotions = new Set<number>();

  constructor() {
    super({ key: 'characterDataLoader' });
  }

  init(data: FightData) {
    this.d = data;
    this.data.set('roles', data.roles);
  }

  preload() {
    if (process.env.NODE_ENV === 'development') {
      this.load.crossOrigin = 'anonymous';
    }

    timer = window.performance.now();

    const loadingText = this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY, 'Fetching actor data...', { fontFamily: 'Arial' })
      .setOrigin(0.5, 1);

    let lastKey = '';

    this.load.addListener(Phaser.Loader.Events.ADD, (key: string) => (lastKey = key));
    this.load.addListener(Phaser.Loader.Events.ADD, (key: string) => (lastKey = key));

    const asyncLoader = (loaderPlugin: Phaser.Loader.LoaderPlugin) =>
      new Promise((resolve, reject) => {
        if (lastKey === '' || this.cache.json.exists(lastKey)) {
          return resolve(null);
        }

        loaderPlugin.on('filecomplete', resolve).on('loaderror', (e: any) => {
          console.error('FAILED', e);
          reject();
        });
        loaderPlugin.start();
      });

    const loadIfAvailable = (key: string, path: string) =>
      new Promise<boolean>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open('HEAD', path, false);
        xhr.send(null);

        if (xhr.status !== 200) {
          return resolve(false);
        }

        asyncLoader(this.load.json(key, path))
          .then(() => resolve(true))
          .catch(() => resolve(false));
      });

    const loadMotion = async (id: number) => {
      loadingText.setText(`Loading motion data ${id}.`);
      const loaded = await loadIfAvailable(`skill-motion-${id}`, `${process.env.REACT_APP_CDN_PATH}skills/motion/${id}.json`);

      if (loaded) {
        this.loadedMotions.add(id);
      }

      return loaded;
    };

    const loadSkill = async (skillId: number) => {
      loadingText.setText(`Loading skill data ${skillId}.`);
      const loaded = await loadIfAvailable(`skill-data-${skillId}`, `${process.env.REACT_APP_CDN_PATH}skills/data/${skillId}.json`);

      if (loaded) {
        this.loadedSkills.add(skillId);

        const skillJSON = this.cache.json.get(`skill-data-${skillId}`);

        for (let i = 0; i < skillJSON.linked?.length ?? 0; i++) {
          await loadSkill(skillJSON.linked[i]);
        }

        for (let i = 0; i < skillJSON.motions?.length ?? 0; i++) {
          await loadMotion(skillJSON.motions[i]);
        }
      }

      return loaded;
    };

    (async (scene) => {
      loadingText.setText('Loading default avatar.');

      await asyncLoader(this.load.json(`avatar-data-1`, `${process.env.REACT_APP_CDN_PATH}actors/data/1.json`));

      for (let i = 0; i < this.d.roles.length; i++) {
        const role = this.d.roles[i];

        loadingText.setText(`Loading avatar ${role.avatar}.`);
        await loadIfAvailable(`avatar-data-${role.avatar}`, `${process.env.REACT_APP_CDN_PATH}actors/data/${role.avatar}.json`);

        if (role.pet) {
          loadingText.setText(`Loading pet`);
          await loadIfAvailable(`pet-data-${role.pet}`, `${process.env.REACT_APP_CDN_PATH}actors/data/pets/${role.pet}.json`);
        }
      }

      loadingText.setText(`Finished loading avatars.`);

      for (let i = 0; i < this.d.fight.length; i++) {
        const turn = this.d.fight[i];

        if (turn.isHit !== undefined && turn.isHit === false && !this.loadedSkills.has(7000)) {
          await loadSkill(7000);
        }

        if (turn.targetSkillId !== undefined) {
          if (!(turn.targetSkillId in skills) || !this.loadedSkills.has(turn.targetSkillId)) {
            await loadSkill(turn.targetSkillId);
          }
        }

        if (turn.skillId === undefined || turn.skillId === 1 || this.loadedSkills.has(turn.skillId) || turn.skillId in skills) {
          continue;
        }

        await loadSkill(turn.skillId);
      }

      loadingText.setText(`Finished loading skills.`);

      // Preload font
      this.add
        .text(-100, -100, 'load', {
          fontFamily: store.getState().settings.font,
          fontSize: 10,
        })
        .setVisible(false);
      const avatarData: { [key: string]: any } = {
        default: this.cache.json.get('avatar-data-1'),
      };
      const petData = new Map<number, any>();

      this.d.roles.forEach((role) => {
        avatarData[role.avatar] = this.cache.json.get(`avatar-data-${role.avatar}`);

        if (role.pet) {
          petData.set(role.pet, this.cache.json.get(`pet-data-${role.pet}`));
        }
      });

      const skillData = new Map<number, any>();
      const motionData = new Map<number, any>();

      this.loadedSkills.forEach((id) => skillData.set(id, this.cache.json.get(`skill-data-${id}`)));
      this.loadedMotions.forEach((id) => motionData.set(id, this.cache.json.get(`skill-motion-${id}`)));

      await loadIfAvailable('effect-offsets', `${process.env.REACT_APP_CDN_PATH}actors/data/effects/offsets.json`);

      scene.scene.start('fight', { ...this.d, avatarData, petData, skillData, motionData });
    })(this);
  }
}

export class FightScene extends Phaser.Scene {
  protected d: any = {};
  protected turns: FightTurn[] = [];
  protected roles: Character[] = [];
  protected offenseCurrent = 0;
  protected offenseUnits: Character[] = [];
  protected defenseCurrent = 0;
  protected defenseUnits: Character[] = [];
  protected topUI: TopUI;
  protected effects: Effect[] = [];
  protected timeDisplay: Phaser.GameObjects.Text;
  protected reason: number;
  protected rewards: any;
  protected onFinish: () => void;
  protected fightScene = 1;

  public motionData: Map<number, any>;
  public skillData: Map<number, any>;
  public petData: Map<number, any>;
  public motions = new Map<number, Motion>();
  public font = '';
  public originalNumbers = false;

  constructor(key = 'fight') {
    super({ key });
  }

  init(data: any) {
    const settings = store.getState().settings;
    this.offenseUnits = [];
    this.defenseUnits = [];
    this.offenseCurrent = 0;
    this.defenseCurrent = 0;
    this.readyCount = 0;
    this.started = false;
    this.font = settings.font;
    this.originalNumbers = settings.originalDamage;

    // console.log('Fight', data);
    this.fightScene = data.scene ?? 1;
    this.turns = data.fight;
    this.reason = data.reason;
    this.rewards = data.rewards;
    this.onFinish = data.onFinish;

    this.motionData = data.motionData;
    this.skillData = data.skillData;
    this.petData = data.petData;

    const animations = new Map<number, Set<string>>();
    const petAnimations = new Map<number, Set<string>>();

    data.roles.forEach((role: FightRole) => {
      const animationSet = new Set([
        CharacterAnimation.DEAD,
        CharacterAnimation.MOVE,
        CharacterAnimation.HURT_LITE,
        CharacterAnimation.IDLE,
        CharacterAnimation.REVIVE,
        CharacterAnimation.TAUNT,
        CharacterAnimation.WIN,
        CharacterAnimation.ZONE_ENTRANCE,
      ]);

      animations.set(role.index, animationSet);

      // const character = CharacterFactory.create(this, role, data.avatarData[role.avatar] || data.avatarData.default);

      // if (role.isOnOffense) {
      //   this.offenseUnits.push(character);
      // } else {
      //   this.defenseUnits.push(character);
      // }

      // this.roles.push(character);
    });

    const checkSkill = (skill: any, role: number, targetRole: number) => {
      if (skill === undefined) {
        return;
      }

      if (skill.characterAnimation !== undefined) {
        animations.get(role)?.add(skill.characterAnimation);
      }

      if (skill.targetAnimation !== undefined) {
        animations.get(targetRole)?.add(skill.targetAnimation);
      }

      if (skill.jutsu) {
        animations.get(role)?.add(CharacterAnimation.JUTSU);
      }

      skill.linked?.forEach((linkedSkill: number) => {
        if (this.skillData.has(linkedSkill)) {
          checkSkill(this.skillData.get(linkedSkill), role, targetRole);
        }

        if (linkedSkill in skills) {
          checkSkill(skills[linkedSkill], role, targetRole);
        }
      });
    };

    data.fight.forEach((turn: FightTurn) => {
      if (turn.event === FightEvents.BACK_THROWED) {
        animations.get(turn.role)?.add(CharacterAnimation.BOMB_KNOCKBACK);
        animations.get(turn.role ?? -1)?.add(CharacterAnimation.REVIVE);
        animations.get(turn.targetRole ?? -1)?.add(CharacterAnimation.BOMB_KICK);
      }

      // if (turn.event === FightEvents.BE_DIE) {
      //   animations.get(turn.role)?.add(CharacterAnimation.DEAD);
      // }

      // if (turn.event === FightEvents.VICTORY) {
      //   animations.get(turn.role)?.add(CharacterAnimation.WIN);
      // }

      if (turn.isHit !== undefined && !turn.isHit) {
        animations.get(turn.targetRole ?? -1)?.add(CharacterAnimation.DODGE);
      }

      if (turn.skillId === undefined) {
        return;
      }

      checkSkill(this.skillData.get(turn.skillId), turn.role, turn.targetRole ?? -1);
      checkSkill(skills[turn.skillId], turn.role, turn.targetRole ?? -1);

      if (turn.targetSkillId !== undefined) {
        checkSkill(this.skillData.get(turn.targetSkillId), turn.targetRole ?? -1, turn.role);
        checkSkill(skills[turn.targetSkillId], turn.targetRole ?? -1, turn.role);
      }
    });

    this.roles.forEach((character) => {
      if (character.secretTechnique.characterAnimation !== undefined) {
        animations.get(character.fightRole.index)?.add(character.secretTechnique.characterAnimation);
      }

      // if (animations.get(character.fightRole.index)?.has(CharacterAnimation.REVIVE)) {
      //   animations.get(character.fightRole.index)?.add(CharacterAnimation.DEAD);
      // }

      character.usedAnimations = animations.get(character.fightRole.index)!;
    });

    // this.events.off('damage');
    // this.events.on('damage', (args: any) => {
    //   this.showDamage(args);
    // });

    this.topUI = new TopUI(this);
  }

  skillList = new Set(['jutsu', 'mud_wall', 'substitution_technique']);
  effectList = new Set<string>();

  loaded = new Set<string>();

  loadImage(key: string, path: string, ...args: any[]) {
    if (!this.loaded.has(key)) {
      this.load.image(key, path, ...args);
      this.loaded.add(key);
    }
  }

  loadMultiatlas(key: string, jsonKey: string, ...args: any[]) {
    if (!this.loaded.has(key)) {
      this.load.multiatlas(key, jsonKey, ...args);
      this.loaded.add(key);
    }
  }

  loadSpritesheet(key: string, path: string, ...args: any[]) {
    if (!this.loaded.has(key)) {
      this.load.spritesheet(key, path, ...args);
      this.loaded.add(key);
    }
  }

  preload() {
    createLoader(this);

    this.load.setBaseURL(process.env.REACT_APP_CDN_PATH);
    if (process.env.NODE_ENV === 'development') {
      this.load.crossOrigin = 'anonymous';
    }
    this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY + 50, 'Loading animation sprites', { fontFamily: 'Arial' })
      .setOrigin(0.5);

    this.load.image('background', `scenes/backgrounds/${this.fightScene}_fight.png`);
    this.load.image(`custom-blank`, `skills/core/blank.png`);
    this.load.setPath(`icons/people/`);
    this.loadMultiatlas('people-icons', 'all.json');
    // }
    this.load.setPath(`icons/monsters/`);
    this.loadMultiatlas('monster-icons', 'all.json');
    // this.load.setPath('assets/actors/data/effects');
    // this.load.json('effect-offsets', 'offsets.json');
    this.load.setPath('');

    const ignore = [UserSkills.BASIC_ATTACK, UserSkills.PRIORITY_ATTACK, UserSkills.SECRET_TECHNIQUE, 7777, 40002];
    const effectOffets = this.cache.json.get('effect-offsets');

    this.turns.forEach((turn) => {
      if (turn.addEffect !== undefined) {
        turn.addEffect.forEach(({ id }) => {
          if (!!effectOffets[id]) {
            this.effectList.add('' + id);
            return;
          }

          if (!(id in effects) || effects[id].hidden) {
            return;
          }

          this.effectList.add(effects[id].name);
        });
      }

      if (this.skillData.has(turn.skillId ?? -999)) {
        return;
      }

      if (turn.skillId !== undefined && !ignore.includes(turn.skillId) && turn.skillId in skills) {
        this.skillList.add(skills[turn.skillId].name);

        skills[turn.skillId].linked?.forEach((linkedSkill) => {
          this.skillList.add(skills[linkedSkill].name);
        });
      }
    });

    // this.load.setPath('assets/skills/motion/');
    // this.motionData.forEach((data, key) => {
    //   this.load.json(`motion-${key}`, `${key}.json`);
    // });

    this.skillData.forEach((data, key) => {
      this.load.setPath(`skills/${data.name.substring(0, data.name.indexOf('/') + 1)}`);
      this.loadMultiatlas(`skill-${key}`, `${data.name.substring(data.name.lastIndexOf('/') + 1, data.name.length)}.json`);
    });

    this.load.setPath(`skills/core/`);
    this.skillList.forEach((skill) => {
      this.loadMultiatlas(`skill-${skill}`, `${skill}.json`);
    });

    this.load.setPath('actors/effects/');
    this.effectList.forEach((effect) => {
      this.loadMultiatlas(`effect-${effect}`, `${effect}.json`);
    });

    if (this.originalNumbers) {
      this.load.setPath('actors/numbers/');
      this.loadMultiatlas('damage-normal', 'normal.json');
      this.loadMultiatlas('damage-heal', 'heal.json');
    }

    this.load.setPath(`icons/`);
    this.loadMultiatlas('icons-effects', 'effects.json');
    this.loadMultiatlas('icons-skills', 'skills.json');

    this.load.setPath('');

    // this.offenseUnits.forEach((unit) => unit.load());
    // this.defenseUnits.forEach((unit) => unit.load());

    // this.topUI.load();
  }

  // t = 0;
  customPipeline: any;

  create() {
    // this.add.image(0, 0, 'background').setDepth(Depths.BASE).setOrigin(0);
    // this.timeDisplay = this.add.text(500, 580, '').setOrigin(0.5);
    // // this.customPipeline = (this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer).addPipeline('Gray', new GrayscalePipeline(this.game));
    // // this.customPipeline.setFloat2('uResolution', this.game.config.width, this.game.config.height);
    // // (this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer).addPipeline(OutlinePipeline.KEY, new OutlinePipeline(this.game));
    // const ignore = [UserSkills.BASIC_ATTACK, UserSkills.PRIORITY_ATTACK, UserSkills.SECRET_TECHNIQUE, 7777];
    // const skillList: Set<string> = new Set(['jutsu', 'mud_wall', 'substitution_technique']);
    // console.log(this.textures);
    // this.turns.forEach((turn) => {
    //   if (turn.skillId !== undefined && !ignore.includes(turn.skillId) && turn.skillId in skills && !skills[turn.skillId].onPet) {
    //     skillList.add(skills[turn.skillId].name);
    //     skills[turn.skillId].linked?.forEach((linkedSkill) => {
    //       skillList.add(skills[linkedSkill].name);
    //     });
    //   }
    // });
    // this.motionData.forEach((data, key) => this.motions.set(key, new Motion(this, data)));
    // this.skillData.forEach((data, key) => {
    //   if (data.noSprite || this.anims.exists('' + key)) {
    //     return;
    //   }
    //   this.anims.create({
    //     key: '' + key,
    //     frameRate: 12,
    //     frames: this.anims.generateFrameNames(`skill-${key}`, {
    //       start: 0,
    //       end: this.textures.get(`skill-${key}`).frameTotal - 1,
    //     }),
    //   });
    // });
    // skillList.forEach((skill) => {
    //   if (this.anims.exists(skill)) {
    //     return;
    //   }
    //   this.anims.create({
    //     key: skill,
    //     frameRate: 12,
    //     frames: this.anims.generateFrameNames(`skill-${skill}`, {
    //       start: 0,
    //       end: this.textures.get(`skill-${skill}`).frameTotal - 1,
    //     }),
    //   });
    // });
    // this.effectList.forEach((effect) => {
    //   if (this.anims.exists(effect)) {
    //     return;
    //   }
    //   this.anims.create({
    //     key: `effect-${effect}`,
    //     frameRate: 12,
    //     frames: this.anims.generateFrameNames(`effect-${effect}`, {
    //       start: 0,
    //       end: this.textures.get(`effect-${effect}`).frameTotal - 1,
    //     }),
    //     repeat: -1,
    //   });
    // });
    // this.data.set('effectList', this.effectList);
    // this.data.set('skillList', this.skillList);
    // this.offenseUnits.forEach((unit) => unit.create().flip());
    // this.defenseUnits.forEach((unit) => unit.create());
    // this.topUI.create(this.offenseUnits, this.defenseUnits);
  }

  readyCount = 0;
  started = false;
  update() {
    // if (!this.started) {
    //   this.add.text(30, this.cameras.main.height - 30, ((window.performance.now() - timer) / 1000).toFixed(2) + 's', {
    //     fontFamily: 'CustomFont',
    //   });
    //   this.started = true;
    //   this.offenseUnits[0].zoneIn(300, 455, () => this.readyCheck());
    //   this.defenseUnits[0].zoneIn(700, 455, () => this.readyCheck());
    //   EventEmitter.emit('updateCharacters', {
    //     offense: this.offenseUnits[this.offenseCurrent].fightRole.index,
    //     defense: this.defenseUnits[this.defenseCurrent].fightRole.index,
    //   });
    // }
  }

  readyCheck() {
    this.readyCount++;

    if (this.readyCount < 2) {
      return;
    }

    (async () => {
      await this.iterateTurns();
      setTimeout(() => {
        this.finish();
      }, 500);
    })();
  }

  // update() {
  //   this.customPipeline.setFloat1('uTime', this.t);

  //   this.t += 0.05;
  // }

  addEffect(effect: Effect) {
    if (!this.effects.find((e) => e.name === effect.name)) {
      this.effects.push(effect);
      this.add.existing(effect);
    }
  }

  removeEffect(effect: String) {
    const idx = this.effects.findIndex((e) => e.name === effect);

    if (idx !== -1) {
      this.effects[idx].destroy();
      this.effects.splice(idx, 1);
    }
  }

  finish() {
    this.onFinish();

    if (this.reason === -1) {
      // store.dispatch(endFight());
    } else {
      store.dispatch(setRewards(this.rewards));
    }
  }

  getCharacter(role: number) {
    for (let i = 0; i < this.offenseUnits.length; i++) {
      if (this.offenseUnits[i].index === role) {
        return this.offenseUnits[i];
      }
    }

    for (let i = 0; i < this.defenseUnits.length; i++) {
      if (this.defenseUnits[i].index === role) {
        return this.defenseUnits[i];
      }
    }

    return null;
  }

  async iterateTurns() {
    // for (const idx in this.turns) {
    //   const turn = this.turns[idx];
    //   // console.log('Turn', turn);
    //   const source = this.roles[turn.role];
    //   const target = source.isOnOffense ? this.defenseUnits[this.defenseCurrent] : this.offenseUnits[this.offenseCurrent];
    //   this.timeDisplay.text = `${parseFloat(((turn.time || 0) / 100).toFixed(2))}s`;
    //   const checkVictory = async () => {
    //     if (target.hp <= 0) {
    //       if (target.animation !== CharacterAnimation.DEAD) {
    //         target.animate(CharacterAnimation.DEAD);
    //       }
    //     } else if (source.hp <= 0) {
    //       if (source.animation !== CharacterAnimation.DEAD) {
    //         source.animate(CharacterAnimation.DEAD);
    //       }
    //     } else {
    //       // if (turn.skillId === UserSkills.BOMB) {
    //       //   await target.animate(CharacterAnimation.REVIVE);
    //       // }
    //     }
    //   };
    //   if (turn.event === FightEvents.CANT_MOVE) {
    //     await new DizzyMotion(this, source).create();
    //   }
    //   if (turn.event === FightEvents.PRIORITY_MUL) {
    //     await target.move();
    //     target.animate(CharacterAnimation.IDLE);
    //     await SkillFactory.create(this, UserSkills.PRIORITY_ATTACK, source, target, turn);
    //     checkVictory();
    //   }
    //   if (turn.event === FightEvents.BACK_THROWED) {
    //     await SkillFactory.create(this, UserSkills.BOMB_THROW_BACK, source, target, turn);
    //     await SkillFactory.create(this, UserSkills.BOMB_KICK, target, source, turn);
    //     if (turn.isHit ?? false) {
    //       await source.animate(CharacterAnimation.REVIVE);
    //     }
    //     checkVictory();
    //   }
    //   if (turn.event === FightEvents.COUNTER_DAMAGE) {
    //     await SkillFactory.counter(this, source, target, turn.targetLastDamage);
    //     checkVictory();
    //   }
    //   if (turn.event === FightEvents.CHANGE_BUFF) {
    //     if (turn.selfLastDamage !== undefined) {
    //       if (turn.targetSkillId) {
    //         await SkillFactory.create(this, UserSkills.FLYING_THUNDER_GOD_2, source, target);
    //       }
    //       await source.damage(turn.selfLastDamage, turn.isCrit ?? false, HurtLiteMotion);
    //     }
    //     source.decreaseMp(turn.decMp ?? 0);
    //     source.damage((turn.incHp ?? 0) * -1, turn.isCrit ?? false, null);
    //     turn.statChange?.forEach((change) => EventEmitter.emit('combatStatUpdate', change));
    //     const { addEffect = [], removeEffect = [] } = turn;
    //     EffectFactory.remove(this, removeEffect);
    //     EffectFactory.add(this, addEffect);
    //     if (turn.skillId !== undefined) {
    //       await SkillFactory.create(this, turn.skillId, source, target, turn);
    //     }
    //     checkVictory();
    //   }
    //   if (turn.event === FightEvents.USER_SKILL) {
    //     // await SkillFactory.create(this, UserSkills.PET_ATTACK, source, target, turn);
    //     if (turn.skillId) {
    //       if (this.skillData.has(turn.skillId)) {
    //         await SkillFactoryV2.create(this, turn.skillId, source, target, turn);
    //       } else {
    //         await SkillFactory.create(this, turn.skillId in skills ? turn.skillId : UserSkills.BASIC_ATTACK, source, target, turn);
    //       }
    //     }
    //     checkVictory();
    //   }
    //   if (turn.event === FightEvents.BE_DIE) {
    //     if (source.animation !== CharacterAnimation.DEAD) {
    //       await source.animate(CharacterAnimation.DEAD);
    //     }
    //   }
    //   if (turn.event === FightEvents.CHANGE_ROLE) {
    //     await target.end();
    //     await source.end();
    //     source.hide(true);
    //     if (source.isOnOffense) {
    //       this.offenseCurrent += 1;
    //       this.topUI.newSource(this.offenseUnits[this.offenseCurrent]);
    //       await this.offenseUnits[this.offenseCurrent].zoneIn(300, 455);
    //     } else {
    //       this.defenseCurrent += 1;
    //       this.topUI.newTarget(this.defenseUnits[this.defenseCurrent]);
    //       await this.defenseUnits[this.defenseCurrent].zoneIn(700, 455);
    //     }
    //     EventEmitter.emit('updateCharacters', {
    //       offense: this.offenseUnits[this.offenseCurrent].fightRole.index,
    //       defense: this.defenseUnits[this.defenseCurrent].fightRole.index,
    //     });
    //   }
    //   if (turn.event === FightEvents.VICTORY) {
    //     await source.animate(CharacterAnimation.WIN);
    //     source.animate(CharacterAnimation.IDLE);
    //   }
    //   if (turn.event === FightEvents.END_ATTACK) {
    //     source.animate(CharacterAnimation.IDLE);
    //     await source.end();
    //   }
    // }
  }

  // showDamage({ amount, x, y, isCrit = false }: { amount: number; x: number; y: number; isCrit: boolean }) {
  //   if (this.originalNumbers) {
  //     this.add.existing(new DamageNumbers(this, amount, x, y - 30, isCrit));
  //   } else {
  //     this.add.existing(new FontNumbers(this, amount, x, y - 30, isCrit));
  //   }
  // }
}

// export class MainScene extends Phaser.Scene {
//   constructor() {
//     super({ key: 'main' });
//   }

//   init() {
//     this.scene.start('fight', store.getState().fight.fight);
//   }
// }

// const Class = require('../../../node_modules/phaser/src/utils/Class.js');

// var GrayscalePipeline = new Class({
//   Extends: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline,

//   initialize: function GrayscalePipeline(game: any) {
//     Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline.call(this, {
//       game: game,
//       renderer: game.renderer,
//       fragShader: `
//       precision mediump float;

//       uniform sampler2D uMainSampler;
//       uniform vec2 uResolution;
//       uniform float uTime;

//       varying vec2 outTexCoord;
//       varying vec4 outTint;

//       vec4 plasma()
//       {
//           vec2 pixelPos = gl_FragCoord.xy / uResolution * 20.0;
//           float freq = 0.8;
//           float value =
//               sin(uTime + pixelPos.x * freq) +
//               sin(uTime + pixelPos.y * freq) +
//               sin(uTime + (pixelPos.x + pixelPos.y) * freq) +
//               cos(uTime + sqrt(length(pixelPos - 0.5)) * freq * 2.0);

//           return vec4(
//               cos(value),
//               sin(value),
//               sin(value * 3.14 * 2.0),
//               1
//           );
//       }

//       void main()
//       {
//           vec4 texture = texture2D(uMainSampler, outTexCoord);

//           texture *= vec4(outTint.rgb, outTint.a);

//           gl_FragColor = texture * plasma();
//       }
//       `,
//       uniforms: ['uProjectionMatrix', 'uViewMatrix', 'uModelMatrix', 'uMainSampler', 'uResolution', 'uTime'],
//     });
//   },
// });
