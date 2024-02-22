const { Monster } = require("../monsters")
const { Npc } = require("../npcs")

const Scene = {
	New_Player: 1,
	Arena: 2,
	Hunt: 3,
	Las_Noches_Part_One: 61,
	Fire_Village: 111,
	Water_Village: 211,
	Lightning_Village: 311,
	Wind_Village: 411,
	Earth_Village: 511,
	Angel_City: 161,
	Demon_City: 171,
	Smelting_Mountain: 2101,
	Eventide_Barren: 2102,
	Fiery_Ridge: 2103,
	Typhoon_Plateau: 2403,
	Crossroads: 2601,
	Eerie_Passage: 2605,
	Dawning_Wilds: 2602,
	Surprise_Village: 2603,
	Glowing_Forest: 2604,
	Abandoned_Evernight_City: 2701,
	Soulshatter_Valley: 2702,
	Marsh_Of_Death: 2703,
	Plains_Of_Despair: 2704,
	Dragontame_Valley: 2801,
	Dragontame_Forest: 2802,
	Dragontame_Coast: 2803,
	Amegakure: 2804,
	Las_Noches: 3101,
	Home: 4101,
	Valhalla: 5001,
	Dungeon: 5002
}

const Scenes = {
	[Scene.New_Player]: {
		level: 1,
		monsters: [],
		npcs: []
	},
	[Scene.Arena]: {
		level: 1,
		monsters: [],
		npcs: [],
	},
	[Scene.Fire_Village]: {
		level: 1,
		monsters: [],
		npcs: [Npc.FIRE_VILLAGE_CHIEF, Npc.FIRE_ARENA_MASTER, Npc.FIRE_BLACKSMITH, Npc.Fire_Merchant, 11006]
	},
		[Scene.Water_Village]: {
		level: 1,
		monsters: [],
		npcs: [Npc.FIRE_VILLAGE_CHIEF, Npc.FIRE_ARENA_MASTER, Npc.FIRE_BLACKSMITH, Npc.Fire_Merchant, 11006]
	},
		[Scene.Earth_Village]: {
		level: 1,
		monsters: [],
		npcs: [Npc.FIRE_VILLAGE_CHIEF, Npc.FIRE_ARENA_MASTER, Npc.FIRE_BLACKSMITH, Npc.Fire_Merchant, 11006]
	},
		[Scene.Wind_Village]: {
		level: 1,
		monsters: [],
		npcs: [Npc.FIRE_VILLAGE_CHIEF, Npc.FIRE_ARENA_MASTER, Npc.FIRE_BLACKSMITH, Npc.Fire_Merchant, 11006]
	},
		[Scene.Lightning_Village]: {
		level: 1,
		monsters: [],
		npcs: [Npc.FIRE_VILLAGE_CHIEF, Npc.FIRE_ARENA_MASTER, Npc.FIRE_BLACKSMITH, Npc.Fire_Merchant, 11006]
	},
	[Scene.Home]: {
		level: 1,
		monsters: [],
		npcs: []
	},
	[Scene.Valhalla]: {
		level: 11,
		monsters: [],
		npcs: []
	},
	[Scene.Dungeon]: {
		level: 11,
		monsters: [],
		npcs: []
	},
	[Scene.Angel_City]: {
		level: 20,
		monsters: [],
		npcs: [Npc.Angel_City_Elder, Npc.Angel_City_Merchant]
	},
	[Scene.Demon_City]: {
		level: 11,
		monsters: [],
		npcs: []
	},
	[Scene.Las_Noches]: {
		level: 11,
		monsters: [],
		npcs: []
	},
	[Scene.Las_Noches_Part_One]: {
		level: 11,
		monsters: [],
		npcs: []
	},
	[Scene.Smelting_Mountain]: {
		level: 1,
		monsters: [Monster.Flower, Monster.Bee, Monster.Sushi, Monster.Scarlet, Monster.Warrior_Of_Darkness],
		npcs: [Npc.Genin, Npc.Pakkun],
		boss: 10019
	},
	[2201]: {
		level: 1,
		monsters: [Monster.Flower, Monster.Bee, Monster.Sushi, Monster.Scarlet, Monster.Warrior_Of_Darkness],
		npcs: [Npc.Genin, Npc.Pakkun],
		boss: 10019
	},
	[2301]: {
		level: 1,
		monsters: [Monster.Flower, Monster.Bee, Monster.Sushi, Monster.Scarlet, Monster.Warrior_Of_Darkness],
		npcs: [Npc.Genin, Npc.Pakkun],
		boss: 10019
	},
	[2401]: {
		level: 1,
		monsters: [Monster.Flower, Monster.Bee, Monster.Sushi, Monster.Scarlet, Monster.Warrior_Of_Darkness],
		npcs: [Npc.Genin, Npc.Pakkun],
		boss: 10019
	},
	[2501]: {
		level: 1,
		monsters: [Monster.Flower, Monster.Bee, Monster.Sushi, Monster.Scarlet, Monster.Warrior_Of_Darkness],
		npcs: [Npc.Genin, Npc.Pakkun],
		boss: 10019
	},
	[Scene.Eventide_Barren]: {
		level: 11,
		monsters: [Monster.Sweet_Potato_Demon, Monster.Grinning_Monkey, Monster.Riceball_Monster, Monster.Kappa, Monster.Bullheaded_Champ],
		npcs: [Npc.Mysterious_Merchant],
		boss: 10026
	},
	[2202]: {
		level: 11,
		monsters: [Monster.Sweet_Potato_Demon, Monster.Grinning_Monkey, Monster.Riceball_Monster, Monster.Kappa, Monster.Bullheaded_Champ],
		npcs: [Npc.Mysterious_Merchant],
		boss: 10026
	},
	[2302]: {
		level: 11,
		monsters: [Monster.Sweet_Potato_Demon, Monster.Grinning_Monkey, Monster.Riceball_Monster, Monster.Kappa, Monster.Bullheaded_Champ],
		npcs: [Npc.Mysterious_Merchant],
		boss: 10026
	},
	[2402]: {
		level: 11,
		monsters: [Monster.Sweet_Potato_Demon, Monster.Grinning_Monkey, Monster.Riceball_Monster, Monster.Kappa, Monster.Bullheaded_Champ],
		npcs: [Npc.Mysterious_Merchant],
		boss: 10026
	},
	[2502]: {
		level: 11,
		monsters: [Monster.Sweet_Potato_Demon, Monster.Grinning_Monkey, Monster.Riceball_Monster, Monster.Kappa, Monster.Bullheaded_Champ],
		npcs: [Npc.Mysterious_Merchant],
		boss: 10026
	},
	[Scene.Crossroads]: {
		level: 16,
		monsters: [Monster.Treant, Monster.Maneater_Blossom, Monster.Longfeather_Bandit, Monster.Chevalier, Monster.Shadow_Bat],
		npcs: [Npc.Master_Yuan, Npc.Feng],
		boss: 10015
	},
	[Scene.Fiery_Ridge]: {
		level: 21,
		monsters: [Monster.Corn_Demon, Monster.Mouse, Monster.Ghost, Monster.Flame_Demon, Monster.Thunder, Monster.Magic_General],
		npcs: [Npc.Hunter],
		boss: 10039
	},
	[2203]: {
		level: 21,
		monsters: [Monster.Corn_Demon, Monster.Mouse, Monster.Ghost, Monster.Flame_Demon, Monster.Thunder, Monster.Magic_General],
		npcs: [Npc.Hunter],
		boss: 10039
	},
	[2303]: {
		level: 21,
		monsters: [Monster.Corn_Demon, Monster.Mouse, Monster.Ghost, Monster.Flame_Demon, Monster.Thunder, Monster.Magic_General],
		npcs: [Npc.Hunter],
		boss: 10039
	},
	[2403]: {
		level: 21,
		monsters: [Monster.Corn_Demon, Monster.Mouse, Monster.Ghost, Monster.Flame_Demon, Monster.Thunder, Monster.Magic_General],
		npcs: [Npc.Hunter],
		boss: 10039
	},
	[2503]: {
		level: 21,
		monsters: [Monster.Corn_Demon, Monster.Mouse, Monster.Ghost, Monster.Flame_Demon, Monster.Thunder, Monster.Magic_General],
		npcs: [Npc.Hunter],
		boss: 10039
	},
	[Scene.Eerie_Passage]: {
		level: 26,
		monsters: [Monster.Ghost_Mother_In_Law, Monster.Green_Leather_Frog, Monster.Demon_General, Monster.Little_Devil, Monster.Noodle_Thief, Monster.Hongchaun_Yatai], // , Monster.Little_Devil files missing
		npcs: [Npc.Sentry, Npc.Priest],
		boss: 10034
	},
	[Scene.Dawning_Wilds]: {
		level: 31,
		monsters: [Monster.Dog, Monster.Buns, Monster.Ghost_Noodle, Monster.Ancient_Ninja, Monster.Guzhu_Xi_Shou],
		npcs: [Npc.Chef],
		boss: 10032
	},
	[Scene.Surprise_Village]: {
		level: 36,
		monsters: [Monster.Wild_Monk, Monster.Pork_Gangster, Monster.Magic_Flute_Demon, Monster.Mountain_Bandit, Monster.Aka_Kou_Giant],
		npcs: [Npc.Kabuki, Npc.Toad],
		boss: 10035
	},
	[Scene.Glowing_Forest]: {
		level: 41,
		monsters: [Monster.Eagle, Monster.Bloodsucking_Bat, Monster.Young_Eagle, Monster.Morima, Monster.Morima_Qianhe],
		npcs: [Npc.Craftsman],
		boss: 10052
	},
	[Scene.Abandoned_Evernight_City]: {
		level: 46,
		monsters: [Monster.Corpse_Mouse, Monster.Furious_Dog, Monster.Black_Eagle, Monster.Skeleton_Swordsman, Monster.Resentment],
		npcs: [Npc.Witch],
		boss: 10031
	},
	[Scene.Soulshatter_Valley]: {
		level: 51,
		monsters: [Monster.Demon_Eye_Demon, Monster.Roar_Demon_Ape, Monster.Degenerate_Monk, Monster.Gangster, Monster.The_Righteous_Thief],
		npcs: [Npc.Robber]
	},
	[Scene.Marsh_Of_Death]: {
		level: 56,
		monsters: [Monster.Swamp_Poison_Frog, Monster.Gloomy_Tree, Monster.Poisonous_Marsh_Knap, Monster.Drowning, Monster.Fog_Monster],
		npcs: [Npc.Shaman]
	},
	[Scene.Plains_Of_Despair]: {
		level: 61,
		monsters: [Monster.Bloodthirsty_Sunflower, Monster.Desert_Vulture, Monster.Fraud, Monster.Barren_Swordsman, Monster.Jin_Mang_Monster],
		npcs: [Npc.Samurai]
	},
	[Scene.Dragontame_Valley]: {
		level: 66,
		monsters: [Monster.Wild_Pterosaur, Monster.Earth_Pterosaur, Monster.Whirlwind, Monster.Barbarians, Monster.Toad_Dragon],
		npcs: []
	},
	[Scene.Dragontame_Forest]: {
		level: 71,
		monsters: [Monster.Ice_Pterosaur, Monster.Lei_Pterosaur, Monster.Uesugi_Saski, Monster.Greedy_Bandit, Monster.Double_Headed_Dragon],
		npcs: []
	},
	[Scene.Dragontame_Coast]: {
		level: 81,
		monsters: [Monster.Mowing, Monster.Coast_2, Monster.Pyramid, Monster.Kobayam, Monster.Jiutou_Dragon],
		npcs: []
	},
	[Scene.Amegakure]: {
		level: 86,
		monsters: [Monster.Giant_Cricket, Monster.Mechanical_Cattle, Monster.Giant_Lizard, Monster.Giant_Bird, Monster.Cerberus],
		npcs: []
	},
}

module.exports = {
	Scene,
	Scenes
}