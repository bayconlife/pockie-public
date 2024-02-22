import { GameModule, User } from '../../components/classes';
import pubSub, { onRequestLoginData, onRequestLoginServerData } from '../kernel/pubSub';
import { error } from '../kernel/errors';
import { SocketFunction } from '../../types';
import { calculateStatsV2 } from './stats';
import { CustomSocket } from '../../interfaces';
import { TITLES } from '../../resources/titles';

const MODULE_NAME = 'Titles';

onRequestLoginData(MODULE_NAME, (character: User) => {
  return {
    titles: character.titles,
  };
});

onRequestLoginServerData(MODULE_NAME, (config) => ({
  titles: TITLES,
}));

export function emitTitles(socket: CustomSocket, character: User) {
  socket.emit('updateCharacter', { titles: character.titles });
}

const setTitle: SocketFunction<number> = async (socket, character, id, cb) => {
  const titleId = Number(id);

  if (titleId !== 0 && !character.titles.unlocked.includes(titleId)) {
    return error(socket, 'error__title_not_unlocked');
  }

  character.titles.current = titleId;
  character.stats.title = titleId;
  character.stats = calculateStatsV2(socket, character);

  cb();
};

export default class TitleModule extends GameModule {
  moduleName = MODULE_NAME;
  modules = {
    setTitle,
  };
}
