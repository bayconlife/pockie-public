const { LineGroup } = require("./lines");

const ItemType = {
  Avatar: 0,
  Weapon: 1,
  Gloves: 2,
  Pet: 3,
  Ring: 4,
  Amulet: 5,
  Helm: 6,
  Body: 7,
  Belt: 8,
  Shoes: 9,
  Gem: 11,
  Food: 12,
  Task: 14,
  Etc: 15,
  Pharmacy: 16,
  Crop: 17,

  Box: 45 
}

const BoxType = {
	RandomOutfit: 1,
	SelectOutfit: 2,
  RandomItem: 3,
}

const Item = {
  // Task Items
  Young_Eagle_Drop: 140001,
  Stinger: 140006,
  Straw_Hat: 140008,
  Ghost_Drop: 140010,
  Kappa_Drop: 140011,
  Wild_Monk_Drop: 140012,
  Magic_Flute_Demon_Drop: 140013,
  Eater_Drop: 140015,
  Sushi_Roll: 140028,
  Ninja_Scarf: 140030,
  Corn_Drop: 140031,
  Honey: 140033,
  Rice_Ball: 140034,
  Green_Frog_Drop: 140039,
  Mouse_Drop: 140048,
  Buns_Drop: 140049,
  Pork_Gangster_Drop: 140050,
  Magic_General_Drop: 140054,

  Bomb: 150301,
  i150337: 150337,
  Pink_Gem: 159026,

  BLUE_TOURMALINE: 210101,
  PURPLE_TOURMALINE: 210102,
  DEEP_BLUE_PENDANT: 210103,
  ROSE_RESOLVE: 210104,
  ROREN_RESOLVE: 210105,
  MAJESTIC_HEART: 210106,
  COLD_START_NECKLACE: 210107,
  STONE_TOOTH_NECKLACE: 210108,
  BRAVE: 210109,

  CHILDS_HAT: 220101,
  IRON_WOK: 220102,
  LEATHER_CAP: 220103,
  HIDDEN_TOWEL: 220104,
  FIRE_CLOUD_CAP: 220105,
  BEN_LEOPARD_HELMET: 220106,
  HANYOU_HELMET: 220107,
  PURPLE_METEOR_HELMET: 220108,
  DEMON_BATTLE_HELMET: 220109,

  CHILDS_SHOES: 230101,
  IRON_WARBOOTS: 230102,
  LEATHER_BOOTS: 230103,
  HIDDEN_BOOTS: 230104,
  FIRE_CLOUD_BOOTS: 230105,
  LEOPARD_BOOTS: 230106,
  COLD_BARTER: 230107,
  PURPLE_BOOTS: 230108,
  ROYAL_WIND_BOOTS: 230109,

  CHILDS_ARMOR: 240101,
  VILLAGE_ARMOR: 240102,
  IRONPLATE_ARMOR: 240103,
  VIBRANT_GARMENT: 240104,
  LIGHT_LEATHER_CHEST: 240105,
  TURTLE_FAIRY_BEAST_ARMOR: 240106,
  HIDDEN: 240107,
  CAT_JERSEY: 240108,
  FIRE_CLOUD_ARMOR: 240109,
  WIND_LAI: 240110,
  BEN_LEOPARD_LIGHT_ARMOR: 240111,
  KING_KONG_ARMOR: 240112,
  HANYOU_WAR_ARMOR: 240113,
  CANG_LING_WARFRAME: 240114,
  PURPLE_METEORITE_ARMOR: 240115,
  BROKEN_LIGHT_ARMOR: 240116,
  PENGLAI_XIANYI: 240117,
  DRAGON_WARFRAME: 240118,

  WOODEN_CLUB: 250101,
  WOLF_FANG_BAT: 250102,
  HAMMER_OF_BLESSING: 250103,
  MYTHBEAST_BAT: 250104,
  EARTHSHAKER_HAMMER: 250105,
  PUNCHING_BAT: 250106,
  STARLIGHT_STAFF: 250107,
  OCTAGON_HAMMER: 250108,
  PUMPKIN_HAMMER: 250109,
  BRAMBLE_BAT: 250110,
  RHAPSODY_HAMMER: 250111,
  DRAGONFANG_HAMMER: 250112,
  SKY_SHOCK_PIERCER: 250113,
  CRABHAMMER: 250114,
  AMYTHEST_AXE: 250115,
  TIGER_HAMMER: 250116,
  DOOM_HAMMER: 250117,
  BERYL_AXE: 250118,

  KITCHEN_BLADE: 260101,
  POWERFUL_PIERCE: 260102,
  BONE_PIERCER: 260103,
  TRENDY_TRIDENT: 260104,
  WINDSTRIKE_SABER: 260105,
  SEVERING_SLASH: 260106,
  SWIFT_SLICER: 260107,
  CLOUDFLOW_SWORD: 260108,
  SUNSET_PIERCE: 260109,
  KIKUMON_SWORD: 260110,
  JADESHADE_SWORD: 260111,
  NETHER_SLASH: 260112,
  CLOUDBREAK_BLADE: 260113,
  BLOODFIEND_SABER: 260114,
  FISHBONE_SWORD: 260115,
  GOLDBACK_SABER: 260116,
  CLOUD_WING_SWORD: 260117,
  PUPIL_BLADE: 260118,

  SWIPING_FISTS: 270101,
  SHARP_BLADECLAWS: 270102,
  RAVENOUS_WOLFCLAWS: 270103,
  BANANA_FISTS: 270104,
  AZURE_FISTBLADE: 270105,
  SHADOW_CLAW: 270106,
  GRIZZLY_CLAW: 270107,
  RED_LOTUS_CLAW: 270108,
  SILVERSHARK_CLAW: 270109,
  WINDLING_CLAW: 270110,
  FLYWING_CLAW: 270111,
  ANCHOR_FISTS: 270112,
  DEMON_RUNE_CLAW: 270113,
  RESPECTED_CLAW: 270114,
  PINCER_FISTS: 270115,
  STREAMRAW_CLAW: 270116,
  EMPERORS_CLAW: 270117,
  FIXED_SOUL_CLAW: 270118,

  BAMBOO_GLOVES: 280101,
  PITCHERS_GLOVES: 280102,
  TURTLE_FAIRY_GLOVES: 280103,
  CAT: 280104,
  WIND_LINED_HAND: 280105,
  KING_KONG_GLOVES: 280106,
  HANYOU_HANDLE: 280107,
  PURPLE_METEOR_GLOVES: 280108,
  BROKEN_MAGIC_HANDLE: 280109,

  GOLDJADE_RING: 300101,
  FIERY_RING: 300102,
  CANG_KI_PEIJIE: 300103,
  TULIP: 300104,
  ABUNDANCE: 300105,
  LOVING: 300106,
  HAN_XING_PEI: 300107,
  PEPTIC_PENDANT: 300108,
  DARKENING: 300109,

  BAMBOO_BELT: 310101,
  PITCHERS_BELT: 310102,
  TURTLE_FAIRY_BELT: 310103,
  CAT_BELT: 310104,
  WIND_BID_BELT: 310105,
  DIAMOND_BELT: 310106,
  COLD_BELT: 310107,
  PURPLE_METEOR_BELT: 310108,
  BI_LUO_BELT: 310109,
  
  AVATAR_GGIO: 290003,
  AVATAR_LOVE: 290009,
  AVATAR_RENJI: 290014,
  AVATAR_CHOJI: 290016,
  AVATAR_KIBA: 290017,
  AVATAR_NANAO: 290032,
  AVATAR_MOMO: 290033,
  AVATAR_RANGIKU: 290034,
  AVATAR_SHIZUNE: 290039,
  AVATAR_TENTEN: 290063,
  AVATAR_NEMU: 290065,
}

