import { onLogin, onRequestLoginData, onRequestLoginServerData } from '../../../modules/kernel/pubSub';
import { GameModule } from '../../../components/classes';
import { SocketFunction } from '../../../types';
import { error } from '../../../modules/kernel/errors';
import { getItemAmount, getItemsThatMatchIID, reduceItemsByAmount } from '../../../modules/items/itemSystem';
import { emitItemPatches } from '../../../modules/items/patches';
import { calculateStatsV2, emitStats } from '../../../modules/character/stats';
import { randomInt } from '../../../components/random';

const MODULE_NAME = 'Bloodline';
const INITIAL_DATA = {
  limits: {},
  souls: [],
  active: [null, null, null],
  bg: -1,
};

onLogin(MODULE_NAME, (socket, character) => {
  character.bloodlines = {
    ...INITIAL_DATA,
    ...character.bloodlines,
  };
});

onRequestLoginData(MODULE_NAME, (character) => ({
  bloodlines: character.bloodlines,
}));

onRequestLoginServerData(MODULE_NAME, (config) => ({
  bloodline: config.Base.Bloodline,
}));

const bindSoul: SocketFunction<{ index: number; id: number }> = async (socket, character, { index, id }, cb) => {
  const soul = character.bloodlines.souls[index];

  if (!soul) {
    return error(socket, 'error__invalid_soul');
  }

  const bloodlineConfig = socket.getConfig().Base.Bloodline.Config;
  const config = socket.getConfig().Base.Bloodline.Limits[id];

  if (config === undefined) {
    return error(socket, 'error__invalid_limit');
  }

  let limit = character.bloodlines.limits[id];

  if (!limit.collected) {
    return error(socket, 'error__not_obtained');
  }

  if (!limit.souls) {
    limit.souls = [];
  }

  if (limit.souls.length >= 5) {
    return error(socket, 'error__limit_full');
  }

  if (limit.souls.find((_soul) => _soul.id === soul.id)) {
    return error(socket, 'error__soul_type_already_in_use');
  }

  if (character.level < bloodlineConfig.soulLevelLimits[soul.level - 1]) {
    return error(socket, 'error__character_level_too_low');
  }

  limit.souls.push(soul);
  character.bloodlines.souls.splice(index, 1);
  character.stats = calculateStatsV2(socket, character);

  cb();

  socket.emit('updateCharacter', {
    bloodlines: character.bloodlines,
  });
};

const bloodlineActivate: SocketFunction<number> = async (socket, character, id, cb) => {
  const config = socket.getConfig().Base.Bloodline.Limits[id];

  if (config === undefined) {
    return error(socket, 'error__invalid_bloodline');
  }

  const limit = character.bloodlines.limits[id];

  if (!limit.collected) {
    return error(socket, 'error__not_obtained');
  }

  if (character.bloodlines.active.indexOf(id) !== -1) {
    return error(socket, 'error__bloodline_already_active');
  }

  const idx = character.bloodlines.active.indexOf(null);

  if (idx === -1) {
    return error(socket, 'error__no_space');
  }

  character.bloodlines.active[idx] = id;
  character.stats = calculateStatsV2(socket, character);

  if (character.bloodlines.bg === -1) {
    character.bloodlines.bg = id;
  }

  cb();

  return [emitStats];
};

const bloodlineDeactivate: SocketFunction<number> = async (socket, character, id, cb) => {
  if (!character.bloodlines.active.includes(id)) {
    return error(socket, 'error__invalid_bloodline');
  }

  const replaceBg = id === character.bloodlines.bg;

  character.bloodlines.active[character.bloodlines.active.indexOf(id)] = null;
  character.stats = calculateStatsV2(socket, character);

  if (replaceBg) {
    character.bloodlines.bg = character.bloodlines.active.find((id) => !!id) ?? -1;
  }

  cb();

  return [emitStats];
};

