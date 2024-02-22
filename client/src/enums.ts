export enum CharacterAnimation {
  /** 52 */
  ATTACK = '52',
  /** 53 */
  ATTACK_2 = '53',
  /** 54 */
  ATTACK_3 = '54',
  /** 69 */
  BLOCK = '69',
  /** 2 */
  BOMB_KICK = '2',
  /** 3 */
  BOMB_THROW = '3',
  /** 203 */
  BOMB_KNOCKBACK = '203',
  /** 7 */
  BUFF = '7',
  /** 57 */
  DEAD = '57',
  /** 68 */
  DODGE = '68',
  /** 17 */
  GREAT_STRENGTH = '17',
  /** 63 */
  HURT_LITE = '63',
  /** 64 */
  HURT_HEAVY = '64',
  /** 999 */
  IDLE = '999',
  /** 6 */
  JUTSU = '6',
  /** 67 */
  KISS = '67',
  /** 55 */
  MOVE = '55',
  /** 66 */
  REVIVE = '66',
  /** 51?? */
  SPIN = '51',
  /** 72 */
  TAUNT = '72',
  /** 59 */
  WIN = '59',
  /** 21 */
  WINDUP_ATTACK = '21',
  /** 75 */
  ZONE_ENTRANCE = '75',
  SECRET_TECHNIQUE = 'secret_technique',
  SPECIAL = '18',
  SECRET_TECHNIQUE_1_1 = 'secret_technique_1_1',
}

export enum Depths {
  BASE = 0,
  BEHIND_CHARACTER = 10,
  CHARACTER = 20,
  IN_FRONT_OF_CHARACTER = 30,
  COMBAT_UI = 35,
}

export enum Effects {
  INIT = 8888,
  PRAYER = 11111,
  PARALYSIS = 11801,
  FROZEN = 11802, // 11802
  BURN = 11804, // 11804, 11840 is a stand in?
  LIQUOR = 11806,
  GHOST = 11808,
  SLOW = 11810,
  POISON = 11811,
  ELEMENTAL_SEAL = 11812,
  DIZZY = 11813,
  BLOODBOIL = 11814, // Recieve 20% recoil damage when using chakara-based skills
  CHARM = 11815,
  SNARED = 11816,
  DOOR_ONE = 11819,
  DETONATING_CLAY = 11820,
  MIST = 11821,
  SUNSET = 11822,
  MARK = 11823,
  MUD_WALL = 11824,
  ACCELERATE = 11825,
  CLOUD = 11827,
  STATIC = 11831,
  BLESS = 11832,
  WEAK = 11833,
  HEAL = 11834,
  DRAIN = 11836, // Inflicted by Death Mirage Jutsu, drains hp and chakra until the enemy uses a chakra based skill
  DOUBLE_MP = 11839, //Vessel Destroy??
  SUBSTITUTE = 11840,
  DOOR_TWO = 11844,
  DOOR_THREE = 11845,
  DOOR_FOUR = 11846,
  DOOR_FIVE = 11847,
  DOOR_SIX = 11848,
  DOOR_SEVEN = 11849,
  DOOR_EIGHT = 11850,
  ANTIBODY = 11875,
  ELEMENT_MASTERY = 11905,
  THUNDER = 11909,
}

export enum FightStat {
  SHIELD = 1,
  SPEED = 2,
}

export enum ItemLocation {
  Inscribe = 40,
  Enhance = 50,
  EnhanceTalisman = 51,
  Refine = 52,
  RefineTalisman = 53,
  GemCreateSlot = 54,
  GemCreateSlotTalisman = 55,
  GemRemove = 56,
  Enchant = 57,
  EnchantStone = 58,
  BossTicket = 60,
  Pet = 200,
  PetTracing = 229,
  PetStorage = 230,
  ImpressItem = 350,
  ImpressBlade = 351,
  ImpressStone = 352,
  RerollPet = 400,
}

export enum ItemType {
  Missing = -1,
  Avatar = 0,
  Weapon,
  Gloves,
  Pet,
  Ring,
  Amulet,
  Helm,
  Body,
  Belt,
  Shoes,
  Task = 10,
  Gem = 11,
  Etc = 15,
  Pharmacy = 16,
  Crop = 17,
  Enchantment = 40,
  Box = 45,
  PetSkillBook = 49,
  BossTicket = 60,
  Impress = 350,
  ImpressRate = 351,
  WishingPot = 450,
}

export enum QuestState {
  NONE,
  CANT_ACCEPT,
  AVAILABLE,
  IN_PROGRESS,
  INTERACT,
  TURN_IN,
}

export enum QuestType {
  COLLECT = 1,
  KILL,
  TALK,
  GIVE_ITEM = 6,
}

export enum Scene {
  NONE = -1,
  NEW_PLAYER = 1,
  ARENA = 2,
  LAS_NOCHES_PART_ONE = 61,
  FIRE_VILLAGE = 111,
  WATER_VILLAGE = 211,
  LIGHTNING_VILLAGE = 311,
  WIND_VILLAGE = 411,
  EARTH_VILLAGE = 511,
  ANGEL_CITY = 161,
  Demon_City = 171,
  SMELTING_MOUNTAIN = 2101,
  EVENTIDE_BARREN = 2102,
  FIERY_RIDGE = 2103,
  CROSSROADS = 2601,
  Dawning_Wilds = 2602,
  Surprise_Village = 2603,
  Glowing_Forest = 2604,
  Eerie_Passage = 2605,
  Abandoned_Evernight_City = 2701,
  Soulshatter_Valley = 2702,
  Marsh_Of_Death = 2703,
  Plains_Of_Despair = 2704,
  Dragontame_Valley = 2801,
  Dragontame_Forest = 2802,
  Dragontame_Coast = 2803,
  Amegakure = 2804,
  Las_Noches = 3101,
  Home = 4101,
  Valhalla = 5001,
  Dungeon = 5002,
}

export enum SiteState {
  LANDING,
  GAME_LOADER,
  GAME,
}

export enum GameState {
  ARENA,
  FIELD,
  NEW_PLAYER,
  VILLAGE,
  DEMON,
  LAS_NOCHES,
  HOME,
}

export enum WeaponType {
  BLUNT,
  SHARP,
  CLAWS,
}
