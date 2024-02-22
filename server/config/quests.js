const { Item } = require("./items")
const { Monster } = require("./monsters")
const { Npc } = require("./npcs")
const { Scene } = require("./scenes/scenes")

// 1: collect
// 2: Kill monsters
// 3: NPC dialogue
// 4: Time limit class
// 5: Assassination
// 6: Arena competition
// 7: Action tasks (for novice tasks)
// 8: Internal command tasks (upgrade tasks, etc.)
// 9: Novice guide fake tasks
// 10: Boss level task
// 11: Field Exploration Mission
// 12: Military rank tasks
// 13: Streak missions in the arena
// 14: Single copy
// 15: Multiplayer copy
// 16: Slave Capture Quests
// 17: Receive gift package tasks
// 18: Number of completed reward tasks
// 19: Fight monsters with slot machines in public scenes
// 20: The number of times to pass the virtual night palace
// 21: Homeland Quest Building Operations
// 22:Tail Beast Honor Quest

const QuestType = {
	Collect: 1,
	Kill: 2,
	Talk: 3,
	GiveItem: 6
}

const Quest = {
	Ninja_Trials: 10001,
	Guardian: 10002,
	Patrol: 10003,
	Bee: 10004,
	Return_To_Village: 10005,
	First_Celebration: 10006,
	Second_Celebration: 10007,
	Emergency: 10008,
	Rescue: 10009,
	Ninja_Dog: 10010,
	Report: 10011,
	Unusual_Activity: 10012,
	Naughty_Ninja: 10013,
	Shadow: 10014,
	Familiar_Atmosphere: 10015,
	Lost_Heart: 10016,
	History_Of_The_Village: 10017,
	Select: 10018,
	Trouble_Of_Grocery_Store: 10019,
	Lose_An_Appointment: 10020,
	Unlucky_Businessman: 10021,
	Escort: 10022,
	Set_Off: 10023,
	Gift: 10024,
	Greeting: 10025,
	Test: 10026,
	Meet_The_Master: 10027,
	Help_The_Public: 10028,
	Creating_Of_Kappa: 10029,
	Recognize: 10030,
	Feng_Niangs_Commission: 10031,
	Flower_Demon: 10032,
	Merchants_Help: 10033,
	Teaching: 10034,
	Trust: 10035,
	Thief: 10036,
	Reconstruct_Village: 10037,
	Collect_seeds: 10038,
	Virtue: 10039,
	The_treasure_that_was_taken_away: 10040,
	Find_a_treasure: 10041,
	Resurgence: 10042,
	Dark_Night_Phantom_One: 10043,
	Dark_Night_Phantom_Second: 10044,
	Dark_Night_Phantom_Three: 10045,
	Legend_of_Devil_City: 10046,
	Escape_female_ghost: 10047,
	crisis: 10048,
	urgent: 10049,
	Eliminate_a_demon: 10050,
	Rumor: 10051,
	drum: 10052,
	Heart_Demon: 10053,
	The_mystery_of_toad_oil: 10054,
	Deed: 10055,
	Demon_General: 10056,
	Demon_power_one: 10057,
	Demon_power_two: 10058,
	Notice: 10059,
	investigation: 10060,
	trade: 10061,
	violent: 10062,
	Seal: 10063,
	Return_to_Angel_City: 10064,
	Method_of_rescue: 10065,
	Spices: 10066,
	Fragrant_medicine: 10067,
	Rescue_warrior: 10068,
	Fire_Devil: 10069,
	Legendary_forbearance: 10070,
	Monko_Monko: 10071,
	rumor_2: 10072,
	Green_Welle: 10073,
	Ancient_ninja: 10074,
	The_treasures_of_the_stealing: 10075,
	Recapture_treasure: 10076,
	Recognize_2: 10077,
	Magic_general: 10078,
	Invading_like_a_fire: 10079,
	Special_service_player: 10080,
	Disappear: 10081,
	Charm: 10082,
	Forest_land_change: 10083,
	Greedy_vulture: 10084,
	Roots: 10085,
	Kill_blood_bats: 10086,
	Disaster: 10087,
	Small_village_gangster: 10088,
	Punish_the_bandit: 10089,
	Changes_in_wind: 10090,
	Reporter: 10091,
	Wind_Seal_Seal: 10092,
	Wind_Flute_One: 10093,
	Wind_Flute_Two: 10094,
	Wind_Flute_Three: 10095,
	Artist: 10096,
	Tornado: 10097,
	Eliminate_the_wind_demon: 10098,
	Demon_Joyo: 10099,
	Like_a_wind: 10100,
	Moris_revenge: 10101,
	Mori_Leader: 10102,
	Shock: 10103,
	Witchs_trace: 10104,
	Legend: 10105,
	Gates_of_relics: 10106,
	Relic_seal: 10107,
	Invitation_1: 10108,
	Invitation_2: 10109,
	Adventure_1: 10110,
	Adventure_2: 10111,
	Adventure_3: 10112,
	return: 10113,
	alert: 10114,
	Magic_ape: 10115,
	hostility: 10116,
	Death_swamp: 10117,
	evidence: 10118,
	trend: 10119,
	Water_Demon: 10120,
	Xu_Rulin: 10121,
	Deserted: 10122,
	Expel_tree_monsters: 10123,
	Desperate_swordsman: 10124,
	Crazy_Demon_Kwai: 10125,
	Tracked_gangsters: 10126,
	Annihila: 10127,
	Robber_leader: 10128,
	Witch: 10129,
	Water_demon: 10130,
	Water_Demon_Two: 10131,
	Legend_of_Marsh: 10132,
	King_of_monsters: 10133,
	Birds_that_passed_the_message: 10134,
	Tame_vulture: 10135,
	Taboo: 10136,
	Taboo_medicine_2: 10137,
	Taboo_medicine_3: 10138,
	Earth_Devil: 10139,
	Seal: 10140,
	Not_like_a_mountain: 10141,
	First_Wenlong_tribe: 10142,
	Explore_the_dragon_trace: 10143,
	Small_whirlwind_dancer: 10144,
	Dragon_Valley_Suspect: 10145,
	Dragon_evidence: 10146,
	Visit_Longgu: 10147,
	Mysterious_indigenous_people: 10148,
	Puzzle: 10149,
	Bay_threat: 10162,
	Meet_the_fisherman: 10163,
	Clean_up_the_bay_1: 10164,
	Bay_War_Daily_1: 10165,
	Back_to_the_Bay_1: 10166,
	Clean_up_the_bay_2: 10167,
	Bay_War_Daily_2: 10168,
	Back_to_the_Bay_2: 10169,
	Clean_up_the_bay_3: 10170,
	Bay_War_Daily_3: 10171,
	Back_to_the_Bay_3: 10172,
	Clean_up_the_bay_4: 10173,
	Bay_War_Daily_4: 10174,
	Back_to_the_Bay_Four: 10175,
	Final_threat: 10176,
	Triumphant_return: 10177,
	Change_of_Yuyin_Village: 10178,
	Sneak_into_Yuyin_Village: 10179,
	Fighting_Yuyin_1: 10180,
	Yu_Yin_Battle_Report_1: 10181,
	Raiders_Yuyin_Plan_1: 10182,
	Fighting_Yuyin_2: 10183,
	Yu_Yin_Battle_Report_Two: 10184,
	Raiders_Yuyin_Plan_2: 10185,
	Fighting_Yuyin_3: 10186,
	Yuxian_War_Report_3: 10187,
	Raiders_Yuyin_Plan_3: 10188,
	Fighting_Yuyin_Four: 10189,
	Yu_Yin_Battle_Report_Four: 10190,
	Raiders_Yuyin_Plan_4: 10191,
	Fighting_Cerberus: 10192,
}

