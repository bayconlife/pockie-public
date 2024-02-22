const ItemType = require('./types').Item;
const Stat = require('../lines').Stat;

const Sets = {
	8160: {
		total: 7,
		bonus: {
			2: [Stat.Stamina, 28],
			4: [Stat.Strength, 28],
			7: [Stat.Agility, 28]
		}
	},
	8161: {
		total: 7,
		bonus: {
			2: [Stat.Critical_Multiplier, 25],
			4: [Stat.Hit, 43],
			7: [Stat.Pierce, 43]
		}
	},
	8210: {
		total: 4,
		bonus: {
			2: [Stat.Max_Mp, 13],
			3: [Stat.Dodge, 40],
			4: [Stat.Parry_Multiplier, 40]
		}
	},
	8260: {
		total: 7,
		bonus: {
			2: [Stat.Stamina, 32],
			4: [Stat.Strength, 32],
			7: [Stat.Agility, 32]
		}
	},
	8261: {
		total: 7,
		bonus: {
			2: [Stat.Critical_Multiplier, 27],
			4: [Stat.Hit, 47],
			7: [Stat.Pierce, 47]
		}
	},
	8310: {
		total: 4,
		bonus: {
			2: [Stat.Max_Mp, 24],
			3: [Stat.Dodge, 44],
			4: [Stat.Parry_Multiplier, 44]
		}
	},
	8311: {
		total: 4,
		bonus: {
			2: [Stat.Toughness, 32],
			3: [Stat.Speed_Multiplier, 20],
			4: [Stat.Defense, 34]
		}
	},
	8360: {
		total: 7,
		bonus: {
			2: [Stat.Stamina, 39],
			4: [Stat.Strength, 39],
			7: [Stat.Agility, 39]
		}
	},
	8361: {
		total: 7,
		bonus: {
			2: [Stat.Critical_Multiplier, 30],
			4: [Stat.Hit, 51],
			7: [Stat.Pierce, 51]
		}
	},
	8362: {
		total: 7,
		bonus: {
			2: [Stat.Max_Hp, 19],
			4: [Stat.Parry_Multiplier, 28],
			7: [Stat.SkillAdd0, 30]
		}
	},
	8410: {
		total: 4,
		bonus: {
			2: [Stat.Max_Mp, 33],
			3: [Stat.Dodge, 47],
			4: [Stat.Parry_Multiplier, 47]
		}
	},
	8411: {
		total: 4,
		bonus: {
			2: [Stat.Toughness, 35],
			3: [Stat.Speed_Multiplier, 25],
			4: [Stat.Defense, 43]
		}
	},
	8412: {
		total: 4,
		bonus: {
			2: [Stat.Stamina, 38],
			3: [Stat.Strength, 38],
			4: [Stat.Agility, 38]
		}
	},
	8460: {
		total: 7,
		bonus: {
			2: [Stat.Stamina, 43],
			4: [Stat.Strength, 43],
			7: [Stat.Agility, 43]
		}
	},
	8461: {
		total: 7,
		bonus: {
			2: [Stat.Critical_Multiplier, 32],
			4: [Stat.Hit, 53],
			7: [Stat.Pierce, 53]
		}
	},
	8462: {
		total: 7,
		bonus: {
			2: [Stat.Defense_Break, 36],
			4: [Stat.Critical_Multiplier, 32],
			7: [Stat.SkillAdd0, 30]
		}
	},
}

