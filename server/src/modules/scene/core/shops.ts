import { Callback, SocketFunction } from '../../../types';
import { CustomSocket, Item } from '../../../interfaces';
import { ItemLocations, ItemType } from '../../../enums';
import { Shop, Shops } from '../../../resources/shops';
import { emitStones } from '../../character/character';
import { createItem, emitItems, getItemSizes, getItemType, setItemLocation, setItemPosition } from '../../items/itemSystem';
import { randomInt } from '../../../components/random';
import { addItem } from '../../items/inventory';
import { GameModule, User } from '../../../components/classes';
import { error } from '../../../modules/kernel/errors';
import { addLines } from '../../../modules/drop/drops';
import { onLogin } from '../../../modules/kernel/pubSub';

const MODULE_NAME = 'Shops';
const inventoryRowLength = 10;
const inventoryRows = 8;
const itemTypesWithLines = [
  ItemType.Weapon,
  ItemType.Gloves,
  ItemType.Ring,
  ItemType.Amulet,
  ItemType.Helm,
  ItemType.Body,
  ItemType.Belt,
  ItemType.Shoes,
];

onLogin(MODULE_NAME, (socket, character) => {
  if (character.shops.black === undefined) {
    const shopId = 1021 + Math.floor((character.level - 1) / 10);

    character.shops.black = {
      lastRefresh: Date.now(),
      refreshCost: Shops[shopId].refreshCost,
      items: generateShopItems(socket, shopId, Shops[shopId].amount),
    };
  }
});

const buyItem: SocketFunction<{ shopId: number; uid: string }> = async (socket, character, data, cb) => {
  let shop = character.shops.normal;

  if (data.shopId === 3) shop = character.shops.pet;
  if (data.shopId === 4) shop = character.shops.food;
  if (data.shopId === 5) shop = character.shops.black;

  const idx = shop.items.findIndex((i) => i.uid === data.uid);

  if (idx === -1) {
    return socket.emit('error', 'Invalid item.');
  }

  if (character.stones < shop.items[idx].props.price) {
    return socket.emit('error', 'Not enough stones.');
  }

  const price = shop.items[idx].props.price;
  const item = addItem(character, shop.items[idx]);

  if (item === null) {
    return socket.emit('error', 'Inventory full.');
  }

  if (data.shopId === 5) {
    const roll = randomInt(1, 1000);
    let idx = 0;
    const range = [0, 700, 249, 50, 1];
    // const range = [0, 0, 0, 0, 1000];

    for (let i = 0, sum = 0; i < range.length; i++) {
      if (sum + range[i] >= roll) {
        idx = i;
        break;
      }
    }

    addLines(socket, item, idx);
  }

  character.stones -= price;
  shop.items.splice(idx, 1);

  delete character.items[item.uid].props.price;

  cb(item);
};

export async function emitShops(socket: CustomSocket, character: User) {
  socket.emit('updateShops', character.shops);
}

export function generateShopItems(socket: CustomSocket, shop: number, amount: number) {
  const items: Item[] = [];
  const shopInfo = Shops[shop];
  const positions: number[] = [];
  const shopItems = [...shopInfo.items];

  const findNextPosition = (item: Item) => {
    const { width, height } = getItemSizes(item);

    for (let i = 0; i < inventoryRows * inventoryRowLength; i++) {
      let valid = true;

      for (let h = 0; h < height; h++) {
        for (let w = 0; w < width; w++) {
          if (positions.includes(i + w + h * inventoryRowLength)) {
            valid = false;
            break;
          }

          const invalidVertical = i + width + height * inventoryRowLength > (inventoryRows + 1) * inventoryRowLength;
          const invalidHorizontal = (i % inventoryRowLength) + width > inventoryRowLength;

          if (invalidVertical || invalidHorizontal) {
            valid = false;
            break;
          }
        }

        if (!valid) {
          break;
        }
      }

      if (valid) {
        for (let h = 0; h < height; h++) {
          for (let w = 0; w < width; w++) {
            positions.push(i + w + h * inventoryRowLength);
          }
        }

        return i;
      }
    }

    return -1;
  };

  for (let i = 0; i < amount; i++) {
    const idx = randomInt(0, shopItems.length - 1);
    const line = shopItems[idx];
    const item = createItem(socket, line.item);

    if ((shopInfo.type ?? 0) === 0 && itemTypesWithLines.includes(getItemType(item))) {
      // && randomInt(0, 9) < 4) {
      addLines(socket, item, 4);
    }

    shopItems.splice(idx, 1);

    setItemLocation(item, ItemLocations.Shop);
    setItemPosition(item, findNextPosition(item));
    item.props.price = line.price;

    items.push(item);
  }

  return items;
}

const getShopItems: SocketFunction = async (socket, character, data, cb) => {
  emitShops(socket, character);
  cb(Date.now());
};

const refreshShop: SocketFunction<number> = async (socket, character, shopType, cb) => {
  let shop = 'normal';
  let shopId = Shop.Normal_Max_Level_10;
  let cost = character.shops.normal.refreshCost;
  const level = character.level;

  if (3 <= level && level <= 10) {
    shopId = Shop.Normal_Max_Level_10;
  } else if (11 <= level && level <= 20) {
    shopId = Shop.Normal_Max_Level_20;
  } else if (21 <= level && level <= 30) {
    shopId = Shop.Normal_Max_Level_30;
  } else if (31 <= level && level <= 40) {
    shopId = Shop.Normal_Max_Level_40;
  } else if (41 <= level && level <= 50) {
    shopId = Shop.Normal_Max_Level_50;
  } else if (51 <= level && level <= 60) {
    shopId = Shop.Normal_Max_Level_60;
  } else if (61 <= level && level <= 70) {
    shopId = Shop.Normal_Max_Level_70;
  } else if (71 <= level && level <= 80) {
    shopId = Shop.Normal_Max_Level_80;
  } else if (81 <= level && level <= 90) {
    shopId = Shop.Normal_Max_Level_90;
  }

  if (shopType === 3) {
    shop = 'pet';
    shopId = 5000;
  } else if (shopType === 4) {
    shop = 'food';
    shopId = 6000;
  } else if (shopType === 5) {
    shop = 'black';
    shopId = 1021 + Math.floor((character.level - 1) / 10);
  } else {
    shop = 'normal';
  }

  // @ts-ignore
  character.shops[shop] = {
    lastRefresh: Date.now(),
    refreshCost: Shops[shopId].refreshCost,
    items: generateShopItems(socket, shopId, Shops[shopId].amount),
  };

  cost = Shops[shopId].refreshCost;

  if (character.stones < cost) {
    return error(socket, 'Invalid stones');
  }
  character.stones -= cost;

  return [emitShops, emitStones];
};

export default class ShopModule extends GameModule {
  moduleName = MODULE_NAME;
  modules = {
    shop: getShopItems,
    buyItem,
    refreshShop,
  };
}
