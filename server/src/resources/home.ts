import { IConfig } from 'config';
import { createItem, createItemOld } from '../modules/items/itemSystem';
import { Item } from '../interfaces';

export let FARM_ITEMS: [Item, number, number][] = [];

export function serverHomeLoader(config: IConfig) {
  const farm = config.get('Home.Farm') as { [iid: number]: { cost: number; time: number } };
  FARM_ITEMS = Object.keys(farm).map((iid) => [createItemOld(Number(iid)), farm[Number(iid)].cost, farm[Number(iid)].time]);

  return {
    FARM_CONFIG: farm,
    FARM_ITEMS,
  };
}
