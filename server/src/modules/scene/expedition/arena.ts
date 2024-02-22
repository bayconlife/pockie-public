import { SocketFunction } from '../../../types';
import { generateOnlyBots } from '../core/arena';
import { GameModule } from '../../../components/classes';

const MODULE_NAME = 'ExpeditionArena';

const arena: SocketFunction = async (socket, character, data, cb) => {
  if (character.arena.fighters.length !== 0) {
    return cb(character.arena);
  }

  // The only time we get here is when the user goes to the arena the first time
  // When that happens we want to only add bots
  character.arena.fighters = generateOnlyBots(character);

  cb(character.arena);
};

export default class ExpeditionArenaModule extends GameModule {
  moduleName = MODULE_NAME;
  modules = {
    arena,
  };
}
