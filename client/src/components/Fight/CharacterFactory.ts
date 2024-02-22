import { CharacterAnimation } from '../../enums';
import { PreloadScene } from '../../features/Fight/Scenes/PreloadScene';
import Character from './Characters/Character';
import { FightScene } from './Scenes';

export interface FightRole {
  index: number;
  isOnOffense: boolean;
  avatar: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  weaponId?: number;
  pet?: number;
}

const repeat: string[] = [CharacterAnimation.MOVE, CharacterAnimation.IDLE];

export default class CharacterFactory {
  static characterData: any;
  static petData = new Map<number, any>();

  static create(scene: Phaser.Scene, role: FightRole): Character {
    if (CharacterFactory.characterData === undefined || CharacterFactory.characterData[role.avatar] === undefined) {
      console.error(CharacterFactory.characterData);
      throw Error('Invalid character data ' + role.avatar);
    }

    const { index, isOnOffense, avatar, hp, maxHp, mp, maxMp } = role;
    const character = new Character(scene);
    const characterData = CharacterFactory.characterData[role.avatar];

    character.animations = characterData.animations;
    character.weaponAnimations = characterData.weaponAnimations || {};
    character.secretTechnique = characterData.secretTechnique || {};
    character.name = characterData.name;

    character.isOnOffense = isOnOffense;
    character.hp = hp;
    character.maxHp = maxHp;
    character.mp = mp;
    character.maxMp = maxMp;
    character.index = index;
    character.fightRole = role;

    if (role.pet) {
      character.pet = new Character(scene);
      character.pet.name = 'pets/' + role.pet;
      character.pet.animations = CharacterFactory.petData?.get(role.pet)?.animations;
    }

    return character;
  }

  static load(scene: PreloadScene, role: FightRole) {
    if (CharacterFactory.characterData === undefined || CharacterFactory.characterData[role.avatar] === undefined) {
      throw Error('Invalid character data' + role.avatar);
    }

    const { weaponAnimations, secretTechnique, name } = CharacterFactory.characterData[role.avatar];
    const weaponId = '' + (role.weaponId ?? 1);
    const previousPath = scene.load.path;

    scene.load.setPath('');
    scene.loadImage(`${name}-icon`, `icons/${name}.png`);

    scene.load.setPath(`actorsV2/${name}`);
    scene.loadMultiatlas(`${name}-avatar`, `avatar.json`);
    if (secretTechnique && secretTechnique.damageFrame !== -1) {
      scene.loadMultiatlas(`${name}-secret_technique`, `secret_technique.json`);

      if (secretTechnique.concurrent) {
        scene.loadMultiatlas(`${name}-${secretTechnique.concurrent}`, `${secretTechnique.concurrent}.json`);
      }
    }

    if (weaponAnimations) {
      scene.load.setPath(`actorsV2/${name}/weapons/`);
      scene.loadMultiatlas(`${name}-weapon-${weaponId}`, `${weaponId}.json`);
    }

    if (role.pet) {
      CharacterFactory.loadPet(scene, role.pet);
    }

    scene.load.setPath(previousPath);
  }

  static loadPet(scene: PreloadScene, petId: number) {
    if (CharacterFactory.petData === undefined || !CharacterFactory.petData.has(petId)) {
      console.error('Pet data', CharacterFactory.petData);
      throw Error(`Invalid pet id ${petId}`);
    }

    const { animations } = CharacterFactory.petData.get(petId);
    const name = `pets/${petId}`;

    scene.load.setPath(`actorsV2/${name}/`);
    scene.loadMultiatlas(`${name}-avatar`, `avatar.json`);
  }

