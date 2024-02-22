const ItemType = require('./types').Item;
const Stat = require('../lines').Stat;

module.exports = {
	110000: { type: ItemType.Gem, src: 'gems/36', price: 100, value: 30, innate: { level: 1, stat: Stat.Strength, value: 14 } },
	110001: { type: ItemType.Gem, src: 'gems/37', price: 300, value: 30, innate: { level: 10, stat: Stat.Strength, value: 21 } },
	110002: { type: ItemType.Gem, src: 'gems/38', price: 900, value: 30, innate: { level: 20, stat: Stat.Strength, value: 28 } },
	110003: { type: ItemType.Gem, src: 'gems/39', price: 2700, value: 30, innate: { level: 30, stat: Stat.Strength, value: 35 } },
	110004: { type: ItemType.Gem, src: 'gems/40', price: 5100, value: 30, innate: { level: 40, stat: Stat.Strength, value: 42 } },
	110005: { type: ItemType.Gem, src: 'gems/41', price: 7900, value: 30, innate: { level: 50, stat: Stat.Strength, value: 49 } },
	
	110100: { type: ItemType.Gem, src: 'gems/26', price: 100, value: 30, innate: { level: 1, stat: Stat.Agility, value: 14 } },
	110101: { type: ItemType.Gem, src: 'gems/27', price: 300, value: 30, innate: { level: 10, stat: Stat.Agility, value: 21 } },
	110102: { type: ItemType.Gem, src: 'gems/28', price: 900, value: 30, innate: { level: 20, stat: Stat.Agility, value: 28 } },
	110103: { type: ItemType.Gem, src: 'gems/29', price: 2700, value: 30, innate: { level: 30, stat: Stat.Agility, value: 35 } },
	110104: { type: ItemType.Gem, src: 'gems/30', price: 5100, value: 30, innate: { level: 40, stat: Stat.Agility, value: 42 } },
	110105: { type: ItemType.Gem, src: 'gems/31', price: 7900, value: 30, innate: { level: 50, stat: Stat.Agility, value: 49 } },
	
	110200: { type: ItemType.Gem, src: 'gems/46', price: 100, value: 30, innate: { level: 1, stat: Stat.Stamina, value: 14 } },
	110201: { type: ItemType.Gem, src: 'gems/47', price: 300, value: 30, innate: { level: 10, stat: Stat.Stamina, value: 21 } },
	110202: { type: ItemType.Gem, src: 'gems/48', price: 900, value: 30, innate: { level: 20, stat: Stat.Stamina, value: 28 } },
	110203: { type: ItemType.Gem, src: 'gems/49', price: 2700, value: 30, innate: { level: 30, stat: Stat.Stamina, value: 35 } },
	110204: { type: ItemType.Gem, src: 'gems/50', price: 5100, value: 30, innate: { level: 40, stat: Stat.Stamina, value: 42 } },
	110205: { type: ItemType.Gem, src: 'gems/51', price: 7900, value: 30, innate: { level: 50, stat: Stat.Stamina, value: 49 } },

	110300: { type: ItemType.Gem, src: 'gems/56', price: 100, value: 30, innate: { level: 1, stat: Stat.Speed_Multiplier, value: 12 } },
	110301: { type: ItemType.Gem, src: 'gems/57', price: 300, value: 30, innate: { level: 10, stat: Stat.Speed_Multiplier, value: 18 } },
	110302: { type: ItemType.Gem, src: 'gems/58', price: 900, value: 30, innate: { level: 20, stat: Stat.Speed_Multiplier, value: 24 } },
	110303: { type: ItemType.Gem, src: 'gems/59', price: 2700, value: 30, innate: { level: 30, stat: Stat.Speed_Multiplier, value: 30 } },
	110304: { type: ItemType.Gem, src: 'gems/50', price: 5100, value: 30, innate: { level: 40, stat: Stat.Speed_Multiplier, value: 36 } },
	110305: { type: ItemType.Gem, src: 'gems/61', price: 7900, value: 30, innate: { level: 50, stat: Stat.Speed_Multiplier, value: 42 } },

	110400: { type: ItemType.Gem, src: 'gems/96', price: 100, value: 30, innate: { level: 1, stat: Stat.Attack_Multiplier, value: 12 } },
	110401: { type: ItemType.Gem, src: 'gems/97', price: 300, value: 30, innate: { level: 10, stat: Stat.Attack_Multiplier, value: 18 } },
	110402: { type: ItemType.Gem, src: 'gems/98', price: 900, value: 30, innate: { level: 20, stat: Stat.Attack_Multiplier, value: 24 } },
	110403: { type: ItemType.Gem, src: 'gems/99', price: 2700, value: 30, innate: { level: 30, stat: Stat.Attack_Multiplier, value: 30 } },
	110404: { type: ItemType.Gem, src: 'gems/100', price: 5100, value: 30, innate: { level: 40, stat: Stat.Attack_Multiplier, value: 36 } },
	110405: { type: ItemType.Gem, src: 'gems/101', price: 7900, value: 30, innate: { level: 50, stat: Stat.Attack_Multiplier, value: 42 } },

	110500: { type: ItemType.Gem, src: 'gems/16', price: 100, value: 30, innate: { level: 1, stat: Stat.Max_Hp_Multiplier, value: 12 } },
	110501: { type: ItemType.Gem, src: 'gems/17', price: 300, value: 30, innate: { level: 10, stat: Stat.Max_Hp_Multiplier, value: 18 } },
	110502: { type: ItemType.Gem, src: 'gems/18', price: 900, value: 30, innate: { level: 20, stat: Stat.Max_Hp_Multiplier, value: 24 } },
	110503: { type: ItemType.Gem, src: 'gems/19', price: 2700, value: 30, innate: { level: 30, stat: Stat.Max_Hp_Multiplier, value: 30 } },
	110504: { type: ItemType.Gem, src: 'gems/20', price: 5100, value: 30, innate: { level: 40, stat: Stat.Max_Hp_Multiplier, value: 36 } },
	110505: { type: ItemType.Gem, src: 'gems/21', price: 7900, value: 30, innate: { level: 50, stat: Stat.Max_Hp_Multiplier, value: 42 } },

	110600: { type: ItemType.Gem, src: 'gems/66', price: 100, value: 30, innate: { level: 1, stat: Stat.Defense, value: 12 } },
	110601: { type: ItemType.Gem, src: 'gems/67', price: 300, value: 30, innate: { level: 10, stat: Stat.Defense, value: 18 } },
	110602: { type: ItemType.Gem, src: 'gems/68', price: 900, value: 30, innate: { level: 20, stat: Stat.Defense, value: 24 } },
	110603: { type: ItemType.Gem, src: 'gems/69', price: 2700, value: 30, innate: { level: 30, stat: Stat.Defense, value: 30 } },
	110604: { type: ItemType.Gem, src: 'gems/70', price: 5100, value: 30, innate: { level: 40, stat: Stat.Defense, value: 36 } },
	110605: { type: ItemType.Gem, src: 'gems/71', price: 7900, value: 30, innate: { level: 50, stat: Stat.Defense, value: 42 } },

	110700: { type: ItemType.Gem, src: 'gems/76', price: 100, value: 30, innate: { level: 1, stat: Stat.Max_Mp_Multiplier, value: 12 } },
	110701: { type: ItemType.Gem, src: 'gems/77', price: 300, value: 30, innate: { level: 10, stat: Stat.Max_Mp_Multiplier, value: 18 } },
	110702: { type: ItemType.Gem, src: 'gems/78', price: 900, value: 30, innate: { level: 20, stat: Stat.Max_Mp_Multiplier, value: 24 } },
	110703: { type: ItemType.Gem, src: 'gems/79', price: 2700, value: 30, innate: { level: 30, stat: Stat.Max_Mp_Multiplier, value: 30 } },
	110704: { type: ItemType.Gem, src: 'gems/80', price: 5100, value: 30, innate: { level: 40, stat: Stat.Max_Mp_Multiplier, value: 36 } },
	110705: { type: ItemType.Gem, src: 'gems/81', price: 7900, value: 30, innate: { level: 50, stat: Stat.Max_Mp_Multiplier, value: 42 } },

	110800: { type: ItemType.Gem, src: 'gems/86', price: 100, value: 30, innate: { level: 1, stat: Stat.Defense_Break, value: 12 } },
	110801: { type: ItemType.Gem, src: 'gems/87', price: 300, value: 30, innate: { level: 10, stat: Stat.Defense_Break, value: 18 } },
	110802: { type: ItemType.Gem, src: 'gems/88', price: 900, value: 30, innate: { level: 20, stat: Stat.Defense_Break, value: 24 } },
	110803: { type: ItemType.Gem, src: 'gems/89', price: 2700, value: 30, innate: { level: 30, stat: Stat.Defense_Break, value: 30 } },
	110804: { type: ItemType.Gem, src: 'gems/90', price: 5100, value: 30, innate: { level: 40, stat: Stat.Defense_Break, value: 36 } },
	110805: { type: ItemType.Gem, src: 'gems/91', price: 7900, value: 30, innate: { level: 50, stat: Stat.Defense_Break, value: 42 } },
}