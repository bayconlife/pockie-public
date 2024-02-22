import { Depths, Effects } from '../../../enums';

interface EffectData {
  name: string;
  offset: {
    x: number;
    y: number;
  };
  depth?: Depths;
  global?: boolean;
  hidden?: boolean;
}

export const effects: { [key: number]: EffectData } = {
  [-1]: {
    name: 'default',
    offset: { x: 0, y: 0 },
    hidden: true,
  },
  [Effects.ACCELERATE]: {
    name: 'accelerate',
    offset: { x: -92.8, y: -18.1 },
    depth: Depths.BEHIND_CHARACTER,
  },
  [Effects.ANTIBODY]: {
    name: 'antibody',
    offset: { x: 0, y: 0 },
    hidden: true,
  },
  [Effects.BLOODBOIL]: {
    name: 'bloodboil',
    offset: { x: -75.15, y: -63.9 },
  },
  [Effects.BLESS]: {
    name: 'bless',
    offset: { x: -74.2, y: -208.65 },
  },
  [Effects.BURN]: {
    name: 'burn',
    offset: { x: -66.25, y: -161.05 },
  },
  [Effects.CLOUD]: {
    name: 'cloud',
    offset: { x: -62.45, y: -192.4 },
  },
  [Effects.DETONATING_CLAY]: {
    name: 'detonating_clay',
    offset: { x: -25.7, y: -146.75 },
  },
  [Effects.DIZZY]: {
    name: 'dizzy',
    offset: { x: -64.65, y: -137.2 },
  },
  [Effects.DOOR_ONE]: {
    name: 'door_one',
    offset: { x: -129.5, y: -101.4 },
  },
  [Effects.DOOR_TWO]: {
    name: 'door_one',
    offset: { x: -129.5, y: -101.4 },
  },
  [Effects.DOOR_THREE]: {
    name: 'door_one',
    offset: { x: -129.5, y: -101.4 },
  },
  [Effects.DOOR_FOUR]: {
    name: 'door_one',
    offset: { x: -129.5, y: -101.4 },
  },
  [Effects.DOOR_FIVE]: {
    name: 'door_one',
    offset: { x: -129.5, y: -101.4 },
  },
  [Effects.DOOR_SIX]: {
    name: 'door_one',
    offset: { x: -129.5, y: -101.4 },
  },
  [Effects.DOOR_SEVEN]: {
    name: 'door_one',
    offset: { x: -129.5, y: -101.4 },
  },
  [Effects.DOOR_EIGHT]: {
    name: 'door_one',
    offset: { x: -129.5, y: -101.4 },
  },
  [Effects.DOUBLE_MP]: {
    name: 'vessel',
    offset: { x: -34.6, y: -79.6 },
  },
  [Effects.DRAIN]: {
    name: 'drain',
    offset: { x: -25.1, y: -138.0 },
  },
  [Effects.ELEMENTAL_SEAL]: {
    name: 'elemental_seal',
    offset: { x: -36.05, y: -58.85 },
  },
  [Effects.FROZEN]: {
    name: 'frozen',
    offset: { x: -96.0, y: -152.45 },
  },
  [Effects.GHOST]: {
    name: 'ghost',
    offset: { x: -62.7, y: -89.1 },
  },
  [Effects.HEAL]: {
    name: 'heal',
    offset: { x: -81.8, y: -109.15 },
  },
  [Effects.LIQUOR]: {
    name: 'liquor',
    offset: { x: -44.5, y: -145.45 },
  },
  [Effects.MARK]: {
    name: 'mark',
    offset: { x: -68.85, y: -111.9 },
  },
  [Effects.MIST]: {
    name: 'mist',
    offset: { x: -50.0, y: -50.0 },
    global: true,
  },
  [Effects.MUD_WALL]: {
    name: 'bless',
    offset: { x: 0, y: 0 },
  },
  [Effects.PARALYSIS]: {
    name: 'paralyze',
    offset: { x: -48.1, y: -74.65 },
  },
  [Effects.POISON]: {
    name: 'poison',
    offset: { x: -45.45, y: -96.3 },
  },
  [Effects.CHARM]: {
    name: 'seduction',
    offset: { x: -83.45, y: -100.25 },
  },
  [Effects.SLOW]: {
    name: 'slow',
    offset: { x: -57.0, y: 13.0 },
    depth: Depths.BEHIND_CHARACTER,
  },
  [Effects.SNARED]: {
    name: 'snared',
    offset: { x: -93.25, y: -86.25 },
  },
  [Effects.STATIC]: {
    name: 'static',
    offset: { x: -97.15, y: -117.1 },
  },
  [Effects.SUBSTITUTE]: {
    name: 'bless',
    offset: { x: 0, y: 0 },
  },
  [Effects.SUNSET]: {
    name: 'sunset',
    offset: { x: -50.0, y: -50.0 },
    global: true,
  },
  [Effects.WEAK]: {
    name: 'weak',
    offset: { x: -72.45, y: -89.65 },
  },
};
