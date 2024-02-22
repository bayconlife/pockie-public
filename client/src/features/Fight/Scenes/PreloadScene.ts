import CharacterFactoryV2, { FightRole } from '../../../components/Fight/CharacterFactoryV2';
import Character from '../../../components/Fight/Characters/Character';
import { effects } from '../../../components/Fight/Effects/Effects';
import { Motion } from '../../../components/Fight/Motions/Motion';
import { skills } from '../../../components/Fight/Skills/Skills';
import { FightEvents, FightTurn, UserSkills } from '../../../components/interfaces/Interfaces';
import { createLoader } from '../../../components/phaser/Loader';
import { CharacterAnimation } from '../../../enums';
import store from '../../../store';
import { TopUI } from '../../Combat/Components/TopUI';

interface FightData {
  fight: FightTurn[];
  roles: FightRole[];
}

export class PreloadScene extends Phaser.Scene {
  private d: any;
  private loaded = new Set<string>();
  private turns: FightTurn[] = [];
  private roles: Character[] = [];
  private fightScene = 1;
  private avatarAnimations: Map<number, Set<string>>;

  public motionData: Map<number, any>;
  public skillData: Map<number, any>;
  public petData: Map<number, any>;
  public motions = new Map<number, Motion>();
  public font = '';
  public originalNumbers = false;
  public skillList = new Set(['jutsu', 'mud_wall', 'substitution_technique']);
  public effectList = new Set<string>();

  private cacheTime = 0;

  constructor() {
    super({ key: 'preload' });
  }

  init(data: any) {
    this.cacheTime = Date.now();
    this.d = JSON.parse(JSON.stringify(data));
    this.d.roles.forEach((role: FightRole) => {
      if (CharacterFactoryV2.characterData[role.avatar] === undefined) {
        role.avatar = 1;
      }
    });

    this.fightScene = data.scene ?? 1;
    this.turns = data.fight;

    this.motionData = data.motionData;
    this.skillData = data.skillData;
    this.petData = data.petData;

    const settings = store.getState().settings;
    this.originalNumbers = settings.originalDamage;

    const avatarAnimations = new Map<number, Set<string>>();
    const petAnimations = new Map<number, Set<string>>();
    const roleIndexToAvatar: { [idx: number]: number } = {};

    this.d.roles.forEach((role: FightRole) => {
      const animationSet = new Set([
        CharacterAnimation.ATTACK,
        CharacterAnimation.DEAD,
        CharacterAnimation.MOVE,
        CharacterAnimation.HURT_LITE,
        CharacterAnimation.IDLE,
        CharacterAnimation.REVIVE,
        CharacterAnimation.TAUNT,
        CharacterAnimation.WIN,
        CharacterAnimation.ZONE_ENTRANCE,
      ]);

      avatarAnimations.set(role.avatar, animationSet);
      roleIndexToAvatar[role.index] = role.avatar;
    });

    const checkSkill = (skill: any, avatar: number, targetAvatar: number) => {
      if (skill === undefined) {
        return;
      }

      if (skill.characterAnimation !== undefined) {
        avatarAnimations.get(avatar)?.add(skill.characterAnimation);
      }

      if (skill.targetAnimation !== undefined) {
        avatarAnimations.get(targetAvatar)?.add(skill.targetAnimation);
      }

      if (skill.jutsu) {
        avatarAnimations.get(avatar)?.add(CharacterAnimation.JUTSU);
      }

      skill.linked?.forEach((linkedSkill: number) => {
        if (this.skillData.has(linkedSkill)) {
          checkSkill(this.skillData.get(linkedSkill), avatar, targetAvatar);
        }

        if (linkedSkill in skills) {
          checkSkill(skills[linkedSkill], avatar, targetAvatar);
        }
      });
    };

    data.fight.forEach((turn: FightTurn) => {
      if (turn.event === FightEvents.BACK_THROWED) {
        avatarAnimations.get(roleIndexToAvatar[turn.role])?.add(CharacterAnimation.BOMB_KNOCKBACK);
        avatarAnimations.get(roleIndexToAvatar[turn.role ?? -1])?.add(CharacterAnimation.REVIVE);
        avatarAnimations.get(roleIndexToAvatar[turn.targetRole ?? -1])?.add(CharacterAnimation.BOMB_KICK);
      }

      // if (turn.event === FightEvents.BE_DIE) {
      //   animations.get(turn.role)?.add(CharacterAnimation.DEAD);
      // }

      // if (turn.event === FightEvents.VICTORY) {
      //   animations.get(turn.role)?.add(CharacterAnimation.WIN);
      // }

      if (turn.isHit !== undefined && !turn.isHit) {
        avatarAnimations.get(roleIndexToAvatar[turn.targetRole ?? -1])?.add(CharacterAnimation.DODGE);
      }

      if (turn.skillId === undefined) {
        return;
      }

      checkSkill(this.skillData.get(turn.skillId), roleIndexToAvatar[turn.role], roleIndexToAvatar[turn.targetRole ?? -1]);
      checkSkill(skills[turn.skillId], roleIndexToAvatar[turn.role], roleIndexToAvatar[turn.targetRole ?? -1]);

      if (turn.targetSkillId !== undefined) {
        checkSkill(this.skillData.get(turn.targetSkillId), roleIndexToAvatar[turn.targetRole ?? -1], roleIndexToAvatar[turn.role]);
        checkSkill(skills[turn.targetSkillId], roleIndexToAvatar[turn.targetRole ?? -1], roleIndexToAvatar[turn.role]);
      }
    });

    this.d.roles.forEach((role: FightRole) => {
      if (data.avatarData[role.avatar].secretTechnique?.characterAnimation !== undefined) {
        avatarAnimations.get(role.avatar)?.add(data.avatarData[role.avatar].secretTechnique.characterAnimation);
      }

      // if (animations.get(character.fightRole.index)?.has(CharacterAnimation.REVIVE)) {
      //   animations.get(character.fightRole.index)?.add(CharacterAnimation.DEAD);
      // }

      // character.usedAnimations = avatarAnimations.get(character.fightRole.index)!;
    });

    this.avatarAnimations = avatarAnimations;
  }

