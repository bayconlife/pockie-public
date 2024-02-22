import { Callback, SocketFunction } from '../../types';
import { CustomSocket, Item } from '../../interfaces';
import {
  createItem,
  emitItems,
  equipableItemTypes,
  getItem,
  getItemAmount,
  getItemBase,
  getItemType,
  hasItem,
  reduceItem,
  setItemAmount,
} from './itemSystem';
import { error } from '../kernel/errors';
import { ItemType } from '../../enums';
import { addItem } from './inventory';
import { ITEM_TYPES } from '../../resources/items';
import { emitMedals, emitStones } from '../character/character';
import { emitLevelUp, gainExp } from '../character/level';
import { emitLevelStats } from '../character/stats';
import { randomInt } from '../../components/random';
import { addLines, dropItems } from '../drop/drops';
import { GameModule, User } from '../../components/classes';
import { notice } from '../kernel/notices';
import { updatePetToMatchLevel } from './pets';

const BoxType = {
  RandomOutfit: 1,
  SelectOutfit: 2,
  RandomItem: 3,
  RandomItemWeighted: 4,
};

export function openRandomItemWeighted(item: Item, amount = 1) {
  const base = getItemBase(item.iid);
  const content = base.innate.content;

  return selectRandomItemWeighted(content, amount);
}

export function selectRandomItemWeighted(content: any, amount = 1) {
  const total = content.reduce((sum: number, row: [number, number]) => (sum += row[1]), 0);

  const pick = () => {
    const roll = randomInt(1, total);
    let cur = 0;

    return (
      content.findIndex((row: [number, number]) => {
        cur += row[1];

        if (roll <= cur) {
          return true;
        }

        return false;
      }) ?? 0
    );
  };

  return Array(amount)
    .fill(null)
    .map((_) => pick());
}

const useItem: SocketFunction<string> = async (socket, character, uid, cb) => {
  if (!hasItem(character, uid)) {
    return error(socket, "You don't have that item.");
  }

  const item = getItem(character, uid);

  if (item === undefined) {
    return error(socket, 'Problem retrieving item.');
  }

  switch (getItemType(item)) {
    case ItemType.Box:
      await useBox(socket, character, item);
      break;
    case ItemType.Food:
      await useFood(socket, character, item);
      break;
  }

  cb();

  return [emitItems];
};

async function useFood(socket: CustomSocket, character: User, item: Item) {
  const base = getItemBase(item.iid);

  if (base.innate.buff) {
    character.buffs[base.innate.buff] = Date.now() + base.innate.duration * 1000;
  }

  socket.emit('updateCharacter', {
    buffs: character.buffs,
  });
}

