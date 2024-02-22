import { Monster, Stats } from '../interfaces';
import { IConfig } from 'config';
import { monsterBase } from './monsters';
import { ItemId } from './items';
import { CARDS } from './cards';
import { createItem, createItemOld } from '../modules/items/itemSystem';

interface ConfigGate {
  minLevel: number;
  modes: {
    [type: number]: {
      partyLimit: number;
      locations: number[][][];
      sets: { id: string; items: ItemId[] }[];
      cards: number;
    };
  };
}

interface ConfigGates {
  [id: string]: ConfigGate;
}

interface Gate {
  minLevel: number;
  modes: {
    [type: number]: {
      partyLimit: number;
      locations: Monster[][][];
      sets: { id: string; items: ItemId[] }[];
      cards: number;
    };
  };
}

interface Gates {
  [id: string]: Gate;
}

interface Cards {
  [id: string]: [ItemId, number][];
}

export const Monsters: { [id: string]: Monster } = {};
export const GATES: Gates = {};
export let VALHALLA_CONFIG: { [key: string]: any } = {};
export const VALHALLA_CLIENT_DATA: any = {};

export default function valhallaLoader(config: IConfig) {
  Object.entries(config.get('Valhalla.Monsters') || {}).forEach(
    //@ts-ignore
    (entry) => (Monsters[entry[0]] = { id: entry[0], ...monsterBase, ...(entry[1] as Monster) })
  );

  Object.entries(config.get('Valhalla.Gates') as ConfigGates).forEach(([id, gate]) => {
    GATES[id] = {
      minLevel: gate.minLevel,
      modes: {},
    };

    VALHALLA_CLIENT_DATA[id] = {
      minLevel: gate.minLevel,
      modes: {},
    };

    Object.keys(gate.modes).forEach((key) => {
      GATES[id].modes[Number(key)] = {
        ...gate.modes[Number(key)],
        locations: gate.modes[Number(key)].locations.map((location) => location.map((battle) => battle.map((id) => Monsters[id]))),
      };

      VALHALLA_CLIENT_DATA[id].modes[Number(key)] = {
        cards: CARDS.valhalla[gate.modes[Number(key)].cards].map((line) => line[0]),
        locations: gate.modes[Number(key)].locations.length,
        partyLimit: gate.modes[Number(key)].partyLimit,
        sets: (gate.modes[Number(key)].sets ?? []).map((set) => ({ id: set.id, items: set.items.map((iid) => createItemOld(iid)) })),
      };
    });
  });

  VALHALLA_CONFIG = config.get('Valhalla.Config');
}

export function serverLoaderValhalla(config: IConfig) {
  const monsters: { [id: string]: Monster } = {};
  const gates: Gates = {};
  const clientData: any = {};

  Object.entries(config.get('Valhalla.Monsters') || {}).forEach(
    //@ts-ignore
    (entry) => (monsters[entry[0]] = { id: entry[0], ...monsterBase, ...(entry[1] as Monster) })
  );

  Object.entries(config.get('Valhalla.Gates') as ConfigGates).forEach(([id, gate]) => {
    gates[id] = {
      minLevel: gate.minLevel,
      modes: {},
    };

    clientData[id] = {
      minLevel: gate.minLevel,
      modes: {},
    };

    Object.keys(gate.modes).forEach((key) => {
      gates[id].modes[Number(key)] = {
        ...gate.modes[Number(key)],
        locations: gate.modes[Number(key)].locations.map((location) => location.map((battle) => battle.map((id) => monsters[id]))),
      };

      clientData[id].modes[Number(key)] = {
        cards: CARDS.valhalla[gate.modes[Number(key)].cards].map((line) => line[0]),
        locations: gate.modes[Number(key)].locations.length,
        partyLimit: gate.modes[Number(key)].partyLimit,
        sets: (gate.modes[Number(key)].sets ?? []).map((set) => ({ id: set.id, items: set.items.map((iid) => createItemOld(iid)) })),
      };
    });
  });

  return {
    Monsters: monsters,
    Gates: gates,
    Config: config.get('Valhalla.Config') as { [key: string]: any },
    ClientData: clientData,
  };
}