const FoodItems = {
  120001: { type: ItemType.Food, innate: { level: 21, buff: 42103, hunger: 100, type: 2 }, value: 32 }, //
  120002: { type: ItemType.Food, src: 'foods/82', innate: { level: 1, buff: 50001, duration: 10800, hunger: 100, type: 7 }, value: 32 }, // 100% Exp boost
  120003: { type: ItemType.Food, src: 'foods/83', innate: { level: 1, buff: 50002, hunger: 100, type: 7 }, value: 28 }, //
  120004: { type: ItemType.Food, innate: { level: 1, buff: 50003, hunger: 80, type: 7 }, value: 21 }, //
  120005: { type: ItemType.Food, innate: { level: 71, buff: 47103, hunger: 100, type: 3 }, value: 32 }, //
  120006: { type: ItemType.Food, innate: { level: 71, buff: 47101, hunger: 100, type: 2 }, value: 32 }, //
  120007: { type: ItemType.Food, innate: { level: 71, buff: 47102, hunger: 100, type: 2 }, value: 32 }, //
  120008: { type: ItemType.Food, innate: { level: 71, buff: 47113, hunger: 80, type: 3 }, value: 21 }, //
  120009: { type: ItemType.Food, innate: { level: 71, buff: 47111, hunger: 80, type: 2 }, value: 21 }, //
  120010: { type: ItemType.Food, innate: { level: 71, buff: 47112, hunger: 80, type: 4 }, value: 21 }, //
  120011: { type: ItemType.Food, innate: { level: 1, buff: 50004, hunger: 100, type: 7 }, value: 32 }, //
  120012: { type: ItemType.Food, innate: { level: 1, buff: 50005, hunger: 100, type: 7 }, value: 32 }, //
  120019: { type: ItemType.Food, innate: { level: 21, buff: 42101, hunger: 100, type: 5 }, value: 32 }, //
  120020: { type: ItemType.Food, innate: { level: 31, buff: 43101, hunger: 100, type: 5 }, value: 32 }, //
  120021: { type: ItemType.Food, innate: { level: 31, buff: 43102, hunger: 100, type: 5 }, value: 32 }, //
  120022: { type: ItemType.Food, innate: { level: 31, buff: 43103, hunger: 100, type: 2 }, value: 32 }, //
  120023: { type: ItemType.Food, innate: { level: 41, buff: 44101, hunger: 100, type: 2 }, value: 32 }, //
  120024: { type: ItemType.Food, innate: { level: 41, buff: 44102, hunger: 100, type: 2 }, value: 32 }, //
  120025: { type: ItemType.Food, innate: { level: 41, buff: 44103, hunger: 100, type: 3 }, value: 32 }, //
  120026: { type: ItemType.Food, innate: { level: 21, buff: 42111, hunger: 80, type: 2 }, value: 21 }, //
  120027: { type: ItemType.Food, innate: { level: 21, buff: 42112, hunger: 80, type: 4 }, value: 21 }, //
  120028: { type: ItemType.Food, innate: { level: 21, buff: 42113, hunger: 80, type: 3 }, value: 21 }, //
  120029: { type: ItemType.Food, innate: { level: 31, buff: 43111, hunger: 80, type: 2 }, value: 21 }, //
  120030: { type: ItemType.Food, innate: { level: 31, buff: 43112, hunger: 80, type: 4 }, value: 21 }, //
  120031: { type: ItemType.Food, innate: { level: 31, buff: 43113, hunger: 80, type: 3 }, value: 21 }, //
  120032: { type: ItemType.Food, innate: { level: 41, buff: 44111, hunger: 80, type: 2 }, value: 21 }, //
  120033: { type: ItemType.Food, innate: { level: 41, buff: 44112, hunger: 80, type: 4 }, value: 21 }, //
  120034: { type: ItemType.Food, innate: { level: 41, buff: 44113, hunger: 80, type: 3 }, value: 21 }, //
  120035: { type: ItemType.Food, innate: { level: 51, buff: 45101, hunger: 100, type: 2 }, value: 32 }, //
  120036: { type: ItemType.Food, innate: { level: 51, buff: 45102, hunger: 100, type: 2 }, value: 32 }, //
  120037: { type: ItemType.Food, innate: { level: 51, buff: 45103, hunger: 100, type: 3 }, value: 32 }, //
  120038: { type: ItemType.Food, innate: { level: 61, buff: 46101, hunger: 100, type: 2 }, value: 32 }, //
  120039: { type: ItemType.Food, innate: { level: 61, buff: 46102, hunger: 100, type: 2 }, value: 32 }, //
  120040: { type: ItemType.Food, innate: { level: 61, buff: 46103, hunger: 100, type: 3 }, value: 32 }, //
  120041: { type: ItemType.Food, innate: { level: 51, buff: 45111, hunger: 80, type: 2 }, value: 21 }, //
  120042: { type: ItemType.Food, innate: { level: 51, buff: 45112, hunger: 80, type: 4 }, value: 21 }, //
  120043: { type: ItemType.Food, innate: { level: 51, buff: 45113, hunger: 80, type: 3 }, value: 21 }, //
  120044: { type: ItemType.Food, innate: { level: 61, buff: 46111, hunger: 80, type: 2 }, value: 21 }, //
  120045: { type: ItemType.Food, innate: { level: 61, buff: 46112, hunger: 80, type: 4 }, value: 21 }, //
  120046: { type: ItemType.Food, innate: { level: 61, buff: 46113, hunger: 80, type: 3 }, value: 21 }, //
  120049: { type: ItemType.Food, innate: { level: 21, buff: 42102, hunger: 100, type: 5 }, value: 32 }, //
  120050: { type: ItemType.Food, innate: { level: 81, buff: 48103, hunger: 100, type: 2 }, value: 32 }, //
  120051: { type: ItemType.Food, innate: { level: 81, buff: 48101, hunger: 100, type: 1 }, value: 32 }, //
  120052: { type: ItemType.Food, innate: { level: 81, buff: 48102, hunger: 100, type: 3 }, value: 32 }, //
  120053: { type: ItemType.Food, innate: { level: 81, buff: 48113, hunger: 80, type: 3 }, value: 21 }, //
  120054: { type: ItemType.Food, innate: { level: 81, buff: 48111, hunger: 80, type: 5 }, value: 21 }, //
  120055: { type: ItemType.Food, innate: { level: 81, buff: 48112, hunger: 80, type: 4 }, value: 21 }, //
  128000: { type: ItemType.Food, innate: { level: 1, buff: 60000, hunger: 80, type: 5 }, value: 0 }, //
  128001: { type: ItemType.Food, innate: { level: 1, buff: 60001, hunger: 80, type: 5 }, value: 0 }, //
  128002: { type: ItemType.Food, innate: { level: 11, buff: 60002, hunger: 80, type: 5 }, value: 0 }, //
  128003: { type: ItemType.Food, innate: { level: 21, buff: 60003, hunger: 80, type: 5 }, value: 0 }, //
  128004: { type: ItemType.Food, innate: { level: 31, buff: 60004, hunger: 80, type: 5 }, value: 0 }, //
  128005: { type: ItemType.Food, innate: { level: 41, buff: 60005, hunger: 80, type: 5 }, value: 0 }, //
  128006: { type: ItemType.Food, innate: { level: 51, buff: 60006, hunger: 80, type: 5 }, value: 0 }, //
  128007: { type: ItemType.Food, innate: { level: 61, buff: 60007, hunger: 80, type: 5 }, value: 0 }, //
  128008: { type: ItemType.Food, innate: { level: 1, buff: 60008, hunger: 80, type: 5 }, value: 0 }, //
  128009: { type: ItemType.Food, innate: { level: 11, buff: 60009, hunger: 80, type: 5 }, value: 0 }, //
  128010: { type: ItemType.Food, innate: { level: 21, buff: 60010, hunger: 80, type: 5 }, value: 0 }, //
  128011: { type: ItemType.Food, innate: { level: 31, buff: 60011, hunger: 80, type: 5 }, value: 0 }, //
  128012: { type: ItemType.Food, innate: { level: 41, buff: 60012, hunger: 80, type: 5 }, value: 0 }, //
  128013: { type: ItemType.Food, innate: { level: 51, buff: 60013, hunger: 80, type: 5 }, value: 0 }, //
  128014: { type: ItemType.Food, innate: { level: 61, buff: 60014, hunger: 80, type: 5 }, value: 0 }, //
  128015: { type: ItemType.Food, innate: { level: 1, buff: 60015, hunger: 80, type: 5 }, value: 0 }, //
  128016: { type: ItemType.Food, innate: { level: 11, buff: 60016, hunger: 80, type: 5 }, value: 0 }, //
  128017: { type: ItemType.Food, innate: { level: 21, buff: 60017, hunger: 80, type: 5 }, value: 0 }, //
  128018: { type: ItemType.Food, innate: { level: 31, buff: 60018, hunger: 80, type: 5 }, value: 0 }, //
  128019: { type: ItemType.Food, innate: { level: 41, buff: 60019, hunger: 80, type: 5 }, value: 0 }, //
  128020: { type: ItemType.Food, innate: { level: 51, buff: 60020, hunger: 80, type: 5 }, value: 0 }, //
  128021: { type: ItemType.Food, innate: { level: 61, buff: 60021, hunger: 80, type: 5 }, value: 0 }, //
  128022: { type: ItemType.Food, innate: { level: 1, buff: 60022, hunger: 80, type: 5 }, value: 0 }, //
  128023: { type: ItemType.Food, innate: { level: 11, buff: 60023, hunger: 80, type: 5 }, value: 0 }, //
  128024: { type: ItemType.Food, innate: { level: 21, buff: 60024, hunger: 80, type: 5 }, value: 0 }, //
  128025: { type: ItemType.Food, innate: { level: 31, buff: 60025, hunger: 80, type: 5 }, value: 0 }, //
  128026: { type: ItemType.Food, innate: { level: 41, buff: 60026, hunger: 80, type: 5 }, value: 0 }, //
  128027: { type: ItemType.Food, innate: { level: 51, buff: 60027, hunger: 80, type: 5 }, value: 0 }, //
  128028: { type: ItemType.Food, innate: { level: 61, buff: 60028, hunger: 80, type: 5 }, value: 0 }, //
  128029: { type: ItemType.Food, innate: { level: 81, buff: 60029, hunger: 80, type: 5 }, value: 0 }, //
  128030: { type: ItemType.Food, innate: { level: 81, buff: 60030, hunger: 80, type: 5 }, value: 0 }, //
  128031: { type: ItemType.Food, innate: { level: 81, buff: 60031, hunger: 80, type: 5 }, value: 0 }, //
  128032: { type: ItemType.Food, innate: { level: 81, buff: 60032, hunger: 80, type: 5 }, value: 0 }, //
  129001: { type: ItemType.Food, innate: { level: 31, buff: 53101, hunger: 160, type: 5 }, value: 39 }, //
  129002: { type: ItemType.Food, innate: { level: 31, buff: 53102, hunger: 160, type: 5 }, value: 39 }, //
  129003: { type: ItemType.Food, innate: { level: 31, buff: 53103, hunger: 160, type: 5 }, value: 39 }, //
  129004: { type: ItemType.Food, innate: { level: 31, buff: 53104, hunger: 160, type: 5 }, value: 39 }, //
  129005: { type: ItemType.Food, innate: { level: 31, buff: 53105, hunger: 160, type: 5 }, value: 39 }, //
  129006: { type: ItemType.Food, innate: { level: 31, buff: 53106, hunger: 160, type: 5 }, value: 39 }, //
  129007: { type: ItemType.Food, innate: { level: 31, buff: 53107, hunger: 160, type: 5 }, value: 39 }, //
  129008: { type: ItemType.Food, innate: { level: 31, buff: 53108, hunger: 160, type: 5 }, value: 39 }, //
  129009: { type: ItemType.Food, innate: { level: 41, buff: 54101, hunger: 160, type: 5 }, value: 39 }, //
  129010: { type: ItemType.Food, innate: { level: 41, buff: 54102, hunger: 160, type: 5 }, value: 39 }, //
  129011: { type: ItemType.Food, innate: { level: 41, buff: 54103, hunger: 160, type: 5 }, value: 39 }, //
  129012: { type: ItemType.Food, innate: { level: 41, buff: 54104, hunger: 160, type: 5 }, value: 39 }, //
  129013: { type: ItemType.Food, innate: { level: 41, buff: 54105, hunger: 160, type: 5 }, value: 39 }, //
  129014: { type: ItemType.Food, innate: { level: 41, buff: 54106, hunger: 160, type: 5 }, value: 39 }, //
  129015: { type: ItemType.Food, innate: { level: 41, buff: 54107, hunger: 160, type: 5 }, value: 39 }, //
  129016: { type: ItemType.Food, innate: { level: 41, buff: 54108, hunger: 160, type: 5 }, value: 39 }, //
  129017: { type: ItemType.Food, innate: { level: 51, buff: 55101, hunger: 160, type: 5 }, value: 39 }, //
  129018: { type: ItemType.Food, innate: { level: 51, buff: 55102, hunger: 160, type: 5 }, value: 39 }, //
  129019: { type: ItemType.Food, innate: { level: 51, buff: 55103, hunger: 160, type: 5 }, value: 39 }, //
  129020: { type: ItemType.Food, innate: { level: 51, buff: 55104, hunger: 160, type: 5 }, value: 39 }, //
  129021: { type: ItemType.Food, innate: { level: 51, buff: 55105, hunger: 160, type: 5 }, value: 39 }, //
  129022: { type: ItemType.Food, innate: { level: 51, buff: 55106, hunger: 160, type: 5 }, value: 39 }, //
  129023: { type: ItemType.Food, innate: { level: 51, buff: 55107, hunger: 160, type: 5 }, value: 39 }, //
  129024: { type: ItemType.Food, innate: { level: 51, buff: 55108, hunger: 160, type: 5 }, value: 39 }, //
  129025: { type: ItemType.Food, innate: { level: 61, buff: 56101, hunger: 160, type: 5 }, value: 39 }, //
  129026: { type: ItemType.Food, innate: { level: 61, buff: 56102, hunger: 160, type: 5 }, value: 39 }, //
  129027: { type: ItemType.Food, innate: { level: 61, buff: 56103, hunger: 160, type: 5 }, value: 39 }, //
  129028: { type: ItemType.Food, innate: { level: 61, buff: 56104, hunger: 160, type: 5 }, value: 39 }, //
  129029: { type: ItemType.Food, innate: { level: 61, buff: 56105, hunger: 160, type: 5 }, value: 39 }, //
  129030: { type: ItemType.Food, innate: { level: 61, buff: 56106, hunger: 160, type: 5 }, value: 39 }, //
  129031: { type: ItemType.Food, innate: { level: 61, buff: 56107, hunger: 160, type: 5 }, value: 39 }, //
  129032: { type: ItemType.Food, innate: { level: 61, buff: 56108, hunger: 160, type: 5 }, value: 39 }, //
  129033: { type: ItemType.Food, innate: { level: 71, buff: 57101, hunger: 160, type: 5 }, value: 39 }, //
  129034: { type: ItemType.Food, innate: { level: 71, buff: 57102, hunger: 160, type: 5 }, value: 39 }, //
  129035: { type: ItemType.Food, innate: { level: 71, buff: 57103, hunger: 160, type: 5 }, value: 39 }, //
  129036: { type: ItemType.Food, innate: { level: 71, buff: 57104, hunger: 160, type: 5 }, value: 39 }, //
  129037: { type: ItemType.Food, innate: { level: 71, buff: 57105, hunger: 160, type: 5 }, value: 39 }, //
  129038: { type: ItemType.Food, innate: { level: 71, buff: 57106, hunger: 160, type: 5 }, value: 39 }, //
  129039: { type: ItemType.Food, innate: { level: 71, buff: 57107, hunger: 160, type: 5 }, value: 39 }, //
  129040: { type: ItemType.Food, innate: { level: 71, buff: 57108, hunger: 160, type: 5 }, value: 39 }, //
  129041: { type: ItemType.Food, innate: { level: 81, buff: 58101, hunger: 160, type: 5 }, value: 39 }, //
  129042: { type: ItemType.Food, innate: { level: 81, buff: 58102, hunger: 160, type: 5 }, value: 39 }, //
  129043: { type: ItemType.Food, innate: { level: 81, buff: 58103, hunger: 160, type: 5 }, value: 39 }, //
  129044: { type: ItemType.Food, innate: { level: 81, buff: 58104, hunger: 160, type: 5 }, value: 39 }, //
  129045: { type: ItemType.Food, innate: { level: 81, buff: 58105, hunger: 160, type: 5 }, value: 39 }, //
  129046: { type: ItemType.Food, innate: { level: 81, buff: 58106, hunger: 160, type: 5 }, value: 39 }, //
  129047: { type: ItemType.Food, innate: { level: 81, buff: 58107, hunger: 160, type: 5 }, value: 39 }, //
  129048: { type: ItemType.Food, innate: { level: 81, buff: 58108, hunger: 160, type: 5 }, value: 39 }, //
}

