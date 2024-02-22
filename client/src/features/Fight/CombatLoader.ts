import CharacterFactoryV2, { FightRole } from '../../components/Fight/CharacterFactoryV2';
import { skills } from '../../components/Fight/Skills/Skills';
import store from '../../store';
import { headData } from '../../util/fetch';

export function loadCharacterData(scene: Phaser.Scene, data: any) {
  const loadedSkills = new Set<number>();
  const loadedMotions = new Set<number>();
  const attemptedKeys = new Set<string>();

  if (process.env.NODE_ENV === 'development') {
    scene.load.crossOrigin = 'anonymous';
  }

  // timer = window.performance.now();

  // const loadingText = scene.add
  //   .text(scene.cameras.main.centerX, scene.cameras.main.centerY, 'Fetching actor data...', { fontFamily: 'Arial' })
  //   .setOrigin(0.5, 1);

  let lastKey = '';

  scene.load.addListener(Phaser.Loader.Events.ADD, (key: string) => (lastKey = key));
  scene.load.addListener(Phaser.Loader.Events.ADD, (key: string) => (lastKey = key));

  const asyncLoader = (loaderPlugin: Phaser.Loader.LoaderPlugin) =>
    new Promise((resolve, reject) => {
      if (lastKey === '' || scene.cache.json.exists(lastKey)) {
        return resolve(null);
      }

      loaderPlugin.on(Phaser.Loader.Events.FILE_LOAD_ERROR, (e: any) => {
        console.error('Was trying', lastKey, e);
      });
      loaderPlugin.on('filecomplete', resolve).on('loaderror', (e: any) => {
        console.error('FAILED', e);
        reject();
      });
      loaderPlugin.start();
    });

  const loadIfAvailable = (key: string, path: string) =>
    new Promise<boolean>(async (resolve, reject) => {
      if (attemptedKeys.has(key)) {
        return resolve(false);
      }

      attemptedKeys.add(key);

      const valid = await headData(path)
        .then((res) => {
          return res.ok;
        })
        .catch((err) => {
          console.error(err);
          return false;
        });

      if (valid) {
        await asyncLoader(scene.load.json(key, path))
          .then(() => resolve(true))
          .catch(() => resolve(false));
      } else {
        resolve(false);
      }
    });

  const loadMotion = async (id: number) => {
    // loadingText.setText(`Loading motion data ${id}.`);
    const loaded = await loadIfAvailable(`skill-motion-${id}`, `${process.env.REACT_APP_CDN_PATH}skills/motion/${id}.json`);

    if (loaded) {
      loadedMotions.add(id);
    }

    return loaded;
  };

  const loadSkill = async (skillId: number) => {
    // loadingText.setText(`Loading skill data ${skillId}.`);
    const loaded = await loadIfAvailable(`skill-data-${skillId}`, `${process.env.REACT_APP_CDN_PATH}skills/data/${skillId}.json`);

    if (loaded) {
      loadedSkills.add(skillId);

      const skillJSON = scene.cache.json.get(`skill-data-${skillId}`);

      for (let i = 0; i < skillJSON.linked?.length ?? 0; i++) {
        await loadSkill(skillJSON.linked[i]);
      }

      for (let i = 0; i < skillJSON.motions?.length ?? 0; i++) {
        await loadMotion(skillJSON.motions[i]);
      }
    }

    return loaded;
  };

  return new Promise<any>(async (resolve, reject) => {
    // loadingText.setText('Loading default avatar.');

    await asyncLoader(scene.load.json(`avatar-data-1`, `${process.env.REACT_APP_CDN_PATH}actorsV2/people/1/data.json`));

    for (let i = 0; i < data.roles.length; i++) {
      const role = data.roles[i];

      // loadingText.setText(`Loading avatar ${role.avatar}.`);
      await loadIfAvailable(`avatar-data-${role.avatar}`, `${process.env.REACT_APP_CDN_PATH}actorsV2/people/${role.avatar}/data.json`);

      if (role.pet) {
        // loadingText.setText(`Loading pet`);
        await loadIfAvailable(`pet-data-${role.pet}`, `${process.env.REACT_APP_CDN_PATH}actorsV2/pets/${role.pet}/data.json`);
      }
    }

    // loadingText.setText(`Finished loading avatars.`);

    for (let i = 0; i < data.fight.length; i++) {
      const turn = data.fight[i];

      if (turn.isHit !== undefined && turn.isHit === false && !loadedSkills.has(7000)) {
        await loadSkill(7000);
      }

      if (turn.targetSkillId !== undefined) {
        if (!(turn.targetSkillId in skills) || !loadedSkills.has(turn.targetSkillId)) {
          await loadSkill(turn.targetSkillId);
        }
      }

      if (turn.skillId === undefined || turn.skillId === 1 || loadedSkills.has(turn.skillId) || turn.skillId in skills) {
        continue;
      }

      await loadSkill(turn.skillId);
    }

    // loadingText.setText(`Finished loading skills.`);

    // Preload font
    scene.add
      .text(-100, -100, 'load', {
        fontFamily: store.getState().settings.font,
        fontSize: 10,
      })
      .setVisible(false);
    const avatarData: { [key: string]: any } = {
      default: scene.cache.json.get('avatar-data-1'),
    };
    const petData = new Map<number, any>();

    avatarData[1] = scene.cache.json.get(`avatar-data-1`);
    data.roles.forEach((role: FightRole) => {
      avatarData[role.avatar] = scene.cache.json.get(`avatar-data-${role.avatar}`);

      if (role.pet) {
        petData.set(role.pet, scene.cache.json.get(`pet-data-${role.pet}`));
      }
    });

    const skillData = new Map<number, any>();
    const motionData = new Map<number, any>();

    loadedSkills.forEach((id) => skillData.set(id, scene.cache.json.get(`skill-data-${id}`)));
    loadedMotions.forEach((id) => motionData.set(id, scene.cache.json.get(`skill-motion-${id}`)));

    await loadIfAvailable('effect-offsets', `${process.env.REACT_APP_CDN_PATH}actors/data/effects/offsets.json`);

    CharacterFactoryV2.characterData = avatarData;
    CharacterFactoryV2.petData = petData;

    resolve({ ...data, avatarData, petData, skillData, motionData });
  });
}
