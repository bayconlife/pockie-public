import { ItemBaseData, ItemId } from '../../resources/items';
import { random, randomInt } from '../../components/random';
import { DropTable } from '../../types';
import { createItem, getItemType, setItemBound } from '../items/itemSystem';
import { CustomSocket, Item, Line } from '../../interfaces';
import { GENERIC_LINES, itemLines, LINE_GROUPS, LINES } from '../../resources/lines';
import { DropTables } from '../../resources/dropTables';
import { ItemType } from '../../enums';
import { updatePetToMatchLevel } from '../items/pets';
import { testDropsAddLines } from './testDrops';

function getBaseValidLines(item: Item) {
  let validLines: number[] = [];

  if (item.iid in itemLines) {
    validLines = [...LINE_GROUPS[itemLines[item.iid][0] ?? 1001]];
  } else if (getItemType(item) in GENERIC_LINES) {
    let dropLevel = item.props.level;

    while (dropLevel > 0 && !(dropLevel in GENERIC_LINES[getItemType(item)])) {
      dropLevel -= 1;
    }

    GENERIC_LINES[getItemType(item)][dropLevel]?.forEach((lineId) => validLines.push(...LINE_GROUPS[lineId]));
  }

  return validLines;
}

export function addLines(socket: CustomSocket, item: Item, propCount: number) {
  let validLines: number[] = [];

  if (socket.getConfig().Modules.includes('TestDrops')) {
    validLines = testDropsAddLines(socket, item, propCount);
  } else {
    validLines = getBaseValidLines(item);
  }

  if (item.props.lines === undefined) {
    item.props.lines = [];
  }

  if (validLines.length === 0) {
    return item;
  }

  validLines = validLines.filter((validLine) => item.props.lines.find((line: any) => line.stat === LINES[validLine].stat) === undefined);

  for (let i = 0; i < propCount; i++) {
    const idx = randomInt(0, validLines.length - 1);
    const lineId = validLines[idx];
    const line = LINES[lineId];
    const roll = randomInt(line.min, line.max);

    validLines = validLines.filter((validLine) => LINES[validLine].stat !== line.stat);
    item.props.lines.push({ ...line, roll: roll, id: lineId });
  }

  return item;
}

export function createDropItem(socket: CustomSocket, itemId: ItemId, propCount: number, isBound: number): Item {
  const item = createItem(socket, itemId);

  setItemBound(item, isBound);

  if (propCount >= 0) {
    addLines(socket, item, propCount);
  }

  return item;
}

export function dropItems(socket: CustomSocket, dropTable: DropTable = 0, modifier: number = 0) {
  const dropTables = socket.getConfig().DropTables.Tables;
  const allItems = socket.getConfig().Items.Items;

  if (dropTable === 0) {
    return [];
  }

  if (dropTables[dropTable].roll === 1) {
    return weightedRolls(socket, allItems, dropTables, dropTable, modifier);
  }

  if (dropTables[dropTable].amount === 0) {
    return tryAllDropsOnTable(socket, dropTables, dropTable, modifier); //500000);
  }

  const drops = tryAllDropsOnTable(socket, dropTables, dropTable, modifier);
  const items: Item[] = [];

  if (dropTables[dropTable].amount > drops.length) {
    return drops;
  }

  for (let i = 0; i < dropTables[dropTable].amount; i++) {
    items.push(...drops.splice(randomInt(0, drops.length - 1), 1));
  }

  return items;
}

export function tryAllDropsOnTable(socket: CustomSocket, dropTables: DropTables, dropTable: DropTable, dropChanceIncrease: number) {
  const items: Item[] = [];

  dropTables[dropTable].items.forEach(([itemId, propCount, isBound, chance]) => {
    chance = chance;
    const totalChance = chance + (chance * dropChanceIncrease) / 100;
    const r = random(0, 100);

    if (r < totalChance) {
      items.push(createDropItem(socket, itemId, propCount, isBound));
    }
  });

  return items;
}

export function weightedRolls(
  socket: CustomSocket,
  allItems: ItemBaseData,
  dropTables: DropTables,
  dropTableId: DropTable,
  dropChanceIncrease: number
) {
  const dropTable = dropTables[dropTableId];
  const total = dropTable.items.reduce((sum, line) => (sum += line[3]), 0);

  function roll() {
    const roll = randomInt(1, total);
    let cur = 0;

    const itemIndex = dropTable.items.findIndex((line) => {
      cur += line[3];

      if (roll <= cur) {
        return true;
      }

      return false;
    });

    if (itemIndex !== -1) {
      return dropTable.items[itemIndex];
    }

    return null;
  }

  const items: Item[] = [];

  for (let i = 0; i < dropTable.amount; i++) {
    const dropRow = roll();

    if (dropRow === null) {
      continue;
    }

    const item = createDropItem(socket, dropRow[0], dropRow[1], dropRow[2]);

    if (item !== null) {
      if (dropRow.length > 4) {
        if (allItems[item.iid].type === ItemType.Pet) {
          item.props.level = dropRow[4];
          updatePetToMatchLevel(item);
        }

        if (allItems[item.iid].type === ItemType.Avatar) {
          item.props.level = dropRow[4];
        }
      }

      items.push(item);
    }
  }

  return items;
}