const TaskItems = {
  148006: { type: ItemType.Task }, // Make Out Paradise Vol 1
  148007: { type: ItemType.Task }, // Make Out Paradise Vol 2
  148008: { type: ItemType.Task }, // Make Out Paradise Vol 3
  148009: { type: ItemType.Task }, // Make Out Paradise Vol 4
  148010: { type: ItemType.Task }, // Make Out Paradise Vol 5
  148011: { type: ItemType.Task }, // Make Out Paradise Vol 6
  148012: { type: ItemType.Task }, // Make Out Paradise Vol 7
  148013: { type: ItemType.Task }, // Make Out Paradise Vol 8
  148014: { type: ItemType.Task }, // Make Out Paradise Vol 9
  148015: { type: ItemType.Task }, // Make Out Paradise Vol 10
  148016: { type: ItemType.Task }, // Make Out Paradise Vol 11
  148017: { type: ItemType.Task }, // Make Out Paradise Vol 12
}

const EtcItems = {
  100001: { type: ItemType.Etc, src: 'etc/trace/repair' },
  100002: { type: ItemType.Etc, src: 'etc/trace/identify' },
  100003: { type: ItemType.Etc, src: 'etc/trace/reroll' },
  150259: { type: ItemType.Etc, src: 'etc/87', value: 1 }, // Anonymous Card

  150301: { type: ItemType.Etc, src: 'etc/bombs/15', value: 23 }, // Grenade
  150302: { type: ItemType.Etc, src: 'gems/crystals/1', value: 43 },
  150319: { type: ItemType.Etc, src: 'tasks/1', value: 1 }, // Feather
  150337: { type: ItemType.Etc, src: 'etc/130', value: 1 }, // Weapon Disassembly Scroll
  150338: { type: ItemType.Etc, src: 'etc/131', value: 1 }, // Armor Disassembly Scroll
  150339: { type: ItemType.Etc, src: 'etc/134', value: 1 }, // Jewelry Disassembly Scroll
  150340: { type: ItemType.Etc, src: 'etc/132', value: 1 }, // Mysterious Disassembly Scroll (Weapon)
  150341: { type: ItemType.Etc, src: 'etc/132', value: 1 }, // Mysterious Disassembly Scroll (Armor)
  150342: { type: ItemType.Etc, src: 'etc/132', value: 1 }, // Mysterious Disassembly Scroll (Jewelry)

  150429: { type: ItemType.Etc, src: 'etc/214', value: 1 }, // Page 1
  150430: { type: ItemType.Etc, src: 'etc/214', value: 1 }, // Page 2
  150431: { type: ItemType.Etc, src: 'etc/214', value: 1 }, // Page 3
  150432: { type: ItemType.Etc, src: 'etc/214', value: 1 }, // Page 4

  
}

