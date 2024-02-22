import { ItemType } from '../../enums';
import { CustomSocket, Item } from '../../interfaces';
import { SocketFunction } from '../../types';
import { error, errorInvalidItem } from '../kernel/errors';
import { getItem, getItemBase, getItemBaseFromSocketConfig, isItemType, reduceItem } from './itemSystem';
import { GameModule, User } from '../../components/classes';
import { onLogin, onRequestLoginData, onRequestLoginServerData } from '../kernel/pubSub';
import { calculateStatsV2, emitStats } from '../character/stats';
import { Stat } from '../../resources/lines';
import { isItemEquipped } from './equip';
import { notice } from '../kernel/notices';
import { emitTitles } from '../character/titles';

const MODULE_NAME = 'Collection';

onLogin(MODULE_NAME, (socket, character) => {
  if (character.collection === undefined) {
    _initCollection(character);
  }
});

onRequestLoginData(MODULE_NAME, (character) => ({
  collection: character.collection,
}));

onRequestLoginServerData(MODULE_NAME, (config) => ({
  collection: config.Collection,
  avatars: config.Items.Avatars,
}));

const collectItem: SocketFunction<string> = async (socket, character, uid, cb) => {
  const item = getItem(character, uid);

  if (item === undefined) {
    return errorInvalidItem(socket);
  }

  if (character.collection === undefined) {
    _initCollection(character);
  }

  if (isItemType(item, ItemType.Avatar)) {
    _collectAvatar(socket, character, item);
  }

  character.stats = calculateStatsV2(socket, character);

  cb();

  return [emitStats, _emitCollection];
};

function _addStat(character: User, stat: number, value: number) {
  if (character.collection!.avatar.stats[stat] === undefined) {
    character.collection!.avatar.stats[stat] = 0;
  }

  character.collection!.avatar.stats[stat] += value;
}

function _collectAvatar(socket: CustomSocket, character: User, item: Item) {
  if (item.props.level < 2) {
    return error(socket, 'error__item_level_too_low');
  }

  if (isItemEquipped(character, item)) {
    return error(socket, 'error__cannot_use_equipped_avatar');
  }

  const base = getItemBaseFromSocketConfig(socket, item.iid);
  const config = socket.getConfig().Collection.avatars;
  const type = base.value === 27 ? 'gray' : base.value === 35 ? 'blue' : 'orange';
  const collected = character.collection!.avatar.collectedIdxs[type];
  const collectionIdx = config[type].outfits.findIndex((row) => row[0] === item.iid);

  if (collectionIdx === -1 || collected.includes(collectionIdx)) {
    return error(socket, 'error__invalid_collection_item');
  }

  character.collection!.avatar.collectedIdxs[type].push(collectionIdx);

  _addStat(character, Stat.Strength, config[type].outfits[collectionIdx][1]);
  _addStat(character, Stat.Agility, config[type].outfits[collectionIdx][2]);
  _addStat(character, Stat.Stamina, config[type].outfits[collectionIdx][3]);

  reduceItem(character, item, 1);

  character.statBonus.collection = [
    [Stat.Strength, character.collection!.avatar.stats[Stat.Strength]],
    [Stat.Agility, character.collection!.avatar.stats[Stat.Agility]],
    [Stat.Stamina, character.collection!.avatar.stats[Stat.Stamina]],
  ];

  if (config[type].levels[collected.length]) {
    character.statBonus[`collection-${type}`] = config[type].levels[collected.length];
    character.collection!.avatar.level += 1;

    if (collected.length > 5) {
      config[type].levels[collected.length - 5].forEach((row) => _addStat(character, row[0], -1 * row[1]));
    }

    config[type].levels[collected.length].forEach((row) => _addStat(character, row[0], row[1]));
  }

  if (config[type].titles[collected.length]) {
    character.titles.unlocked.push(config[type].titles[collected.length]);

    notice(socket, `Gained title [[title__${config[type].titles[collected.length]}]]`);

    emitTitles(socket, character);
  }
}

function _emitCollection(socket: CustomSocket, character: User) {
  socket.emit('updateCharacter', {
    collection: character.collection,
  });
}

function _initCollection(character: User) {
  character.collection = {
    avatar: {
      collectedIdxs: {
        gray: [],
        blue: [],
        orange: [],
      },
      level: 0,
      stats: {
        [Stat.Strength]: 0,
        [Stat.Agility]: 0,
        [Stat.Stamina]: 0,
        [Stat.Max_Hp_Multiplier]: 0,
        [Stat.Attack_Multiplier]: 0,
        [Stat.Speed_Multiplier]: 0,
      },
    },
  };
}

export default class CollectionModule extends GameModule {
  moduleName = MODULE_NAME;
  modules = {
    collectItem,
  };
}
