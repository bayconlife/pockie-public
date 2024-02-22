import { Scene, SCENES } from '../../../resources/scenes';
import { CustomSocket } from '../../../interfaces';
import { monsters } from '../../../resources/monsters';
import { GameModule, User } from '../../../components/classes';
import { Callback, SocketFunction } from '../../../types';
import { emitMultiFight } from './fields';
import { onRequestLoginServerData } from '../../../modules/kernel/pubSub';

interface SceneSwitchWorldMapData {
  scene: number;
}

const MODULE_NAME = 'Scenes';

onRequestLoginServerData(MODULE_NAME, (config) => ({
  scenes: SCENES,
}));

const scenesPlayerList: { [sceneId: string]: { level: number; name: string; id: number }[] } = {};

function createPlayerListItem(socket: CustomSocket, user: User) {
  return {
    level: user.level,
    name: user.displayName,
    id: socket.getAccountId(),
  };
}

export async function emitVillageSelection(socket: CustomSocket, character: User) {
  socket.emit('updateHomeVillage', character.village);
}

const goToVillage: SocketFunction = async (socket, character, data, cb) => {
  await sceneLeaveCurrentScene(socket, character);
  await sceneJoinScene(socket, character, character.village);

  emitScene(socket);
};

export const switchScene: SocketFunction<number> = async (socket, character, sceneId, cb) => {
  // console.log(user.displayName, 'switching scene to', user.lastScene);

  if (sceneId === Scene.Las_Noches) {
    if (character.lasNoches.current !== -1) {
      sceneId = Scene.Las_Noches_Part_One;
    }
  }

  const scene = SCENES[sceneId];

  if (scene === undefined) {
    return socket.emit('error', 'error__invalid_scene');
  }

  if (character.level < scene.level) {
    return socket.emit('error', 'error__user_underleveled');
  }

  await sceneLeaveCurrentScene(socket, character);
  await sceneJoinScene(socket, character, sceneId);

  return [emitScene, emitMultiFight];
};

export async function sceneJoinScene(socket: CustomSocket, character: User, scene: number) {
  if (scene !== character.scenes.current) {
    character.scenes.previous = character.scenes.current;
  }

  character.scenes.current = scene;

  await socket.save(character);

  socket.join(`scene-${scene}`);
  socket.to(`scene-${scene}`).emit('addPlayerToScene', createPlayerListItem(socket, character));

  if (!(scene in scenesPlayerList)) {
    scenesPlayerList[scene] = [];
  }

  if (scenesPlayerList[scene].every((player) => player.id !== socket.getAccountId())) {
    scenesPlayerList[scene].push(createPlayerListItem(socket, character));
  }
}

export async function sceneLeaveCurrentScene(socket: CustomSocket, character: User) {
  const scene = character.scenes.current;
  // console.log(user.displayName, 'leaving scene', user.lastScene);

  if (!(scene in scenesPlayerList)) {
    scenesPlayerList[scene] = [];
  }

  const idx = scenesPlayerList[scene].findIndex((o) => o.id === socket.getAccountId());

  if (idx !== -1) {
    scenesPlayerList[scene].splice(idx, 1);
  }

  socket.to(`scene-${scene}`).emit('removePlayerFromScene', socket.getAccountId());
  socket.leave(`scene-${scene}`);
}

const sendToCurrentScene: SocketFunction = async (socket, character, data, cb) => {
  await sceneJoinScene(socket, character, character.scenes.current);

  emitScene(socket);
};

const sendToPreviousScene: SocketFunction = async (socket, character, data, cb) => {
  await sceneLeaveCurrentScene(socket, character);
  await sceneJoinScene(socket, character, character.scenes.previous);

  emitScene(socket);
};

export async function emitScene(socket: CustomSocket) {
  const user = await socket.getUnlockedCharacter();
  const scene = SCENES[user.scenes.current];

  socket.emit('switchScene', {
    scene: user.scenes.current,
    ...scene,
    monsters: scene.monsters.map((id) => ({ id, level: monsters[id].level, avatar: monsters[id].avatar })),
    players: scenesPlayerList[user.scenes.current]?.filter((o) => o.name !== user.displayName),
  });
}

export default class SceneModule extends GameModule {
  moduleName = MODULE_NAME;
  modules = {
    goToVillage,
    previousScene: sendToPreviousScene,
    sceneGoToCurrent: sendToCurrentScene,
    switchScene,
  };
}