const PharmacyItems = {
  160006: { type: ItemType.Pharmacy, src: 'pharmacy/6', innate: { hp: 150 }, price: 16 }, // Healing Powder
  160007: { type: ItemType.Pharmacy, src: 'pharmacy/7', innate: { hp: 250 }, price: 20 }, // Healing Capsules
  160008: { type: ItemType.Pharmacy, src: 'pharmacy/8', innate: { hp: 350 }, price: 24 }, // Small Healing Potion
  160009: { type: ItemType.Pharmacy, src: 'pharmacy/9', innate: { hp: 450 }, price: 26 }, // Medium Healing Potion
  160010: { type: ItemType.Pharmacy, src: 'pharmacy/10', innate: { hp: 550 }, price: 29 }, // Large Healing Potion
  160011: { type: ItemType.Pharmacy, src: 'pharmacy/11', innate: { hp: 700 }, price: 31 }, // Small Healing Vial
  160012: { type: ItemType.Pharmacy, src: 'pharmacy/12', innate: { hp: 800 }, price: 33 }, // Medium Healing Vial
  160013: { type: ItemType.Pharmacy, src: 'pharmacy/13', innate: { hp: 900 }, price: 35 }, // Large Healing Vial
  160014: { type: ItemType.Pharmacy, src: 'pharmacy/14', innate: { hp: 1000 }, price: 37 }, // Small Healing Elixir
  160015: { type: ItemType.Pharmacy, src: 'pharmacy/15', innate: { hp: 1100 }, price: 39 }, // Medium Healing Elixir

  160016: { type: ItemType.Pharmacy, src: 'pharmacy/16', innate: { mp: 150 }, price: 16 }, // Chakra Powder
  160017: { type: ItemType.Pharmacy, src: 'pharmacy/17', innate: { mp: 250 }, price: 20 }, // Chakra Capsules
  160018: { type: ItemType.Pharmacy, src: 'pharmacy/18', innate: { mp: 350 }, price: 24 }, // Small Chakra Potion
  160019: { type: ItemType.Pharmacy, src: 'pharmacy/19', innate: { mp: 450 }, price: 26 }, // Medium Chakra Potion
  160020: { type: ItemType.Pharmacy, src: 'pharmacy/20', innate: { mp: 550 }, price: 29 }, // Large Chakra Potion
  160021: { type: ItemType.Pharmacy, src: 'pharmacy/21', innate: { mp: 700 }, price: 31 }, // Small Chakra Vial
  160022: { type: ItemType.Pharmacy, src: 'pharmacy/22', innate: { mp: 800 }, price: 33 }, // Medium Chakra Vial
  160023: { type: ItemType.Pharmacy, src: 'pharmacy/23', innate: { mp: 900 }, price: 35 }, // Large Chakra Vial
  160024: { type: ItemType.Pharmacy, src: 'pharmacy/24', innate: { mp: 1000 }, price: 37 }, // Small Chakra Elixir
  160025: { type: ItemType.Pharmacy, src: 'pharmacy/25', innate: { mp: 1100 }, price: 39 }, // Medium Chakra Elixir
}