const Quests = {
	[Quest.Ninja_Trials]: {
		level: 1,
		requires: [],
		steps: [
			{ type: QuestType.Kill, monster: Monster.Flower, amount: 2 }
		],
		acceptFrom: Npc.FIRE_VILLAGE_CHIEF,
		turnIn: Npc.FIRE_VILLAGE_CHIEF,
		rewards: {
			stones: 183,
			exp: 80
		},
		unlocks: [Quest.Guardian],
	},
	[Quest.Guardian]: {
		level: 2,
		requires: [Quest.Ninja_Trials],
		acceptFrom: Npc.FIRE_VILLAGE_CHIEF,
		steps: [
			{ type: QuestType.Talk, npc: Npc.FIRE_ARENA_MASTER }
		],
		turnIn: Npc.FIRE_ARENA_MASTER,
		rewards: {
			stones:  183,
			exp: 80
		},
		unlocks: [Quest.Patrol],
	},
	[Quest.Patrol]: {
		level: 3,
		requires: [Quest.Guardian],
		acceptFrom: Npc.FIRE_ARENA_MASTER,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Genin }
		],
		turnIn: Npc.Genin,
		rewards: {
			stones: 238,
			exp: 120
		},
		unlocks: [Quest.Bee],
	},
	[Quest.Bee]: {
		level: 4,
		acceptFrom: Npc.Genin,
		requires: [Quest.Patrol],
		steps: [
			{ type: QuestType.Collect, monster: Monster.Bee, item: Item.Stinger,	rate: 85,	amount: 2 }
		],
		turnIn: Npc.Genin,
		rewards: {
			stones: 238,
			exp: 120
		},
		unlocks: [Quest.Return_To_Village],
	},
	[Quest.Return_To_Village]: {
		level: 5,
		requires: [Quest.Bee],
		acceptFrom: Npc.Genin,
		steps: [
			{ type: QuestType.Talk, npc: Npc.FIRE_ARENA_MASTER }
		],
		turnIn: Npc.FIRE_ARENA_MASTER,
		rewards: {
			stones: 277,
			exp: 165
		},
		unlocks: [Quest.First_Celebration],
	},
	[Quest.First_Celebration]: {
		level: 6,
		requires: [Quest.Return_To_Village],
		acceptFrom: Npc.FIRE_ARENA_MASTER,
		steps: [
			{ type: QuestType.Collect, monster: Monster.Sushi, item: Item.Sushi_Roll, rate: 85, amount: 3 }
		],
		turnIn: Npc.FIRE_ARENA_MASTER,
		rewards: {
			stones: 277,
			exp: 165
		},
		unlocks: [Quest.Second_Celebration],
	},
	[Quest.Second_Celebration]: {
		level: 7,
		requires: [Quest.First_Celebration],
		acceptFrom: Npc.FIRE_ARENA_MASTER,
		steps: [
			{ type: QuestType.Talk, npc: Npc.FIRE_BLACKSMITH },
			{ type: QuestType.Talk, npc: Npc.Fire_Merchant }
		],
		turnIn: Npc.FIRE_VILLAGE_CHIEF,
		rewards: {
			stones: 312,
			exp: 220
		},
		unlocks: [Quest.Emergency],
	},
	[Quest.Emergency]: {
		level: 7,
		requires: [Quest.Second_Celebration],
		acceptFrom: Npc.FIRE_VILLAGE_CHIEF,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Genin }
		],
		turnIn: Npc.Genin,
		rewards: {
			stones: 312,
			exp: 220
		},
		unlocks: [Quest.Rescue],
	},
	[Quest.Rescue]: {
		level: 8,
		requires: [Quest.Emergency],
		acceptFrom: Npc.Genin,
		steps: [
			{ type: QuestType.Kill, monster: Monster.Scarlet, amount: 3 }
		],
		turnIn: Npc.Genin,
		rewards: {
			stones: 341,
			exp: 298
		},
		unlocks: [Quest.Ninja_Dog],
	},
	[Quest.Ninja_Dog]: {
		level: 8,
		requires: [Quest.Rescue],
		acceptFrom: Npc.Genin,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Pakkun }
		],
		turnIn: Npc.Pakkun,
		rewards: {
			stones: 341,
			exp: 298
		},
		unlocks: [Quest.Report],
	},
	[Quest.Report]: {
		level: 9,
		requires: [Quest.Ninja_Dog],
		acceptFrom: Npc.Pakkun,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Pakkun }
		],
		turnIn: Npc.FIRE_VILLAGE_CHIEF,
		rewards: {
			stones: 365,
			exp: 386
		},
		unlocks: [Quest.Unusual_Activity],
	},
	[Quest.Unusual_Activity]: {
		level: 9,
		requires: [Quest.Report],
		acceptFrom: Npc.FIRE_VILLAGE_CHIEF,
		steps: [
			{ type: QuestType.Kill, monster: Monster.Flower, amount: 3 },
			{ type: QuestType.Kill, monster: Monster.Bee, amount: 3 },
			{ type: QuestType.Kill, monster: Monster.Sushi, amount: 3 },
		],
		turnIn: Npc.Genin,
		rewards: {
			stones: 365,
			exp: 386
		},
		unlocks: [Quest.Naughty_Ninja],
	},
	[Quest.Naughty_Ninja]: {
		level: 10,
		requires: [Quest.Unusual_Activity],
		acceptFrom: Npc.Genin,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Pakkun }
		],
		turnIn: Npc.Pakkun,
		rewards: {
			stones: 446,
			exp: 598
		},
		unlocks: [Quest.Shadow],
	},
	[Quest.Shadow]: {
		level: 10,
		requires: [Quest.Naughty_Ninja],
		acceptFrom: Npc.Pakkun,
		steps: [
			{ type: QuestType.Kill, monster: Monster.Warrior_Of_Darkness, amount: 1 }
		],
		turnIn: Npc.Pakkun,
		rewards: {
			stones: 446,
			exp: 598,
			// items: [
			// 	{ item: Item.Ninja_Scarf, amount: 1 } // Gives item as a reward to be turned in on the next quest. Probably remove this
			// ]
		},
		unlocks: [Quest.Familiar_Atmosphere],
	},
	[Quest.Familiar_Atmosphere]: {
		level: 11,
		requires: [Quest.Shadow],
		acceptFrom: Npc.Pakkun,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Genin } // Also wants i140030 Ninja Scarf
		],
		turnIn: Npc.Genin,
		rewards: {
			stones: 651,
			exp: 891
		},
		unlocks: [Quest.Lost_Heart],
	},
	[Quest.Lost_Heart]: {
		level: 11,
		requires: [Quest.Familiar_Atmosphere],
		acceptFrom: Npc.Genin,
		steps: [
			{ type: QuestType.Talk, npc: Npc.FIRE_VILLAGE_CHIEF }
		],
		turnIn: Npc.FIRE_VILLAGE_CHIEF,
		rewards: {
			stones: 651,
			exp: 891
		},
		unlocks: [Quest.History_Of_The_Village],
	},
	[Quest.History_Of_The_Village]: {
		level: 12,
		requires: [Quest.Lost_Heart],
		acceptFrom: Npc.FIRE_VILLAGE_CHIEF,
		steps: [
			{ type: QuestType.Talk, npc: Npc.FIRE_VILLAGE_CHIEF }
		],
		turnIn: Npc.FIRE_VILLAGE_CHIEF,
		rewards: {
			stones: 824,
			exp: 1206
		},
		unlocks: [Quest.Select],
	},
	[Quest.Select]: {
		level: 12,
		requires: [Quest.History_Of_The_Village],
		acceptFrom: Npc.FIRE_VILLAGE_CHIEF,
		steps: [
			{ type: QuestType.Kill, monster: Monster.Sweet_Potato_Demon, amount: 5 }
		],
		turnIn: Npc.FIRE_VILLAGE_CHIEF,
		rewards: {
			stones: 824,
			exp: 1206
		},
		unlocks: [Quest.Trouble_Of_Grocery_Store],
	},
	[Quest.Trouble_Of_Grocery_Store]: {
		level: 13,
		requires: [Quest.Select],
		acceptFrom: Npc.FIRE_VILLAGE_CHIEF,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Fire_Merchant }
		],
		turnIn: Npc.Fire_Merchant,
		rewards: {
			stones: 953,
			exp: 1667
		},
		unlocks: [Quest.Lose_An_Appointment],
	},
	[Quest.Lose_An_Appointment]: {
		level: 13,
		requires: [Quest.Trouble_Of_Grocery_Store],
		acceptFrom: Npc.Fire_Merchant,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Mysterious_Merchant }
		],
		turnIn: Npc.Mysterious_Merchant,
		rewards: {
			stones: 953,
			exp: 1667
		},
		unlocks: [Quest.Unlucky_Businessman],
	},
	[Quest.Unlucky_Businessman]: {
		level: 14,
		requires: [Quest.Lose_An_Appointment],
		acceptFrom: Npc.Mysterious_Merchant,
		steps: [
			{ type: QuestType.Collect, monster: Monster.Grinning_Monkey, item: Item.Straw_Hat, rate: 85, amount: 4 }
		],
		turnIn: Npc.Mysterious_Merchant,
		rewards: {
			stones: 1026,
			exp: 2254
		},
		unlocks: [Quest.Escort],
	},
	[Quest.Escort]: {
		level: 14,
		requires: [Quest.Unlucky_Businessman],
		acceptFrom: Npc.Mysterious_Merchant,
		steps: [
			{ type: QuestType.Kill, monster: Monster.Scarlet, amount: 5 }
		],
		turnIn: Npc.Fire_Merchant,
		rewards: {
			stones: 1026, // TODO 160028 Item reward 10 hp bags as well that resore 350/350
			exp: 2254
		},
		unlocks: [Quest.Set_Off],
	},
	[Quest.Set_Off]: {
		level: 15,
		requires: [Quest.Escort],
		acceptFrom: Npc.Fire_Merchant,
		steps: [
			{ type: QuestType.Talk, npc: Npc.FIRE_VILLAGE_CHIEF }
		],
		turnIn: Npc.Genin,
		rewards: {
			stones: 1031,
			exp: 2456
		},
		unlocks: [Quest.Gift],
	},
	[Quest.Gift]: {
		level: 15,
		requires: [Quest.Set_Off],
		acceptFrom: Npc.Genin,
		steps: [
			{ type: QuestType.Collect, monster: Monster.Bee, item: Item.Honey, rate: 85, amount: 4 },
			{ type: QuestType.Collect, monster: Monster.Riceball_Monster, item: Item.Rice_Ball, rate: 85, amount: 4 }
		],
		turnIn: Npc.Genin,
		rewards: {
			stones: 1031, // TODO 150322, 1 exp bag possibly
			exp: 2456
		},
		unlocks: [Quest.Greeting],
	},
	[Quest.Greeting]: {
		level: 16,
		requires: [Quest.Gift],
		acceptFrom: Npc.Genin,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Genin } // Bring Rice ball from previous quest
		],
		turnIn: Npc.Master_Yuan,
		rewards: {
			stones: 1151,
			exp: 2806
		},
		unlocks: [Quest.Test],
	},
	[Quest.Test]: {
		level: 16,
		requires: [Quest.Greeting],
		acceptFrom: Npc.Master_Yuan,
		steps: [
			{ type: QuestType.Kill, monster: Monster.Treant, amount: 6 } 
		],
		turnIn: Npc.Master_Yuan,
		rewards: {
			stones: 1151,
			exp: 2806
		},
		unlocks: [Quest.Meet_The_Master],
	},
	[Quest.Meet_The_Master]: {
		level: 17,
		requires: [Quest.Test],
		acceptFrom: Npc.Master_Yuan,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Angel_City_Elder } 
		],
		turnIn: Npc.Angel_City_Elder,
		rewards: {
			stones: 1251,
			exp: 3254
		},
		unlocks: [Quest.Help_The_Public],
	},
	[Quest.Help_The_Public]: {
		level: 17,
		requires: [Quest.Meet_The_Master],
		acceptFrom: Npc.Angel_City_Elder,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Angel_City_Merchant } 
		],
		turnIn: Npc.Angel_City_Merchant,
		rewards: {
			stones: 1251,
			exp: 3254
		},
		unlocks: [Quest.Creating_Of_Kappa],
	},
	[Quest.Creating_Of_Kappa]: {
		level: 18,
		requires: [Quest.Help_The_Public],
		acceptFrom: Npc.Angel_City_Merchant,
		steps: [
			{ type: QuestType.Kill, monster: Monster.Kappa, amount: 6 }  
		],
		turnIn: Npc.Angel_City_Merchant,
		rewards: {
			stones: 1327,
			exp: 3680
		},
		unlocks: [Quest.Recognize],
	},
	[Quest.Recognize]: {
		level: 18,
		requires: [Quest.Creating_Of_Kappa],
		acceptFrom: Npc.Angel_City_Merchant,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Master_Yuan }  
		],
		turnIn: Npc.Master_Yuan,
		rewards: {
			stones: 1327,
			exp: 3680
		},
		unlocks: [Quest.Feng_Niangs_Commission],
	},
	[Quest.Feng_Niangs_Commission]: {
		level: 19,
		requires: [Quest.Recognize],
		acceptFrom: Npc.Master_Yuan,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Feng }  
		],
		turnIn: Npc.Feng,
		rewards: {
			stones: 1374,
			exp: 4381
		},
		unlocks: [Quest.Flower_Demon],
	},
	[Quest.Flower_Demon]: {
		level: 19,
		requires: [Quest.Feng_Niangs_Commission],
		acceptFrom: Npc.Feng,
		steps: [
			{ type: QuestType.Collect, monster: Monster.Maneater_Blossom, item: Item.Eater_Drop, rate: 85, amount: 5 }, 
		],
		turnIn: Npc.Feng,
		rewards: {
			stones: 1374,
			exp: 4381
		},
		unlocks: [Quest.Merchants_Help],
	},
	[Quest.Merchants_Help]: {
		level: 20,
		requires: [Quest.Flower_Demon],
		acceptFrom: Npc.Feng,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Mysterious_Merchant }, 
		],
		turnIn: Npc.Mysterious_Merchant,
		rewards: {
			stones: 1389,
			exp: 4950
		},
		unlocks: [Quest.Teaching],
	},
	[Quest.Teaching]: {
		level: 20,
		requires: [Quest.Merchants_Help],
		acceptFrom: Npc.Mysterious_Merchant,
		steps: [
			{ type: QuestType.Kill, monster: Monster.Bullheaded_Champ, amount: 1 }, 
		],
		turnIn: Npc.Mysterious_Merchant,
		rewards: {
			stones: 1389,
			exp: 4950
		},
		unlocks: [Quest.Trust],
	},
	[Quest.Trust]: {
		level: 21,
		requires: [Quest.Teaching],
		acceptFrom: Npc.Mysterious_Merchant,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Master_Yuan }, 
		],
		turnIn: Npc.Master_Yuan,
		rewards: {
			stones: 1481,
			exp: 5604
		},
		unlocks: [Quest.Thief],
	},
	[Quest.Thief]: {
		level: 21,
		requires: [Quest.Trust],
		acceptFrom: Npc.Master_Yuan,
		steps: [
			{ type: QuestType.Kill, monster: Monster.Noodle_Thief, amount: 7 }, 
		],
		turnIn: Npc.Master_Yuan,
		rewards: {
			stones: 1481,
			exp: 5604
		},
		unlocks: [Quest.Reconstruct_Village],
	},
	[Quest.Reconstruct_Village]: {
		level: 22,
		requires: [Quest.Thief],
		acceptFrom: Npc.Master_Yuan,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Feng }, 
		],
		turnIn: Npc.Feng,
		rewards: {
			stones: 1561,
			exp: 5805
		},
		unlocks: [Quest.Collect_seeds],
	},
	[Quest.Collect_seeds]: {
		level: 22,
		requires: [Quest.Reconstruct_Village],
		acceptFrom: Npc.Feng,
		steps: [
			{ type: QuestType.Collect, monster: Monster.Corn_Demon, item: Item.Corn_Drop, rate: 85, amount: 6 }, 
		],
		turnIn: Npc.Feng,
		rewards: {
			stones: 1561,
			exp: 5805
		},
		unlocks: [Quest.Virtue],
	},
	[Quest.Virtue]: {
		level: 23,
		requires: [Quest.Collect_seeds],
		acceptFrom: Npc.Feng,
		steps: [
			{ type: QuestType.Kill, monster: Monster.Longfeather_Bandit, amount: 7 }, 
		],
		turnIn: Npc.Feng,
		rewards: {
			stones: 1625,
			exp: 6204
		},
		unlocks: [Quest.The_treasure_that_was_taken_away],
	},
	[Quest.The_treasure_that_was_taken_away]: {
		level: 23,
		requires: [Quest.Virtue],
		acceptFrom: Npc.Feng,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Hunter }, 
		],
		turnIn: Npc.Hunter,
		rewards: {
			stones: 1625,
			exp: 6204
		},
		unlocks: [Quest.Find_a_treasure],
	},
	[Quest.Find_a_treasure]: {
		level: 24,
		requires: [Quest.The_treasure_that_was_taken_away],
		acceptFrom: Npc.Hunter,
		steps: [
			{ type: QuestType.Collect, monster: Monster.Mouse, item: Item.Mouse_Drop, rate: 85, amount: 6 }, 
		],
		turnIn: Npc.Feng,
		rewards: {
			stones: 1672,
			exp: 6420
		},
		unlocks: [Quest.Resurgence],
	},
	[Quest.Resurgence]: {
		level: 24,
		requires: [Quest.Find_a_treasure],
		acceptFrom: Npc.Feng,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Master_Yuan }, 
		],
		turnIn: Npc.Master_Yuan,
		rewards: {
			stones: 1672,
			exp: 6420
		},
		unlocks: [Quest.Dark_Night_Phantom_One],
	},
	[Quest.Dark_Night_Phantom_One]: {
		level: 25,
		requires: [Quest.Resurgence],
		acceptFrom: Npc.Master_Yuan,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Angel_City_Elder }, 
		],
		turnIn: Npc.Angel_City_Elder,
		rewards: {
			stones: 1699,
			exp: 6608
		},
		unlocks: [Quest.Dark_Night_Phantom_Second],
	},
	[Quest.Dark_Night_Phantom_Second]: {
		level: 25,
		requires: [Quest.Dark_Night_Phantom_One],
		acceptFrom: Npc.Angel_City_Elder,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Angel_City_Merchant }, 
		],
		turnIn: Npc.Feng,
		rewards: {
			stones: 1699,
			exp: 6608
		},
		unlocks: [Quest.Dark_Night_Phantom_Three],
	},
	[Quest.Dark_Night_Phantom_Three]: {
		level: 25,
		requires: [Quest.Dark_Night_Phantom_Second],
		acceptFrom: Npc.Feng,
		steps: [
			{ type: QuestType.Kill, monster: Monster.Shadow_Bat, amount: 1 }, 
		],
		turnIn: Npc.Angel_City_Elder,
		rewards: {
			stones: 1699,
			exp: 6608, // Item 150323 x1
		},
		unlocks: [Quest.Legend_of_Devil_City],
	},
	[Quest.Legend_of_Devil_City]: {
		level: 26,
		requires: [Quest.Dark_Night_Phantom_Three],
		acceptFrom: Npc.Angel_City_Elder,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Sentry }, 
		],
		turnIn: Npc.Sentry,
		rewards: {
			stones: 1769,
			exp: 6808 
		},
		unlocks: [Quest.Escape_female_ghost],
	},
	[Quest.Escape_female_ghost]: {
		level: 26,
		requires: [Quest.Legend_of_Devil_City],
		acceptFrom: Npc.Sentry,
		steps: [
			{ type: QuestType.Collect, monster: Monster.Ghost, item: Item.Ghost_Drop, rate: 85, amount: 7 }, 
		],
		turnIn: Npc.Sentry,
		rewards: {
			stones: 1769,
			exp: 6808 
		},
		unlocks: [Quest.crisis],
	},
	[Quest.crisis]: {
		level: 27,
		requires: [Quest.Escape_female_ghost],
		acceptFrom: Npc.Sentry,
		steps: [
			{ type: QuestType.Kill, monster: Monster.Ghost_Mother_In_Law, amount: 8 }, 
		],
		turnIn: Npc.Sentry,
		rewards: {
			stones: 1829,
			exp: 7005 
		},
		unlocks: [Quest.urgent],
	},
	[Quest.urgent]: {
		level: 27,
		requires: [Quest.crisis],
		acceptFrom: Npc.Sentry,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Angel_City_Elder }, 
		],
		turnIn: Npc.Angel_City_Elder,
		rewards: {
			stones: 1829,
			exp: 7005 
		},
		unlocks: [Quest.Eliminate_a_demon],
	},
	[Quest.Eliminate_a_demon]: {
		level: 28,
		requires: [Quest.urgent],
		acceptFrom: Npc.Angel_City_Elder,
		steps: [
			{ type: QuestType.Kill, monster: Monster.Flame_Demon, amount: 8 }, 
		],
		turnIn: Npc.Master_Yuan,
		rewards: {
			stones: 1875,
			exp: 7186 
		},
		unlocks: [Quest.Rumor],
	},
	[Quest.Rumor]: {
		level: 28,
		requires: [Quest.Eliminate_a_demon],
		acceptFrom: Npc.Master_Yuan,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Feng }, 
		],
		turnIn: Npc.Sentry,
		rewards: {
			stones: 1875,
			exp: 7186 
		},
		unlocks: [Quest.drum],
	},
	[Quest.drum]: {
		level: 29,
		requires: [Quest.Rumor],
		acceptFrom: Npc.Sentry,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Master_Yuan }, 
		],
		turnIn: Npc.Angel_City_Elder,
		rewards: {
			stones: 1906,
			exp: 7358 
		},
		unlocks: [Quest.Heart_Demon],
	},
	[Quest.Heart_Demon]: {
		level: 29,
		requires: [Quest.drum],
		acceptFrom: Npc.Angel_City_Elder,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Angel_City_Elder }, 
		],
		turnIn: Npc.Angel_City_Elder,
		rewards: {
			stones: 1906,
			exp: 7358 
		},
		unlocks: [Quest.The_mystery_of_toad_oil],
	},
	[Quest.The_mystery_of_toad_oil]: {
		level: 29,
		requires: [Quest.Heart_Demon],
		acceptFrom: Npc.Angel_City_Elder,
		steps: [
			{ type: QuestType.Collect, monster: Monster.Green_Leather_Frog, item: Item.Green_Frog_Drop, rate: 85, amount: 7 },  
		],
		turnIn: Npc.Angel_City_Elder,
		rewards: {
			stones: 1906,
			exp: 7358 
		},
		unlocks: [Quest.Deed],
	},
	[Quest.Deed]: {
		level: 30,
		requires: [Quest.The_mystery_of_toad_oil],
		acceptFrom: Npc.Angel_City_Elder,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Angel_City_Elder },  
		],
		turnIn: Npc.Angel_City_Elder,
		rewards: {
			gold: 5,
			stones: 1921,
			exp: 7468 // item 140040 which is used in next quest
		},
		unlocks: [Quest.Demon_General],
	},
	[Quest.Demon_General]: {
		level: 30,
		requires: [Quest.Deed],
		acceptFrom: Npc.Angel_City_Elder,
		steps: [
			{ type: QuestType.Kill, monster: Monster.Demon_General, amount: 1 },  // wants item 140040 from last quest, task 10 tech
		],
		turnIn: Npc.Priest,
		rewards: {
			gold: 5,
			stones: 1921,
			exp: 7468 
		},
		unlocks: [Quest.Demon_power_one],
	},
	[Quest.Demon_power_one]: {
		level: 31,
		requires: [Quest.Demon_General],
		acceptFrom: Npc.Priest,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Priest }, 
		],
		turnIn: Npc.Priest,
		rewards: {
			gold: 5,
			stones: 1976,
			exp: 5981 
		},
		unlocks: [Quest.Demon_power_two],
	},
	[Quest.Demon_power_two]: {
		level: 31,
		requires: [Quest.Demon_power_one],
		acceptFrom: Npc.Priest,
		steps: [
			{ type: QuestType.Kill, monster: Monster.Little_Devil, amount: 8 }, 
		],
		turnIn: Npc.Angel_City_Elder,
		rewards: {
			gold: 5,
			stones: 1976,
			exp: 5981 
		},
		unlocks: [Quest.Notice],
	},
	[Quest.Notice]: {
		level: 32,
		requires: [Quest.Demon_power_two],
		acceptFrom: Npc.Angel_City_Elder,
		steps: [
			{ type: QuestType.Talk, npc: Npc.FIRE_VILLAGE_CHIEF }, 
		],
		turnIn: Npc.FIRE_VILLAGE_CHIEF,
		rewards: {
			gold: 5,
			stones: 2021,
			exp: 6231 
		},
		unlocks: [Quest.investigation],
	},
	[Quest.investigation]: {
		level: 32,
		requires: [Quest.Notice],
		acceptFrom: Npc.Angel_City_Elder,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Mysterious_Merchant }, 
		],
		turnIn: Npc.Mysterious_Merchant,
		rewards: {
			gold: 5,
			stones: 2021,
			exp: 6231 
		},
		unlocks: [Quest.trade],
	},
	[Quest.trade]: {
		level: 32,
		requires: [Quest.investigation],
		acceptFrom: Npc.Mysterious_Merchant,
		steps: [
			{ type: QuestType.Collect, monster: Monster.Kappa, item: Item.Kappa_Drop, rate: 85, amount: 8 }, 
		],
		turnIn: Npc.Mysterious_Merchant,
		rewards: {
			gold: 5,
			stones: 2021,
			exp: 6231
		},
		unlocks: [Quest.violent],
	},
	[Quest.violent]: {
		level: 33,
		requires: [Quest.trade],
		acceptFrom: Npc.Mysterious_Merchant,
		steps: [
			{ type: QuestType.Kill, monster: Monster.Dog, amount: 6 }, 
			{ type: QuestType.Kill, monster: Monster.Noodle_Thief, amount: 6 }, 
		],
		turnIn: Npc.FIRE_VILLAGE_CHIEF,
		rewards: {
			gold: 5,
			stones: 2055,
			exp: 6415 
		},
		unlocks: [Quest.Seal],
	},
	[Quest.Seal]: {
		level: 33,
		requires: [Quest.violent],
		acceptFrom: Npc.FIRE_VILLAGE_CHIEF,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Hunter },
		],
		turnIn: Npc.FIRE_VILLAGE_CHIEF,
		rewards: {
			gold: 5,
			stones: 2055,
			exp: 6415 
		},
		unlocks: [Quest.Return_to_Angel_City],
	},
	[Quest.Return_to_Angel_City]: {
		level: 34,
		requires: [Quest.Seal],
		acceptFrom: Npc.FIRE_VILLAGE_CHIEF,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Angel_City_Elder },
		],
		turnIn: Npc.Angel_City_Elder,
		rewards: {
			gold: 5,
			stones: 2076,
			exp: 6522 
		},
		unlocks: [Quest.Method_of_rescue],
	},
	[Quest.Method_of_rescue]: {
		level: 34,
		requires: [Quest.Return_to_Angel_City],
		acceptFrom: Npc.Angel_City_Elder,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Priest },
		],
		turnIn: Npc.Chef,
		rewards: {
			gold: 5,
			stones: 2076,
			exp: 6522 
		},
		unlocks: [Quest.Spices],
	},
	[Quest.Spices]: {
		level: 34,
		requires: [Quest.Method_of_rescue],
		acceptFrom: Npc.Chef,
		steps: [
			{ type: QuestType.Collect, monster: Monster.Buns, item: Item.Kappa_Drop, rate: 85, amount: 8 }, 
		],
		turnIn: Npc.Priest,
		rewards: {
			gold: 5,
			stones: 2076,
			exp: 6522 
		},
		unlocks: [Quest.Fragrant_medicine],
	},
	[Quest.Fragrant_medicine]: {
		level: 35,
		requires: [Quest.Spices],
		acceptFrom: Npc.Priest,
		steps: [
			{ type: QuestType.Kill, monster: Monster.Hongchaun_Yatai, amount: 1 }, 
		],
		turnIn: Npc.Priest,
		rewards: {
			gold: 5,
			stones: 2084,
			exp: 6540 // item 140052 x1
		},
		unlocks: [Quest.Rescue_warrior],
	},
	[Quest.Rescue_warrior]: {
		level: 35,
		requires: [Quest.Fragrant_medicine],
		acceptFrom: Npc.Priest,
		steps: [
			{ type: QuestType.Kill, monster: Monster.Thunder, amount: 1 }, // requires 140052 task 10
		],
		turnIn: Npc.Master_Yuan,
		rewards: {
			gold: 5,
			stones: 2084,
			exp: 6540 // item 150324 x1
		},
		unlocks: [Quest.Fire_Devil],
	},
	[Quest.Fire_Devil]: {
		level: 36,
		requires: [Quest.Rescue_warrior],
		acceptFrom: Npc.Master_Yuan,
		steps: [
			{ type: QuestType.Kill, monster: Monster.Flame_Demon, amount: 9 },
		],
		turnIn: Npc.Angel_City_Elder,
		rewards: {
			gold: 5,
			stones: 2130,
			exp: 6823
		},
		unlocks: [Quest.Legendary_forbearance],
	},
	[Quest.Legendary_forbearance]: {
		level: 36,
		requires: [Quest.Fire_Devil],
		acceptFrom: Npc.Angel_City_Elder,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Kabuki },
		],
		turnIn: Npc.Kabuki,
		rewards: {
			gold: 5,
			stones: 2130,
			exp: 6823
		},
		unlocks: [Quest.Monko_Monko],
	},
	[Quest.Monko_Monko]: {
		level: 37,
		requires: [Quest.Legendary_forbearance],
		acceptFrom: Npc.Kabuki,
		steps: [
			{ type: QuestType.Collect, monster: Monster.Wild_Monk, item: Item.Wild_Monk_Drop, rate: 85, amount: 8 }, 
		],
		turnIn: Npc.Kabuki,
		rewards: {
			gold: 5,
			stones: 2167,
			exp: 7098
		},
		unlocks: [Quest.rumor_2],
	},
	[Quest.rumor_2]: {
		level: 37,
		requires: [Quest.Monko_Monko],
		acceptFrom: Npc.Kabuki,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Chef }, 
		],
		turnIn: Npc.Chef,
		rewards: {
			gold: 5,
			stones: 2167,
			exp: 7098
		},
		unlocks: [Quest.Green_Welle],
	},
	[Quest.Green_Welle]: {
		level: 38,
		requires: [Quest.rumor_2],
		acceptFrom: Npc.Chef,
		steps: [
			{ type: QuestType.Kill, monster: Monster.Ghost_Noodle, amount: 8 }, 
		],
		turnIn: Npc.Chef,
		rewards: {
			gold: 10,
			stones: 2194,
			exp: 7325
		},
		unlocks: [Quest.Ancient_ninja],
	},
	[Quest.Ancient_ninja]: {
		level: 38,
		requires: [Quest.Green_Welle],
		acceptFrom: Npc.Chef,
		steps: [
			{ type: QuestType.Kill, monster: Monster.Ancient_Ninja, amount: 8 }, 
		],
		turnIn: Npc.Chef,
		rewards: {
			gold: 10,
			stones: 2194,
			exp: 7325
		},
		unlocks: [Quest.The_treasures_of_the_stealing],
	},
	[Quest.The_treasures_of_the_stealing]: {
		level: 39,
		requires: [Quest.Ancient_ninja],
		acceptFrom: Npc.Chef,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Kabuki }, 
		],
		turnIn: Npc.Kabuki,
		rewards: {
			gold: 10,
			stones: 2212,
			exp: 7496
		},
		unlocks: [Quest.Recapture_treasure],
	},
	[Quest.Recapture_treasure]: {
		level: 39,
		requires: [Quest.The_treasures_of_the_stealing],
		acceptFrom: Npc.Kabuki,
		steps: [
			{ type: QuestType.Collect, monster: Monster.Pork_Gangster, item: Item.Pork_Gangster_Drop, rate: 85, amount: 9 },
		],
		turnIn: Npc.Chef,
		rewards: {
			gold: 10,
			stones: 2212,
			exp: 7496
		},
		unlocks: [Quest.Recognize_2],
	},
	[Quest.Recognize_2]: {
		level: 40,
		requires: [Quest.Recapture_treasure],
		acceptFrom: Npc.Chef,
		steps: [
			{ type: QuestType.Kill, monster: Monster.Guzhu_Xi_Shou, amount: 1 },
		],
		turnIn: Npc.Chef,
		rewards: {
			gold: 10,
			stones: 2219,
			exp: 7603
		},
		unlocks: [Quest.Magic_general],
	},
	[Quest.Magic_general]: {
		level: 40,
		requires: [Quest.Recognize_2],
		acceptFrom: Npc.Chef,
		steps: [
			{ type: QuestType.Collect, monster: Monster.Magic_General, item: Item.Magic_General_Drop, rate: 100, amount: 1 },
		],
		turnIn: Npc.Master_Yuan,
		rewards: {
			gold: 10,
			stones: 2219,
			exp: 7603
		},
		unlocks: [Quest.Invading_like_a_fire],
	},
	[Quest.Invading_like_a_fire]: {
		level: 40,
		requires: [Quest.Magic_general],
		acceptFrom: Npc.Master_Yuan,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Master_Yuan }, // Wants magic general drop from last quest
		],
		turnIn: Npc.Angel_City_Elder,
		rewards: {
			gold: 10,
			stones: 2219,
			exp: 7603
		},
		unlocks: [Quest.Special_service_player],
	},
	[Quest.Special_service_player]: {
		level: 41,
		requires: [Quest.Invading_like_a_fire],
		acceptFrom: Npc.Angel_City_Elder,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Master_Yuan },
		],
		turnIn: Npc.Master_Yuan,
		rewards: {
			gold: 10,
			stones: 2259,
			exp: 7829
		},
		unlocks: [Quest.Disappear],
	},
	[Quest.Disappear]: {
		level: 41,
		requires: [Quest.Special_service_player],
		acceptFrom: Npc.Master_Yuan,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Kabuki },
		],
		turnIn: Npc.Toad,
		rewards: {
			gold: 10,
			stones: 2259,
			exp: 7829
		},
		unlocks: [Quest.Charm],
	},
	[Quest.Charm]: {
		level: 41,
		requires: [Quest.Disappear],
		acceptFrom: Npc.Toad,
		steps: [
			{ type: QuestType.Kill, monster: Monster.Magic_Flute_Demon, amount: 10 },
		],
		turnIn: Npc.Toad,
		rewards: {
			gold: 10,
			stones: 2259,
			exp: 7829
		},
		unlocks: [Quest.Forest_land_change],
	},
	[Quest.Forest_land_change]: {
		level: 42,
		requires: [Quest.Charm],
		acceptFrom: Npc.Toad,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Craftsman },
		],
		turnIn: Npc.Craftsman,
		rewards: {
			gold: 10,
			stones: 2291,
			exp: 8036
		},
		unlocks: [Quest.Greedy_vulture],
	},
	[Quest.Greedy_vulture]: {
		level: 42,
		requires: [Quest.Forest_land_change],
		acceptFrom: Npc.Craftsman,
		steps: [
			{ type: QuestType.Kill, monster: Monster.Eagle, amount: 10 },
		],
		turnIn: Npc.Craftsman,
		rewards: {
			gold: 10,
			stones: 2291,
			exp: 8036
		},
		unlocks: [Quest.Roots],
	},
	[Quest.Roots]: {
		level: 43,
		requires: [Quest.Greedy_vulture],
		acceptFrom: Npc.Craftsman,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Priest },
		],
		turnIn: Npc.Priest,
		rewards: {
			gold: 10,
			stones: 2317,
			exp: 8189
		},
		unlocks: [Quest.Kill_blood_bats],
	},
	[Quest.Kill_blood_bats]: {
		level: 43,
		requires: [Quest.Roots],
		acceptFrom: Npc.Priest,
		steps: [
			{ type: QuestType.Kill, monster: Monster.Bloodsucking_Bat, amount: 10 },
		],
		turnIn: Npc.Craftsman,
		rewards: {
			gold: 10,
			stones: 2317,
			exp: 8189
		},
		unlocks: [Quest.Disaster],
	},
	[Quest.Disaster]: {
		level: 44,
		requires: [Quest.Kill_blood_bats],
		acceptFrom: Npc.Craftsman,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Master_Yuan },
		],
		turnIn: Npc.Master_Yuan,
		rewards: {
			gold: 10,
			stones: 2334,
			exp: 8280
		},
		unlocks: [Quest.Small_village_gangster],
	},
	[Quest.Small_village_gangster]: {
		level: 44,
		requires: [Quest.Disaster],
		acceptFrom: Npc.Master_Yuan,
		steps: [
			{ type: QuestType.Kill, monster: Monster.Mountain_Bandit, amount: 11 },
		],
		turnIn: Npc.Kabuki,
		rewards: {
			gold: 10,
			stones: 2334,
			exp: 8280
		},
		unlocks: [Quest.Punish_the_bandit],
	},
	[Quest.Punish_the_bandit]: {
		level: 45,
		requires: [Quest.Small_village_gangster],
		acceptFrom: Npc.Kabuki,
		steps: [
			{ type: QuestType.Kill, monster: Monster.Aka_Kou_Giant, amount: 1 },
		],
		turnIn: Npc.Kabuki,
		rewards: {
			gold: 10,
			stones: 2342,
			exp: 8301
		},
		unlocks: [Quest.Changes_in_wind],
	},
	[Quest.Changes_in_wind]: {
		level: 45,
		requires: [Quest.Punish_the_bandit],
		acceptFrom: Npc.Kabuki,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Chef },
		],
		turnIn: Npc.Chef,
		rewards: {
			gold: 10,
			stones: 2342,
			exp: 8301 // item 150325 x1
		},
		unlocks: [Quest.Reporter],
	},
	[Quest.Reporter]: {
		level: 46,
		requires: [Quest.Changes_in_wind],
		acceptFrom: Npc.Kabuki,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Angel_City_Elder },
		],
		turnIn: Npc.Angel_City_Elder,
		rewards: {
			gold: 15,
			stones: 2388,
			exp: 8532
		},
		unlocks: [Quest.Wind_Seal_Seal],
	},
	[Quest.Wind_Seal_Seal]: {
		level: 46,
		requires: [Quest.Reporter],
		acceptFrom: Npc.Angel_City_Elder,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Hunter },
		],
		turnIn: Npc.Angel_City_Elder,
		rewards: {
			gold: 15,
			stones: 2388,
			exp: 8532
		},
		unlocks: [Quest.Wind_Flute_One],
	},
	[Quest.Wind_Flute_One]: {
		level: 47,
		requires: [Quest.Wind_Seal_Seal],
		acceptFrom: Npc.Angel_City_Elder,
		steps: [
			{ type: QuestType.Collect, monster: Monster.Magic_Flute_Demon, item: Item.Magic_Flute_Demon_Drop, rate: 85, amount: 10 },
		],
		turnIn: Npc.Craftsman,
		rewards: {
			gold: 15,
			stones: 2429,
			exp: 8720
		},
		unlocks: [Quest.Wind_Flute_Two],
	},
	[Quest.Wind_Flute_Two]: {
		level: 47,
		requires: [Quest.Wind_Flute_One],
		acceptFrom: Npc.Craftsman,
		steps: [
			{ type: QuestType.Kill, monster: Monster.Morima, amount: 11 },
		],
		turnIn: Npc.Craftsman,
		rewards: {
			gold: 15,
			stones: 2429,
			exp: 8720
		},
		unlocks: [Quest.Wind_Flute_Three],
	},
	[Quest.Wind_Flute_Three]: {
		level: 48,
		requires: [Quest.Wind_Flute_Two],
		acceptFrom: Npc.Craftsman,
		steps: [
			{ type: QuestType.Collect, monster: Monster.Young_Eagle, item: Item.Young_Eagle_Drop, rate: 85, amount: 11 },
		],
		turnIn: Npc.Craftsman,
		rewards: {
			gold: 15,
			stones: 2465,
			exp: 8857
		},
		unlocks: [Quest.Artist],
	},
	[Quest.Artist]: {
		level: 48,
		requires: [Quest.Wind_Flute_Three],
		acceptFrom: Npc.Craftsman,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Craftsman }, // wants 140053
		],
		turnIn: Npc.Kabuki,
		rewards: {
			gold: 15,
			stones: 2465,
			exp: 8857
		},
		unlocks: [Quest.Tornado],
	},
	[Quest.Tornado]: {
		level: 49,
		requires: [Quest.Artist],
		acceptFrom: Npc.Kabuki,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Kabuki },
		],
		turnIn: Npc.Hunter,
		rewards: {
			gold: 15,
			stones: 2496,
			exp: 8940
		},
		unlocks: [Quest.Eliminate_the_wind_demon],
	},
	[Quest.Eliminate_the_wind_demon]: {
		level: 49,
		requires: [Quest.Tornado],
		acceptFrom: Npc.Sentry,
		steps: [
			{ type: QuestType.Kill, monster: Monster.Flame_Demon, amount: 12 },
		],
		turnIn: Npc.Sentry,
		rewards: {
			gold: 15,
			stones: 2496,
			exp: 8940
		},
		unlocks: [Quest.Demon_Joyo],
	},
	[Quest.Demon_Joyo]: {
		level: 49,
		requires: [Quest.Eliminate_the_wind_demon],
		acceptFrom: Npc.Sentry,
		steps: [
			{ type: QuestType.Collect, monster: Monster.Morima_Qianhe, item: Item.Magic_General_Drop, rate: 100, amount: 1 },
		],
		turnIn: Npc.Master_Yuan,
		rewards: {
			gold: 15,
			stones: 2496,
			exp: 8940
		},
		unlocks: [Quest.Like_a_wind],
	},
	[Quest.Like_a_wind]: {
		level: 50,
		requires: [Quest.Demon_Joyo],
		acceptFrom: Npc.Master_Yuan,
		steps: [
			{ type: QuestType.Talk, npc: Npc.Master_Yuan },
		],
		turnIn: Npc.Angel_City_Elder,
		rewards: {
			gold: 15,
			stones: 2520,
			exp: 8961
		},
		unlocks: [],
	},
}

module.exports = {
	Quest,
	Quests,
	QuestType
}