const ItemType = require('./types').Item;
const Stat = require('../../../lines').Stat;

module.exports = {
	// Strength (Fixed)
	110101: { type: ItemType.Gem, src: 'gems/36', price: 100, value: 30, innate: { level: 1, stat: Stat.Strength, value: 40 } },
	110102: { type: ItemType.Gem, src: 'gems/37', price: 300, value: 30, innate: { level: 10, stat: Stat.Strength, value: 50 } },
	110103: { type: ItemType.Gem, src: 'gems/38', price: 900, value: 30, innate: { level: 20, stat: Stat.Strength, value: 60 } },
	110104: { type: ItemType.Gem, src: 'gems/39', price: 2700, value: 30, innate: { level: 30, stat: Stat.Strength, value: 70 } },
	110105: { type: ItemType.Gem, src: 'gems/40', price: 5100, value: 30, innate: { level: 40, stat: Stat.Strength, value: 80 } },
	110106: { type: ItemType.Gem, src: 'gems/41', price: 7900, value: 30, innate: { level: 50, stat: Stat.Strength, value: 90 } },
	
	// Agility (Fixed)
	110201: { type: ItemType.Gem, src: 'gems/26', price: 100, value: 30, innate: { level: 1, stat: Stat.Agility, value: 44 } },
	110202: { type: ItemType.Gem, src: 'gems/27', price: 300, value: 30, innate: { level: 10, stat: Stat.Agility, value: 55 } },
	110203: { type: ItemType.Gem, src: 'gems/28', price: 900, value: 30, innate: { level: 20, stat: Stat.Agility, value: 66 } },
	110204: { type: ItemType.Gem, src: 'gems/29', price: 2700, value: 30, innate: { level: 30, stat: Stat.Agility, value: 77 } },
	110205: { type: ItemType.Gem, src: 'gems/30', price: 5100, value: 30, innate: { level: 40, stat: Stat.Agility, value: 88 } },
	110206: { type: ItemType.Gem, src: 'gems/31', price: 7900, value: 30, innate: { level: 50, stat: Stat.Agility, value: 99 } },
	
	// Stamina (Fixed)
	110301: { type: ItemType.Gem, src: 'gems/46', price: 100, value: 30, innate: { level: 1, stat: Stat.Stamina, value: 40 } },
	110302: { type: ItemType.Gem, src: 'gems/47', price: 300, value: 30, innate: { level: 10, stat: Stat.Stamina, value: 50 } },
	110303: { type: ItemType.Gem, src: 'gems/48', price: 900, value: 30, innate: { level: 20, stat: Stat.Stamina, value: 60 } },
	110304: { type: ItemType.Gem, src: 'gems/49', price: 2700, value: 30, innate: { level: 30, stat: Stat.Stamina, value: 74 } },
	110305: { type: ItemType.Gem, src: 'gems/50', price: 5100, value: 30, innate: { level: 40, stat: Stat.Stamina, value: 80 } },
	110306: { type: ItemType.Gem, src: 'gems/51', price: 7900, value: 30, innate: { level: 50, stat: Stat.Stamina, value: 90 } },

	// Speed (Multiplier)
	110401: { type: ItemType.Gem, src: 'gems/56', price: 100, value: 30, innate: { level: 1, stat: Stat.Speed_Multiplier, value: 4 } },
	110402: { type: ItemType.Gem, src: 'gems/57', price: 300, value: 30, innate: { level: 10, stat: Stat.Speed_Multiplier, value: 6 } },
	110403: { type: ItemType.Gem, src: 'gems/58', price: 900, value: 30, innate: { level: 20, stat: Stat.Speed_Multiplier, value: 8 } },
	110404: { type: ItemType.Gem, src: 'gems/59', price: 2700, value: 30, innate: { level: 30, stat: Stat.Speed_Multiplier, value: 10 } },
	110405: { type: ItemType.Gem, src: 'gems/50', price: 5100, value: 30, innate: { level: 40, stat: Stat.Speed_Multiplier, value: 12 } },
	110406: { type: ItemType.Gem, src: 'gems/61', price: 7900, value: 30, innate: { level: 50, stat: Stat.Speed_Multiplier, value: 14 } },

	// Attack (Multiplier)
	110501: { type: ItemType.Gem, src: 'gems/96', price: 100, value: 30, innate: { level: 1, stat: Stat.Attack_Multiplier, value: 4 } },
	110502: { type: ItemType.Gem, src: 'gems/97', price: 300, value: 30, innate: { level: 10, stat: Stat.Attack_Multiplier, value: 6 } },
	110503: { type: ItemType.Gem, src: 'gems/98', price: 900, value: 30, innate: { level: 20, stat: Stat.Attack_Multiplier, value: 8 } },
	110504: { type: ItemType.Gem, src: 'gems/99', price: 2700, value: 30, innate: { level: 30, stat: Stat.Attack_Multiplier, value: 10 } },
	110505: { type: ItemType.Gem, src: 'gems/100', price: 5100, value: 30, innate: { level: 40, stat: Stat.Attack_Multiplier, value: 12 } },
	110506: { type: ItemType.Gem, src: 'gems/101', price: 7900, value: 30, innate: { level: 50, stat: Stat.Attack_Multiplier, value: 14 } },

	// Max Health (Multiplier)
	110601: { type: ItemType.Gem, src: 'gems/16', price: 100, value: 30, innate: { level: 1, stat: Stat.Max_Hp_Multiplier, value: 5 } },
	110602: { type: ItemType.Gem, src: 'gems/17', price: 300, value: 30, innate: { level: 10, stat: Stat.Max_Hp_Multiplier, value: 7 } },
	110603: { type: ItemType.Gem, src: 'gems/18', price: 900, value: 30, innate: { level: 20, stat: Stat.Max_Hp_Multiplier, value: 9 } },
	110604: { type: ItemType.Gem, src: 'gems/19', price: 2700, value: 30, innate: { level: 30, stat: Stat.Max_Hp_Multiplier, value: 11 } },
	110605: { type: ItemType.Gem, src: 'gems/20', price: 5100, value: 30, innate: { level: 40, stat: Stat.Max_Hp_Multiplier, value: 13 } },
	110606: { type: ItemType.Gem, src: 'gems/21', price: 7900, value: 30, innate: { level: 50, stat: Stat.Max_Hp_Multiplier, value: 15 } },
}