  loadImage(key: string, path: string, ...args: any[]) {
    if (!this.textures.exists(key)) {
      this.load.image(key, path, ...args);
      this.loaded.add(key);
    }
  }

  loadMultiatlas(key: string, jsonKey: string, ...args: any[]) {
    if (!this.textures.exists(key)) {
      this.load.multiatlas(key, jsonKey, ...args);
      this.loaded.add(key);
    }
  }

  loadSpritesheet(key: string, path: string, ...args: any[]) {
    if (!this.textures.exists(key)) {
      this.load.spritesheet(key, path, ...args);
      this.loaded.add(key);
    }
  }

  preload() {
    createLoader(this);

    if (process.env.NODE_ENV === 'development') {
      this.load.crossOrigin = 'anonymous';
    }
    this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY + 50, 'Loading animation sprites', { fontFamily: 'Arial' })
      .setOrigin(0.5);

    this.load.image(`background-${this.fightScene}`, `scenes/backgrounds/${this.fightScene}_fight.png`);
    this.load.image(`custom-blank`, `skills/core/blank.png`);
    this.load.setPath(`icons/people/`);
    this.loadMultiatlas('people-icons', 'all.json');
    this.load.setPath(`icons/monsters/`);
    this.loadMultiatlas('monster-icons', 'all.json');
    // this.load.setPath('assets/actors/data/effects');
    // this.load.json('effect-offsets', 'offsets.json');
    this.load.setPath('');
    this.loadImage(`custom-blank`, `skills/custom_motions/blank.png`);

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

    this.d.roles.map((role: FightRole) => {
      try {
        CharacterFactoryV2.load(this, role);
      } catch (e) {
        console.error(e);
        throw Error('Stop');
      }
    });

    TopUI.load(this);
  }

  create() {
    // this.customPipeline = (this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer).addPipeline('Gray', new GrayscalePipeline(this.game));
    // this.customPipeline.setFloat2('uResolution', this.game.config.width, this.game.config.height);
    // (this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer).addPipeline(OutlinePipeline.KEY, new OutlinePipeline(this.game));

    const ignore = [UserSkills.BASIC_ATTACK, UserSkills.PRIORITY_ATTACK, UserSkills.SECRET_TECHNIQUE, 7777];
    const skillList: Set<string> = new Set(['jutsu', 'mud_wall', 'substitution_technique']);

    this.turns.forEach((turn) => {
      if (turn.skillId !== undefined && !ignore.includes(turn.skillId) && turn.skillId in skills && !skills[turn.skillId].onPet) {
        skillList.add(skills[turn.skillId].name);

        skills[turn.skillId].linked?.forEach((linkedSkill) => {
          skillList.add(skills[linkedSkill].name);
        });
      }
    });

    this.motionData.forEach((data, key) => this.motions.set(key, new Motion(this, data)));
    this.skillData.forEach((data, key) => {
      if (data.noSprite || this.anims.exists('' + key)) {
        return;
      }

      this.anims.create({
        key: '' + key,
        frameRate: 12,
        frames: this.anims.generateFrameNames(`skill-${key}`, {
          start: 0,
          end: this.textures.get(`skill-${key}`).frameTotal - 1,
        }),
      });
    });

    skillList.forEach((skill) => {
      if (this.anims.exists(skill)) {
        return;
      }

      this.anims.create({
        key: skill,
        frameRate: 12,
        frames: this.anims.generateFrameNames(`skill-${skill}`, {
          start: 1,
          end: this.textures.get(`skill-${skill}`).frameTotal - 1,
        }),
      });
    });

    this.effectList.forEach((effect) => {
      if (this.anims.exists(`effect-${effect}`)) {
        return;
      }

      this.anims.create({
        key: `effect-${effect}`,
        frameRate: 12,
        frames: this.anims.generateFrameNames(`effect-${effect}`, {
          start: 1,
          end: this.textures.get(`effect-${effect}`).frameTotal - 1,
        }),
        repeat: -1,
      });
    });

    this.data.set('effectList', this.effectList);
    this.data.set('skillList', this.skillList);

    this.d.roles.map((role: FightRole) => CharacterFactoryV2.createAnimations(this, role, this.avatarAnimations.get(role.avatar)));

    this.scene.start('combatPlayer', { ...this.d, skillData: this.skillData });
  }
}
