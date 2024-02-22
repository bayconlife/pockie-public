import { FightEvents, FightReasons, UserSkills } from '../../../enums';
import { CustomSocket, Stats } from '../../../interfaces';
import { Callback, SocketFunction } from '../../../types';
import { createItem, emitItems, getItemBase } from '../../items/itemSystem';
import { Item } from '../../../resources/items';
import { CONTAINER_INVENTORY, addItem } from '../../items/inventory';
import { addAvailableQuest, emitQuests } from '../../quests/quests';
import { Quest } from '../../../resources/quests';
import { emitVillageSelection } from './scenes';
import { GameModule, User } from '../../../components/classes';
import { equipItemToUser } from '../../items/equip';
import { calculateStatsV2, emitStats } from '../../character/stats';
import { query } from '../../../infrastructure/db';
import { emitFight } from '../../../modules/fight/fightSystem';
import { addItemToContainer } from '../../../modules/items/container';

const MODULE_NAME = 'NewPlayer';

async function isValidDisplayName(name: string) {
  if (name === '' || name.length < 3) {
    return false;
  }

  const result = await query((client) => {
    return client.query('SELECT * FROM locked_names WHERE name ILIKE $1 LIMIT 1;', [`%${name}%`]);
  });

  if (result === null) {
    return true;
  }

  return result.rows.length === 0;
}

const firstFight: SocketFunction = async (socket, character, data, cb) => {
  const valid = [
    Item.AVATAR_GGIO,
    Item.AVATAR_LOVE,
    Item.AVATAR_RENJI,
    Item.AVATAR_CHOJI,
    Item.AVATAR_KIBA,
    Item.AVATAR_NANAO,
    Item.AVATAR_MOMO,
    Item.AVATAR_RANGIKU,
    Item.AVATAR_SHIZUNE,
    Item.AVATAR_NEMU,
    Item.AVATAR_TENTEN,
  ];

  if (!valid.includes(290000 + data.id)) {
    return cb('Invalid character');
  }

  if (!(await isValidDisplayName(data.displayName))) {
    return cb('Invalid name or name already taken.');
  } else {
    await query((client) => {
      return client.query('INSERT INTO locked_names(name) VALUES ($1);', [data.displayName]);
    });
  }

  character.items = {};
  character.displayName = data.displayName;
  // socket._data.quests = [new Quest(2)];
  character.quests.available = [];
  character.quests.inProgress = [];

  character.village = data.village;
  addAvailableQuest(character, Quest.Ninja_Trials);

  character.scenes.current = data.village;
  character.scenes.previous = data.village;

  const outfit = createItem(socket, 290000 + data.id);
  const weapon = createItem(socket, Item.WOODEN_CLUB);

  addItemToContainer(character, outfit, CONTAINER_INVENTORY);
  addItemToContainer(character, weapon, CONTAINER_INVENTORY);

  equipItemToUser(socket, character, outfit);
  equipItemToUser(socket, character, weapon);

  character.stats = calculateStatsV2(socket, character);

  emitStats(socket, character);
  emitItems(socket, character);
  emitQuests(socket, character);
  emitVillageSelection(socket, character);
  socket.emit('updateCharacter', { displayName: character.displayName });

  emitFight(socket, generateFirstFight(character), () => {
    socket.emit('requestSwitchScene', character.village);
  });
};

function generateFirstFight(user: User) {
  const gaaraStats = {
    avatar: 46,
    speed: 1000,
    dodge: 5,
    pierce: 0,
    defense: 0,
    defenseBreak: 0,
    hit: 0,
    critical: 5,
    criticalDamage: 0,
    con: 0,
    maxAttack: 42,
    minAttack: 37,
    weaponId: '1',
    skills: [1816, 1822, 3811, 1828, 3803, 10000, 7777],
  };

  return {
    reason: FightReasons.NEW_PLAYER,
    roles: [
      {
        index: 0,
        isOnOffense: true,
        ...user.stats,
        hp: 110,
        maxHp: 110,
        mp: 56,
        maxMp: 56,
        weaponId: user.stats?.weaponId,
      },
      {
        index: 1,
        isOnOffense: false,
        hp: 200,
        maxHp: 200,
        mp: 120,
        maxMp: 120,
        ...gaaraStats,
        weaponId: '1',
      },
    ],
    fight: [
      { role: 0, event: FightEvents.BEGIN_ATTACK },
      { role: 0, event: FightEvents.USER_SKILL, skillId: UserSkills.BASIC_ATTACK, targetLastDamage: 24 },
      { role: 1, event: FightEvents.COUNTER_DAMAGE, skillId: UserSkills.BASIC_ATTACK, targetLastDamage: 37 },
      { role: 0, event: FightEvents.END_ATTACK },
      { role: 1, event: FightEvents.BEGIN_ATTACK },
      { role: 1, event: FightEvents.USER_SKILL, skillId: UserSkills.GREAT_MUD_RIVER, decMp: 15, addBuff: [{ role: 0, id: 11810 }] },
      { role: 1, event: FightEvents.END_ATTACK },
      { role: 1, event: FightEvents.BEGIN_ATTACK },
      { role: 1, event: FightEvents.USER_SKILL, skillId: UserSkills.GREAT_STRENGTH, decMp: 25, isHit: false, targetRole: 0 },
      { role: 1, event: FightEvents.END_ATTACK },
      { role: 0, event: FightEvents.BEGIN_ATTACK },
      { role: 0, event: FightEvents.USER_SKILL, skillId: UserSkills.BASIC_ATTACK, targetLastDamage: 50, isCrit: true },
      { role: 1, event: FightEvents.USER_SKILL, skillId: UserSkills.WINDSTORM_ARRAY, decMp: 18, targetLastDamage: 65 },
      { role: 0, event: FightEvents.END_ATTACK },
      { role: 1, event: FightEvents.BEGIN_ATTACK },
      { role: 1, event: FightEvents.BACK_THROWED, skillId: UserSkills.BOMB, targetLastDamage: 108, targetRole: 0, isCrit: true },
      { role: 1, event: FightEvents.END_ATTACK },
      { role: 0, event: FightEvents.BEGIN_ATTACK },
      { role: 0, event: FightEvents.USER_SKILL, skillId: UserSkills.SECRET_TECHNIQUE, targetLastDamage: 139 },
      { role: 1, event: FightEvents.USER_SKILL, skillId: UserSkills.CREATION_REBIRTH, targetRole: 0, incHp: 50, decMp: 35 },
      { role: 0, event: FightEvents.END_ATTACK },
      { role: 1, event: FightEvents.BEGIN_ATTACK },
      { role: 1, event: FightEvents.USER_SKILL, skillId: UserSkills.SECRET_TECHNIQUE, targetLastDamage: 155 },
      { role: 1, event: FightEvents.END_ATTACK },
      { role: 0, event: FightEvents.BE_DIE },
      { role: 1, event: FightEvents.VICTORY },
    ],
  };
}

export default class NewPlayerModule extends GameModule {
  moduleName = MODULE_NAME;
  modules = {
    firstFight,
  };
}