// Todo update this to be uid
async function useBox(socket: CustomSocket, character: User, item: Item) {
  if (!hasItem(character, item.uid)) {
    return error(socket, 'Invalid item.');
  }

  const base = getItemBase(item.iid);

  if (base.innate.boxType === BoxType.RandomOutfit) {
    // Random
    socket.emit('promptBox', { type: base.innate.boxType, content: base.innate.content }, () => {});
  }

  if (base.innate.boxType === BoxType.SelectOutfit) {
    interface SelectProps {
      tab: number;
      idx: number;
    }

    const content = base.innate.content.map((tab: [number, number][]) =>
      tab.map((line) => {
        const i = createItem(socket, line[0]);

        i.props.level = line[1];

        return i;
      })
    );

    socket.emit('promptBoxSelect', { type: base.innate.boxType, content }, async ({ tab, idx }: SelectProps) => {
      if (tab === -1 || content[tab][idx] === undefined) {
        character.unlock?.();
        return error(socket, 'Invalid positions.');
      }
      const tempItem = addItem(character, content[tab][idx]);

      if (tempItem !== null) {
        if (getItemType(tempItem) === ItemType.Pet) {
          updatePetToMatchLevel(tempItem);
        }

        reduceItem(character, item, 1);
        socket.save(character);
      }

      emitItems(socket, character);
      character.unlock?.();
    });
  }

  if (base.innate.boxType === ITEM_TYPES.BoxType.RandomItem) {
    if (addItem(character, createItem(socket, base.innate.content[randomInt(0, base.innate.content.length - 1)])) !== null) {
      reduceItem(character, item, 1);
    }
  }

  if (base.innate.boxType === ITEM_TYPES.BoxType.RandomItemWeighted) {
    if (base.innate.content.length === 0) {
      return;
    }

    const res = openRandomItemWeighted(item);
    const idx = base.innate.content[res[0]];
    const i = addItem(character, createItem(socket, idx[0], idx.length > 2 ? idx[2] : 1));

    if (i !== null) {
      reduceItem(character, item, 1);

      if (equipableItemTypes.includes(getItemType(i)) && idx.length > 3) {
        addLines(socket, i, idx[3]);
      }

      notice(socket, `You obtained [[item__${i.iid}--name]]`);
    }
  }

  if (base.innate.boxType === ITEM_TYPES.BoxType.Bag) {
    if (base.innate.content[0] === ITEM_TYPES.BagType.Stone) {
      character.stones += base.innate.content[1];
      reduceItem(character, item, 1);

      emitStones(socket, character);
    }

    if (base.innate.content[0] === ITEM_TYPES.BagType.GiftCertificate) {
      character.currency.giftCertificates += base.innate.content[1];
      reduceItem(character, item, 1);

      socket.emit('updateCharacter', {
        currency: character.currency,
      });
    }

    if (base.innate.content[0] === ITEM_TYPES.BagType.Exp) {
      const { didLevelUp, skillsGained } = gainExp(socket, character, base.innate.content[1]);
      reduceItem(character, item, 1);
      emitLevelStats(socket, character);

      if (didLevelUp) {
        emitLevelUp(socket, character, skillsGained);
      }
    }

    if (base.innate.content[0] === ITEM_TYPES.BagType.ArenaMedal) {
      character.arena.medals += base.innate.content[1];
      reduceItem(character, item, 1);

      emitMedals(socket, character);
    }
  }

  if (base.innate.boxType === ITEM_TYPES.BoxType.DropTable) {
    const items = dropItems(socket, base.innate.table);

    if (!items.every((item) => addItem(character, item) !== null)) {
      character.unlock?.();
      return error(socket, 'error__not_enough_space');
    } else {
      reduceItem(character, item, 1);
    }
  }

  if (base.innate.boxType === ITEM_TYPES.BoxType.FixedDrop) {
    let allAdded = true;
    const items: Item[] = [];
    const iCount: number[] = [];

    base.innate.content.forEach((irow: number[]) => {
      const _item = createItem(socket, irow[0]);
      setItemAmount(_item, irow[1]);

      const i = addItem(character, _item);

      if (i !== null) {
        items.push(i);
        iCount.push(getItemAmount(i));
      } else {
        allAdded = false;
      }
    });

    if (allAdded) {
      reduceItem(character, item, 1);
    } else {
      items.forEach((i, idx) => reduceItem(character, i, iCount[idx]));
      notice(socket, 'Unable to open item as more space is needed.');
    }
  }

  if (base.innate.boxType === ITEM_TYPES.BoxType.RandomSoul) {
    let soulId = base.innate.content[randomInt(0, base.innate.content.length - 1)];

    reduceItem(character, item, 1);

    for (let i = 0; i < 10; i++) {
      soulId = base.innate.content[randomInt(0, base.innate.content.length - 1)];
      character.bloodlines.souls.push({ id: soulId, level: base.innate.level });
    }

    notice(socket, `Gained {{soul__${soulId}--name}} at level ${base.innate.level}.`);

    socket.emit('updateCharacter', {
      bloodlines: character.bloodlines,
    });
  }
}

export default class UseModule extends GameModule {
  moduleName = 'UseItem';
  modules = {
    useItem,
  };
}
