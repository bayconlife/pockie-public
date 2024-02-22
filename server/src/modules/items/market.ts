import { SocketFunction } from '../../types';
import { GameModule } from '../../components/classes';
import { createItem, emitItems, getItem, getItemAmount, getItemBound, reduceItem, removeItem, setItemBound } from './itemSystem';
import { error, errorInvalidItem } from '../kernel/errors';
import { query } from '../../infrastructure/db';
import { CONTAINER_INVENTORY } from './inventory';
import { emitStones } from '../character/character';
import { addItemToContainer, doesContainerHaveSpace } from './container';
import { updateCharacter, updatePossibleCharacter } from '../kernel/cache';
import { emitItemPatches } from './patches';
import { createAddItemPatch } from './patches/inventoryPatch';

const MODULE_NAME = 'Market';

const marketBuyItem: SocketFunction<number> = async (socket, character, id, cb) => {
  const itemRes = await query((client) => {
    return client.query('SELECT * FROM market WHERE id=$1', [id]);
  });

  if (itemRes === null || itemRes.rowCount !== 1) {
    return error(socket, 'error__sale_not_found');
  }

  if (character.stones < itemRes.rows[0].price) {
    return error(socket, 'error__not_enough_currency');
  }

  const item = itemRes.rows[0].data;

  item.isBound = true;

  if (!doesContainerHaveSpace(character, item, CONTAINER_INVENTORY)) {
    return error(socket, 'error__inventory_full');
  }

  if (addItemToContainer(character, item, CONTAINER_INVENTORY)) {
    try {
      const removeRes = await query((client) => {
        return client.query('DELETE FROM market WHERE id=$1', [id]);
      });

      if (removeRes === null || removeRes.rowCount !== 1) {
        reduceItem(character, item, getItemAmount(item));
        return error(socket, 'error__cannot_remove_market_item');
      }

      await updatePossibleCharacter(itemRes.rows[0].account_id, socket.getServerId(), (c) => {
        c.stones += Number(itemRes.rows[0].price);
      });

      character.stones -= Number(itemRes.rows[0].price);

      emitItemPatches(socket, [createAddItemPatch(item)]);
    } catch (err) {
      reduceItem(character, item, getItemAmount(item));
    }
  } else {
    return error(socket, 'error__inventory_full');
  }

  cb();

  return [emitStones];
};

const marketCancelSell: SocketFunction<number> = async (socket, character, id, cb) => {
  const itemRes = await query((client) => {
    return client.query('SELECT data FROM market WHERE id=$1 AND account_id=$2 AND server_id=$3', [
      id,
      socket.getAccountId(),
      socket.getServerId(),
    ]);
  });

  if (itemRes === null || itemRes.rowCount === 0) {
    return error(socket, 'error__cannot_fetch_market_items');
  }

  const item = itemRes.rows[0].data;

  if (!doesContainerHaveSpace(character, item, CONTAINER_INVENTORY)) {
    return error(socket, 'error__inventory_full');
  }

  if (addItemToContainer(character, item, CONTAINER_INVENTORY)) {
    try {
      const removeRes = await query((client) => {
        return client.query('DELETE FROM market WHERE id=$1 AND account_id=$2 AND server_id=$3', [
          id,
          socket.getAccountId(),
          socket.getServerId(),
        ]);
      });

      if (removeRes === null || removeRes.rowCount !== 1) {
        reduceItem(character, item, getItemAmount(item));
        return error(socket, 'error__cannot_remove_market_item');
      }
    } catch (err) {
      reduceItem(character, item, getItemAmount(item));
    }
  } else {
    reduceItem(character, item, getItemAmount(item));
  }

  cb();

  return [emitItems];
};

const marketGetItemsForSale: SocketFunction = async (socket, character, _, cb) => {
  const itemsRes = await query((client) => {
    return client.query('SELECT account_id, id, data, price, expiration FROM market WHERE expiration > to_timestamp($1)', [
      Date.now() / 1000,
    ]);
  });

  if (itemsRes === null) {
    return error(socket, 'error__cannot_fetch_market_items');
  }

  cb(
    itemsRes.rows.map((item) => ({
      ...item,
      expiration: item.expiration - Date.now(),
    }))
  );
};

const marketGetItemsIAmSelling: SocketFunction = async (socket, character, _, cb) => {
  const itemsRes = await query((client) => {
    return client.query('SELECT account_id, id, data, price, expiration FROM market WHERE account_id=$1 AND server_id=$2', [
      socket.getAccountId(),
      socket.getServerId(),
    ]);
  });

  if (itemsRes === null) {
    return error(socket, 'error__cannot_fetch_market_items');
  }

  cb(
    itemsRes.rows.map((item) => ({
      ...item,
      expiration: item.expiration - Date.now(),
    }))
  );
};

const marketSellItem: SocketFunction<{ uid: string; price: number }> = async (socket, character, { uid, price }, cb) => {
  const item = getItem(character, uid);

  if (price < 1 || price > 10000000000) {
    return error(socket, 'error__invalid_price');
  }

  if (item === undefined) {
    return errorInvalidItem(socket);
  }

  if (getItemBound(item)) {
    return error(socket, 'error__cannot_sell_bound_item');
  }

  const querySellingItemsCount = await query((client) => {
    return client.query('SELECT COUNT(id) FROM market WHERE account_id=$1 AND server_id=$2', [socket.getAccountId(), socket.getServerId()]);
  });

  if (querySellingItemsCount === null || querySellingItemsCount.rows[0].count >= 10) {
    return error(socket, 'error__max_item_sell_limit');
  }

  let itemToInsert = item;

  if (getItemAmount(item)) {
    // split item
    itemToInsert = createItem(socket, character.items[uid].iid);
  }

  setItemBound(itemToInsert, 0);

  const expiration = new Date(Date.now());

  expiration.setDate(expiration.getDate() + 7);

  const qRes = await query((client) => {
    return client.query('INSERT INTO market(account_id, server_id, data, price, expiration) VALUES ($1, $2, $3, $4, to_timestamp($5))', [
      socket.getAccountId(),
      socket.getServerId(),
      itemToInsert,
      Number(price),
      expiration.getTime() / 1000,
    ]);
  });

  if (qRes === null || qRes.rowCount === 0) {
    return error(socket, 'error__selling_item_failed');
  }

  if (itemToInsert.uid === item.uid) {
    removeItem(character, item);
  } else {
    reduceItem(character, item, 1);
  }

  cb();

  return [emitItems];
};

export default class MarketModule extends GameModule {
  moduleName = MODULE_NAME;
  modules = {
    marketBuyItem,
    marketCancelSell,
    marketSellItem,
    marketGetItemsForSale,
    marketGetItemsIAmSelling,
  };
}