const Items = {
	331601: { type: ItemType.Body, src: 'armors/25', size: 4, value: 11, price: 64, innate: { level: 17, defense: 119, set: 8160 }},
	331602: { type: ItemType.Helm, src: 'helmets/25', size: 4, value: 11, price: 53, innate: { level: 13, defense: 34, set: 8160 }},
	331603: { type: ItemType.Shoes, src: 'shoes/25', size: 4, value: 11, price: 55, innate: { level: 15, defense: 28, set: 8160 }},
	331604: { type: ItemType.Amulet, src: 'amulets/25', size: 1, value: 11, price: 81, innate: { level: 14, set: 8160 }},
	331605: { type: ItemType.Gloves, src: 'gloves/25', size: 4, value: 11, price: 58, innate: { level: 18, defense: 30, set: 8160 }},
	331606: { type: ItemType.Belt, src: 'belts/25', size: 4, value: 11, price: 59, innate: { level: 19, defense: 25, set: 8160 }},
	331607: { type: ItemType.Ring, src: 'rings/25', size: 1, value: 11, price: 90, innate: { level: 20,  set: 8160 }},

	331611: { type: ItemType.Body, src: 'armors/15', size: 4, value: 11, price: 64, innate: { level: 17, defense: 119, set: 8161 }},
	331612: { type: ItemType.Helm, src: 'helmets/15', size: 4, value: 11, price: 53, innate: { level: 13, defense: 34, set: 8161 }},
	331613: { type: ItemType.Shoes, src: 'shoes/15', size: 4, value: 11, price: 55, innate: { level: 15, defense: 28, set: 8161 }},
	331614: { type: ItemType.Amulet, src: 'amulets/15', size: 1, value: 11, price: 81, innate: { level: 14, set: 8161 }},
	331615: { type: ItemType.Gloves, src: 'gloves/15', size: 4, value: 11, price: 58, innate: { level: 18, defense: 30, set: 8161 }},
	331616: { type: ItemType.Belt, src: 'belts/15', size: 4, value: 11, price: 59, innate: { level: 19, defense: 25, set: 8161 }},
	331617: { type: ItemType.Ring, src: 'rings/15', size: 1, value: 11, price: 90, innate: { level: 20,  set: 8161 }},

	332101: { type: ItemType.Body, src: 'armors/5', size: 4, value: 11, price: 74, innate: { level: 21, defense: 151, set: 8210 }},
	332102: { type: ItemType.Helm, src: 'helmets/5', size: 4, value: 11, price: 62, innate: { level: 21, defense: 44, set: 8210 }},
	332103: { type: ItemType.Shoes, src: 'shoes/5', size: 4, value: 11, price: 64, innate: { level: 21, defense: 36, set: 8210 }},
	332104: { type: ItemType.Amulet, src: 'amulets/5', size: 1, value: 11, price: 95, innate: { level: 21, set: 8210 }},

	332601: { type: ItemType.Body, src: 'armors/26', size: 4, value: 21, price: 74, innate: { level: 27, defense: 151, set: 8260 }},
	332602: { type: ItemType.Helm, src: 'helmets/26', size: 4, value: 21, price: 62, innate: { level: 23, defense: 44, set: 8260 }},
	332603: { type: ItemType.Shoes, src: 'shoes/26', size: 4, value: 21, price: 64, innate: { level: 25, defense: 36, set: 8260 }},
	332604: { type: ItemType.Amulet, src: 'amulets/26', size: 1, value: 21, price: 95, innate: { level: 24, set: 8260 }},
	332605: { type: ItemType.Gloves, src: 'gloves/26', size: 4, value: 21, price: 66, innate: { level: 28, defense: 38, set: 8260 }},
	332606: { type: ItemType.Belt, src: 'belts/26', size: 4, value: 21, price: 67, innate: { level: 29, defense: 32, set: 8260 }},
	332607: { type: ItemType.Ring, src: 'rings/26', size: 1, value: 21, price: 102, innate: { level: 30,  set: 8260 }},

	332611: { type: ItemType.Body, src: 'armors/16', size: 4, value: 21, price: 74, innate: { level: 27, defense: 151, set: 8261 }},
	332612: { type: ItemType.Helm, src: 'helmets/16', size: 4, value: 21, price: 62, innate: { level: 23, defense: 44, set: 8261 }},
	332613: { type: ItemType.Shoes, src: 'shoes/16', size: 4, value: 21, price: 64, innate: { level: 25, defense: 36, set: 8261 }},
	332614: { type: ItemType.Amulet, src: 'amulets/16', size: 1, value: 21, price: 95, innate: { level: 24, set: 8260 }},
	332615: { type: ItemType.Gloves, src: 'gloves/16', size: 4, value: 21, price: 66, innate: { level: 28, defense: 38, set: 8261 }},
	332616: { type: ItemType.Belt, src: 'belts/16', size: 4, value: 21, price: 67, innate: { level: 29, defense: 32, set: 8261 }},
	332617: { type: ItemType.Ring, src: 'rings/16', size: 1, value: 21, price: 102, innate: { level: 30,  set: 8261 }},

	333101: { type: ItemType.Body, src: 'armors/6', size: 4, value: 11, price: 82, innate: { level: 31, defense: 183, set: 8310 }},
	333102: { type: ItemType.Helm, src: 'helmets/6', size: 4, value: 11, price: 70, innate: { level: 31, defense: 55, set: 8310 }},
	333103: { type: ItemType.Shoes, src: 'shoes/6', size: 4, value: 11, price: 71, innate: { level: 31, defense: 44, set: 8310 }},
	333104: { type: ItemType.Amulet, src: 'amulets/6', size: 1, value: 11, price: 106, innate: { level: 31, set: 8310 }},

	333111: { type: ItemType.Body, src: 'armors/27', size: 4, value: 11, price: 82, innate: { level: 31, defense: 183, set: 8310 }},
	333112: { type: ItemType.Helm, src: 'helmets/27', size: 4, value: 11, price: 70, innate: { level: 31, defense: 55, set: 8310 }},
	333113: { type: ItemType.Shoes, src: 'shoes/27', size: 4, value: 11, price: 71, innate: { level: 31, defense: 44, set: 8310 }},
	333114: { type: ItemType.Amulet, src: 'amulets/27', size: 1, value: 11, price: 106, innate: { level: 31, set: 8310 }},

	333601: { type: ItemType.Body, src: 'armors/17', size: 4, value: 31, price: 82, innate: { level: 37, defense: 183, set: 8360 }},
	333602: { type: ItemType.Helm, src: 'helmets/17', size: 4, value: 31, price: 70, innate: { level: 33, defense: 55, set: 8360 }},
	333603: { type: ItemType.Shoes, src: 'shoes/17', size: 4, value: 31, price: 71, innate: { level: 35, defense: 44, set: 8360 }},
	333604: { type: ItemType.Amulet, src: 'amulets/17', size: 1, value: 31, price: 106, innate: { level: 34, set: 8360 }},
	333605: { type: ItemType.Gloves, src: 'gloves/17', size: 4, value: 31, price: 73, innate: { level: 38, defense: 46, set: 8360 }},
	333606: { type: ItemType.Belt, src: 'belts/17', size: 4, value: 31, price: 74, innate: { level: 39, defense: 39, set: 8360 }},
	333607: { type: ItemType.Ring, src: 'rings/17', size: 1, value: 31, price: 112, innate: { level: 40,  set: 8360 }},

	333611: { type: ItemType.Body, src: 'armors/7', size: 4, value: 31, price: 82, innate: { level: 37, defense: 183, set: 8361 }},
	333612: { type: ItemType.Helm, src: 'helmets/7', size: 4, value: 31, price: 70, innate: { level: 33, defense: 55, set: 8361 }},
	333613: { type: ItemType.Shoes, src: 'shoes/7', size: 4, value: 31, price: 71, innate: { level: 35, defense: 44, set: 8361 }},
	333614: { type: ItemType.Amulet, src: 'amulets/7', size: 1, value: 31, price: 106, innate: { level: 34, set: 8361 }},
	333615: { type: ItemType.Gloves, src: 'gloves/7', size: 4, value: 31, price: 73, innate: { level: 38, defense: 46, set: 8361 }},
	333616: { type: ItemType.Belt, src: 'belts/7', size: 4, value: 31, price: 74, innate: { level: 39, defense: 39, set: 8361 }},
	333617: { type: ItemType.Ring, src: 'rings/7', size: 1, value: 31, price: 112, innate: { level: 40,  set: 8361 }},

	333621: { type: ItemType.Body, src: 'armors/28', size: 4, value: 31, price: 82, innate: { level: 37, defense: 183, set: 8362 }},
	333622: { type: ItemType.Helm, src: 'helmets/28', size: 4, value: 31, price: 70, innate: { level: 33, defense: 55, set: 8362 }},
	333623: { type: ItemType.Shoes, src: 'shoes/28', size: 4, value: 31, price: 71, innate: { level: 35, defense: 44, set: 8362 }},
	333624: { type: ItemType.Amulet, src: 'amulets/28', size: 1, value: 31, price: 106, innate: { level: 34, set: 8362 }},
	333625: { type: ItemType.Gloves, src: 'gloves/28', size: 4, value: 31, price: 73, innate: { level: 38, defense: 46, set: 8362 }},
	333626: { type: ItemType.Belt, src: 'belts/28', size: 4, value: 31, price: 74, innate: { level: 39, defense: 39, set: 8362 }},
	333627: { type: ItemType.Ring, src: 'rings/28', size: 1, value: 31, price: 112, innate: { level: 40,  set: 8362 }},

	334101: { type: ItemType.Body, src: 'armors/18', size: 4, value: 11, price: 89, innate: { level: 41, defense: 215, set: 8410 }},
	334102: { type: ItemType.Helm, src: 'helmets/18', size: 4, value: 11, price: 77, innate: { level: 41, defense: 65, set: 8410 }},
	334103: { type: ItemType.Shoes, src: 'shoes/18', size: 4, value: 11, price: 78, innate: { level: 41, defense: 52, set: 8410 }},
	334104: { type: ItemType.Amulet, src: 'amulets/18', size: 1, value: 11, price: 116, innate: { level: 41, set: 8410 }},

	334111: { type: ItemType.Body, src: 'armors/8', size: 4, value: 11, price: 89, innate: { level: 41, defense: 215, set: 8411 }},
	334112: { type: ItemType.Helm, src: 'helmets/8', size: 4, value: 11, price: 77, innate: { level: 41, defense: 65, set: 8411 }},
	334113: { type: ItemType.Shoes, src: 'shoes/8', size: 4, value: 11, price: 78, innate: { level: 41, defense: 52, set: 8411 }},
	334114: { type: ItemType.Amulet, src: 'amulets/8', size: 1, value: 11, price: 116, innate: { level: 41, set: 8411 }},

	334121: { type: ItemType.Body, src: 'armors/29', size: 4, value: 11, price: 89, innate: { level: 41, defense: 215, set: 8412 }},
	334122: { type: ItemType.Helm, src: 'helmets/29', size: 4, value: 11, price: 77, innate: { level: 41, defense: 65, set: 8412 }},
	334123: { type: ItemType.Shoes, src: 'shoes/29', size: 4, value: 11, price: 78, innate: { level: 41, defense: 52, set: 8412 }},
	334124: { type: ItemType.Amulet, src: 'amulets/29', size: 1, value: 11, price: 116, innate: { level: 41, set: 8412 }},

	334601: { type: ItemType.Body, src: 'armors/19', size: 4, value: 41, price: 89, innate: { level: 47, defense: 215, set: 8460 }},
	334602: { type: ItemType.Helm, src: 'helmets/19', size: 4, value: 41, price: 77, innate: { level: 43, defense: 65, set: 8460 }},
	334603: { type: ItemType.Shoes, src: 'shoes/19', size: 4, value: 41, price: 78, innate: { level: 45, defense: 52, set: 8460 }},
	334604: { type: ItemType.Amulet, src: 'amulets/19', size: 1, value: 41, price: 116, innate: { level: 44, set: 8460 }},
	334605: { type: ItemType.Gloves, src: 'gloves/19', size: 4, value: 41, price: 80, innate: { level: 48, defense: 54, set: 8460 }},
	334606: { type: ItemType.Belt, src: 'belts/19', size: 4, value: 41, price: 80, innate: { level: 49, defense: 45, set: 8460 }},
	334607: { type: ItemType.Ring, src: 'rings/19', size: 1, value: 41, price: 122, innate: { level: 50,  set: 8460 }},

	334611: { type: ItemType.Body, src: 'armors/9', size: 4, value: 41, price: 89, innate: { level: 47, defense: 215, set: 8461 }},
	334612: { type: ItemType.Helm, src: 'helmets/9', size: 4, value: 41, price: 77, innate: { level: 43, defense: 65, set: 8461 }},
	334613: { type: ItemType.Shoes, src: 'shoes/9', size: 4, value: 41, price: 78, innate: { level: 45, defense: 52, set: 8461 }},
	334614: { type: ItemType.Amulet, src: 'amulets/9', size: 1, value: 41, price: 116, innate: { level: 44, set: 8461 }},
	334615: { type: ItemType.Gloves, src: 'gloves/9', size: 4, value: 41, price: 80, innate: { level: 48, defense: 54, set: 8461 }},
	334616: { type: ItemType.Belt, src: 'belts/9', size: 4, value: 41, price: 80, innate: { level: 49, defense: 45, set: 8461 }},
	334617: { type: ItemType.Ring, src: 'rings/9', size: 1, value: 41, price: 122, innate: { level: 50,  set: 8461 }},

	334621: { type: ItemType.Body, src: 'armors/30', size: 4, value: 41, price: 89, innate: { level: 47, defense: 215, set: 8462 }},
	334622: { type: ItemType.Helm, src: 'helmets/30', size: 4, value: 41, price: 77, innate: { level: 43, defense: 65, set: 8462 }},
	334623: { type: ItemType.Shoes, src: 'shoes/30', size: 4, value: 41, price: 78, innate: { level: 45, defense: 52, set: 8462 }},
	334624: { type: ItemType.Amulet, src: 'amulets/30', size: 1, value: 41, price: 116, innate: { level: 44, set: 8462 }},
	334625: { type: ItemType.Gloves, src: 'gloves/30', size: 4, value: 41, price: 80, innate: { level: 48, defense: 54, set: 8462 }},
	334626: { type: ItemType.Belt, src: 'belts/30', size: 4, value: 41, price: 80, innate: { level: 49, defense: 45, set: 8462 }},
	334627: { type: ItemType.Ring, src: 'rings/30', size: 1, value: 41, price: 122, innate: { level: 50,  set: 8462 }},
}

module.exports = {
	Sets,
	Items
}