  static createAnimations(scene: PreloadScene, role: FightRole, avatarAnimations: Set<string> = new Set()) {
    const { animations, weaponAnimations, secretTechnique, name } = CharacterFactory.characterData[role.avatar];
    const weaponId = '' + (role.weaponId ?? 1);

    avatarAnimations.forEach((animation) => {
      if (!(animation in animations) || scene.anims.exists(`${name}-${animation}`)) {
        return;
      }

      if (animation === 'secret_technique') {
        return;
      }

      scene.anims.create({
        key: `${name}-${animation}`,
        frameRate: 12,
        frames: scene.anims.generateFrameNames(`${name}-avatar`, {
          prefix: `${animation}/`,
          end: Object.keys(scene.textures.get(`${name}-avatar`).frames).filter((k) => k.startsWith(`${animation}/`)).length,
        }),
        repeat: repeat.includes(animation) ? -1 : 0,
      });
    });

    scene.anims.create({
      key: `${name}-damage-lock`,
      frameRate: 12,
      frames: scene.anims.generateFrameNames(`${name}-avatar`, {
        prefix: `${CharacterAnimation.HURT_LITE}/`,
        end: 1,
      }),
      repeat: -1,
    });

    if (secretTechnique && secretTechnique.damageFrame !== -1) {
      scene.anims.create({
        key: `${name}-secret_technique`,
        frameRate: 12,
        frames: scene.anims.generateFrameNames(`${name}-secret_technique`, {
          end: scene.textures.get(`${name}-secret_technique`).frameTotal - 1,
        }),
      });

      if (secretTechnique.concurrent) {
        scene.anims.create({
          key: `${name}-${secretTechnique.concurrent}`,
          frameRate: 12,
          frames: scene.anims.generateFrameNames(`${name}-${secretTechnique.concurrent}`, {
            end: scene.textures.get(`${name}-${secretTechnique.concurrent}`).frameTotal - 1,
          }),
        });
      }
    }

    if (weaponAnimations) {
      Object.keys(weaponAnimations).forEach((animation) => {
        if (!avatarAnimations.has(animation) || scene.anims.exists(`${name}-${animation}-${weaponId}`)) {
          return;
        }

        scene.anims.create({
          key: `${name}-${animation}-${weaponId}`,
          frameRate: 12,
          frames: scene.anims.generateFrameNames(`${name}-weapon-${weaponId}`, {
            prefix: `${animation}/`,
            end: Object.keys(scene.textures.get(`${name}-weapon-${weaponId}`).frames).filter((k) => k.startsWith(`${animation}/`)).length,
          }),
          repeat: repeat.includes(animation) ? -1 : 0,
        });
      });
    }

    if (!scene.anims.exists(`skill-attack-${name}`)) {
      scene.anims.create({
        key: `skill-attack-${name}`,
        frameRate: 12,
        frames: scene.anims.generateFrameNames(`${name}-avatar`, {
          prefix: `${CharacterAnimation.ATTACK}/`,
          end: Object.keys(scene.textures.get(`${name}-avatar`).frames).filter((k) => k.startsWith(`${CharacterAnimation.ATTACK}/`)).length,
        }),
        repeat: 0,
      });
    }

    if (role.pet) {
      CharacterFactory.createPetAnimations(scene, role.pet);
    }
  }

  static createPetAnimations(scene: PreloadScene, petId: number) {
    if (CharacterFactory.petData === undefined || !CharacterFactory.petData.has(petId)) {
      console.error('Pet data', CharacterFactory.petData);
      throw Error(`Invalid pet id ${petId}`);
    }

    const { animations } = CharacterFactory.petData.get(petId);
    const name = `pets/${petId}`;

    Object.keys(animations).forEach((animation) => {
      scene.anims.create({
        key: `${name}-${animation}`,
        frameRate: 12,
        frames: scene.anims.generateFrameNames(`${name}-avatar`, {
          prefix: `${animation}/`,
          end: Object.keys(scene.textures.get(`${name}-avatar`).frames).filter((k) => k.startsWith(`${animation}/`)).length,
        }),
        repeat: repeat.includes(animation) ? -1 : 0,
      });
    });

    if (!scene.anims.exists(`skill-attack-${name}`)) {
      scene.anims.create({
        key: `skill-attack-${name}`,
        frameRate: 12,
        frames: scene.anims.generateFrameNames(`${name}-avatar`, {
          prefix: `${CharacterAnimation.ATTACK}/`,
          end: Object.keys(scene.textures.get(`${name}-avatar`).frames).filter((k) => k.startsWith(`${CharacterAnimation.ATTACK}/`)).length,
        }),
        repeat: 0,
      });
    }
  }
}
