import { SocketFunction } from '../../types';
import { GameModule } from '../../components/classes';
import { onLogin, onRequestLoginData } from '../kernel/pubSub';
import { query } from '../../infrastructure/db';

const MODULE_NAME = 'Social';

onLogin(MODULE_NAME, (socket, character) => {
  if (character.social === undefined) {
    character.social = {
      blockedAccountIds: [],
    };
  }
});

onRequestLoginData(MODULE_NAME, (character) => ({
  social: character.social,
}));

const blockAccount: SocketFunction<number> = async (socket, character, accountId, cb) => {
  if (character.social.blockedAccountIds.indexOf(accountId) === -1) {
    character.social.blockedAccountIds.push(accountId);
  }

  cb();
};

const getDisplayNames: SocketFunction<[number]> = async (socket, character, accountIds, cb) => {
  query((client) => {
    return client.query(
      "select account_id, server_id, data->>'displayName' as display_name from characters where server_id = $1 and account_id = any($2::int[]) ",
      [socket.getServerId(), accountIds]
    );
  }).then((res) => {
    cb(
      res?.rows.reduce((map, row) => {
        map[row.account_id] = row.display_name;
        return map;
      }, {}) ?? {}
    );
  });
};

const unblockAccount: SocketFunction<number> = async (socket, character, accountId, cb) => {
  const idx = character.social.blockedAccountIds.indexOf(accountId);

  if (idx !== -1) {
    character.social.blockedAccountIds.splice(idx, 1);
  }

  cb();
};

export default class SocialModule extends GameModule {
  moduleName = MODULE_NAME;
  modules = {
    blockAccount,
    unblockAccount,
    getDisplayNames,
  };
}
