import { CustomSocket } from '../../../interfaces';
import { Callback, SocketFunction } from '../../../types';
import {
  addItemToLocation,
  emitItems,
  findItemsByIIDInContainer,
  getItem,
  getItemInLocation,
  getItemType,
  itemSwap,
  reduceItem,
} from '../../items/itemSystem';
import { error, errorInvalidItem } from '../../kernel/errors';
import { ITEM_TYPES } from '../../../resources/items';
import { ItemLocations } from '../../../enums';
import { emitStones } from '../../character/character';
import { fight } from '../../fight/combat';
import { FIELD_BOSSES } from '../../../resources/fieldBoss';
import { SCENES } from '../../../resources/scenes';
import { switchScene } from './scenes';
import { dropItems } from '../../drop/drops';
import { CONTAINER_INVENTORY, addItem } from '../../items/inventory';
import { emitLevelUp, gainExp } from '../../character/level';
import { randomInt } from 'crypto';
import { emitLevelStats } from '../../character/stats';
import { GameModule } from '../../../components/classes';
import { emitFight } from '../../../modules/fight/fightSystem';

const fieldBossFight: SocketFunction = async (socket, character, _, cb) => {
  const tickets = findItemsByIIDInContainer(character, 150078, CONTAINER_INVENTORY);

  if (tickets.length === 0) {
    return error(socket, 'error__invalid_ticket');
  }

  const boss = FIELD_BOSSES.get('' + SCENES[character.scenes.current].boss ?? '')?.get(Math.floor((character.level ?? 5) / 5) * 5);

  if (boss === undefined) {
    return error(socket, 'error__invalid_field_boss');
  }

  const result = fight([character.stats], [boss], character, socket, { allowMulti: true });

  if (typeof result === 'string') {
    return error(socket, result);
  }

  reduceItem(character, tickets[0], 1);

  if (!result.victory) {
    return emitFight(socket, result, () => {
      emitItems(socket, character);

      socket.emit('requestSwitchScene', character.village);
    });
  }

  const items = dropItems(socket, boss.dropTable, character.stats.dropPercent);
  const itemList: (number | string)[] = [];

  items.forEach((item) => {
    if (addItem(character, item) !== null) {
      itemList.push(item.iid);
    } else {
      itemList.push('Inventory Full!');
    }
  });

  const { didLevelUp, skillsGained } = gainExp(socket, character, boss.exp);

  const stonesGained = randomInt(boss.stones![0], boss.stones![1]);
  character.stones += stonesGained;

  emitFight(
    socket,
    {
      ...result,
      rewards: {
        exp: boss.exp,
        stones: stonesGained,
        items: itemList,
      },
    },
    () => {
      emitLevelStats(socket, character);
      emitStones(socket, character);
      emitItems(socket, character);

      if (didLevelUp) {
        emitLevelUp(socket, character, skillsGained);
      }
    }
  );
};

const fieldBossSetTicket: SocketFunction<string> = async (socket, character, uid, cb) => {
  const item = getItem(character, uid);

  if (item === undefined) {
    return errorInvalidItem(socket);
  }

  if (getItemType(item) !== ITEM_TYPES.Item.BossTicket) {
    return error(socket, 'error__invalid_item_type');
  }

  if (ItemLocations.BossTicket in character.locations) {
    itemSwap(character, item, character.items[character.locations[ItemLocations.BossTicket]]);
  } else {
    addItemToLocation(socket, character, item, ItemLocations.BossTicket);
  }

  return [emitItems];
};

export default class FieldBossModule extends GameModule {
  moduleName = 'FieldBosses';
  modules = {
    fieldBossFight,
    fieldBossSetTicket,
  };
}