const bloodlineSetDisplay: SocketFunction<number> = async (socket, character, idx, cb) => {
  if (!character.bloodlines.active[idx]) {
    return error(socket, 'error__invalid_index');
  }

  character.bloodlines.bg = idx;

  cb();
};

const bloodlineTurnIn: SocketFunction = async (socket, character, index, cb) => {
  const config = socket.getConfig().Base.Bloodline.Limits;

  if (config[index] === undefined) {
    return error(socket, 'error__invalid_npc');
  }

  const bloodline = config[index];

  if (character.level < bloodline.level) {
    return error(socket, 'error__underleveled');
  }

  let limit = character.bloodlines.limits[index];

  if (limit === undefined) {
    limit = {
      collected: false,
      amity: 0,
      daily: 0,
      souls: [],
    };
  }

  if (limit.amity >= bloodline.amity) {
    return error(socket, 'error__already_obtained');
  }

  if (limit.daily >= 10) {
    return error(socket, 'error__daily_limit_reached');
  }

  let items = getItemsThatMatchIID(character, bloodline.item);

  if (items.reduce((sum, i) => (sum += getItemAmount(i)), 0) < 4) {
    return error(socket, 'error__not_enough_items');
  }

  const patches = reduceItemsByAmount(character, items, 4);

  limit.amity += 30;
  limit.daily += 1;

  if (limit.amity >= bloodline.amity) {
    limit.collected = true;
  }

  character.bloodlines.limits[index] = limit;

  cb(limit);

  emitItemPatches(socket, patches);
};

const destroySoul: SocketFunction<{ index: number; id: number }> = async (socket, character, { index, id }, cb) => {
  const config = socket.getConfig().Base.Bloodline.Limits[id];

  if (config === undefined) {
    return error(socket, 'error__invalid_limit');
  }

  let limit = character.bloodlines.limits[id];

  if (!limit) {
    return error(socket, 'error__invalid_limit');
  }

  if (!limit.souls) {
    limit.souls = [];
  }

  const soul = limit.souls[index];

  if (!soul) {
    return error(socket, 'error__invalid_soul');
  }

  limit.souls.splice(index, 1);
  character.stats = calculateStatsV2(socket, character);

  cb();

  socket.emit('updateCharacter', {
    bloodlines: character.bloodlines,
  });
};

const synthSouls: SocketFunction<(number | null)[]> = async (socket, character, indexes, cb) => {
  if (indexes.includes(null) || indexes.length < 3 || indexes.some((idx) => character.bloodlines.souls[idx!] === undefined)) {
    return error(socket, 'error__invalid_souls');
  }

  const souls = indexes.map((idx) => character.bloodlines.souls[idx!]);
  const soulIdsAreTheSame = souls.every((soul) => soul.id === souls[0].id);
  const soulLevelsAreTheSame = souls.every((soul) => soul.level === souls[0].level);
  const soulConfig = socket.getConfig().Base.Bloodline.Souls;

  if (souls[0].level >= socket.getConfig().Base.Bloodline.Config.soulLevelLimits.length) {
    return error(socket, 'error__souls_max_level');
  }

  if (soulIdsAreTheSame && soulLevelsAreTheSame) {
    character.bloodlines.souls.push({ id: souls[0].id, level: souls[0].level + 1 });
  } else if (soulLevelsAreTheSame) {
    const soulIds = Object.keys(soulConfig);
    character.bloodlines.souls.push({ id: Number(soulIds[randomInt(0, soulIds.length - 1)]), level: souls[0].level + 1 });
  }

  indexes.forEach((idx) => {
    character.bloodlines.souls.splice(idx!, 1);
  });

  cb();

  socket.emit('updateCharacter', {
    bloodlines: character.bloodlines,
  });
};

export default class BloodlineModule extends GameModule {
  moduleName = MODULE_NAME;
  modules = {
    bindSoul,
    bloodlineActivate,
    bloodlineDeactivate,
    bloodlineSetDisplay,
    bloodlineTurnIn,
    destroySoul,
    synthSouls,
  };
}