const Items = {
  ...FoodItems, // 12
  ...TaskItems, // 14
  [Item.Bomb]: {
    type: ItemType.Etc,
    innate: {}
  },
  ...EtcItems, // 15
  [Item.Pink_Gem]: {
    type: ItemType.Etc,
    src: 'gems/crystals/6',
    innate: {}
  },
  [Item.Stinger]: {
    type: ItemType.Task,
    innate: {}
  },
  [Item.Sushi_Roll]: {
    type: ItemType.Task,
    innate: {}
  },

  ...PharmacyItems, // 16
  ...require('./items/gems'), // 11
  ...require('./items/boxes'), // 15
  ...require('./items/freeUse'), // 16
  ...require('./items/crops'), // 17
  ...require('./items/amulets'), // 21
  ...require('./items/hats'), // 22
  ...require('./items/shoes'), // 23
  ...require('./items/armors'), // 24
  ...require('./items/weapons'), // 25, 26, 27
  ...require('./items/gloves'), // 28
  ...require('./items/avatars'), // 29
  ...require('./items/rings'), // 30
  ...require('./items/belts'), // 31
  ...require('./items/pets'), // 32
  ...require('./items/sets').Items, // 33
  ...require('./items/impress'), // 35
  ...require('./items/enchantment'), //40
  ...require('./items/tickets'), // 48
  ...require('./items/petSkillBooks'), // 49
  ...require('./servers/mainland/items/tools'), // 100
  ...require('./servers/mainland/items/treasure').Items, // 159
  ...require('./servers/mainland/items/impress'), // 350
};

module.exports = {
	Item,
	Items,
  Types: require('./items/types'),
  Sets: { ...require('./items/sets').Sets },
}