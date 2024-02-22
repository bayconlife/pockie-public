const ItemType = require('../../../items/types').Item;
const Stat = require('../../../lines').Stat;

module.exports = {
	400000: { type: ItemType.Enchantment, src: 'gems/1', price: 1, value: 1, innate: { level: 1, types: [ItemType.Weapon], stats: [
		{ stat: Stat.Max_Attack, value: 1 }
	] }},
	402101: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Weapon], stats: [
		{ stat: Stat.Critical_Multiplier, value: 13 }
	] }},
	402102: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Weapon], stats: [
		{ stat: Stat.Critical_Multiplier, value: 10 },
		{ stat: Stat.Hit, value: 4 }
	] }},
	402103: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Weapon], stats: [
		{ stat: Stat.Critical_Multiplier, value: 10 },
		{ stat: Stat.Pierce, value: 4 }
	] }},
	402104: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Weapon], stats: [
		{ stat: Stat.Critical_Multiplier, value: 8 },
		{ stat: Stat.Defense_Break, value: 11 }
	] }},
	402105: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Weapon], stats: [
		{ stat: Stat.Critical_Multiplier, value: 4 },
		{ stat: Stat.Max_Attack, value: 1 }
	] }},
	403101: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Weapon], stats: [
		{ stat: Stat.Critical_Multiplier, value: 14 }
	] }},
	403102: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Weapon], stats: [
		{ stat: Stat.Critical_Multiplier, value: 11 },
		{ stat: Stat.Hit, value: 5 }
	] }},
	403103: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Weapon], stats: [
		{ stat: Stat.Critical_Multiplier, value: 11 },
		{ stat: Stat.Pierce, value: 5 }
	] }},
	403104: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Weapon], stats: [
		{ stat: Stat.Critical_Multiplier, value: 9 },
		{ stat: Stat.Defense_Break, value: 13 }
	] }},
	403105: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Weapon], stats: [
		{ stat: Stat.Critical_Multiplier, value: 5 },
		{ stat: Stat.Max_Attack, value: 2 }
	] }},
	404101: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Weapon], stats: [
		{ stat: Stat.Critical_Multiplier, value: 15 }
	] }},
	404102: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Weapon], stats: [
		{ stat: Stat.Critical_Multiplier, value: 12 },
		{ stat: Stat.Hit, value: 6 }
	] }},
	404103: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Weapon], stats: [
		{ stat: Stat.Critical_Multiplier, value: 12 },
		{ stat: Stat.Pierce, value: 6 }
	] }},
	404104: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Weapon], stats: [
		{ stat: Stat.Critical_Multiplier, value: 10 },
		{ stat: Stat.Defense_Break, value: 16 }
	] }},
	404105: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Weapon], stats: [
		{ stat: Stat.Critical_Multiplier, value: 6 },
		{ stat: Stat.Max_Attack, value: 3 }
	] }},


	412101: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Hat, ItemType.Gloves], stats: [
		{ stat: Stat.Parry_Multiplier, value: 16 },
	] }},
	412102: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Hat, ItemType.Gloves], stats: [
		{ stat: Stat.Parry_Multiplier, value: 13 },
		{ stat: Stat.Dodge, value: 6 } 
	] }},
	412103: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Hat, ItemType.Gloves], stats: [
		{ stat: Stat.Parry_Multiplier, value: 10 },
		{ stat: Stat.Toughness, value: 5 } 
	] }},
	412104: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Hat, ItemType.Gloves], stats: [
		{ stat: Stat.Parry_Multiplier, value: 5 },
		{ stat: Stat.Defense, value: 9 } 
	] }},
	413101: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Hat, ItemType.Gloves], stats: [
		{ stat: Stat.Parry_Multiplier, value: 17 },
	] }},
	413102: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Hat, ItemType.Gloves], stats: [
		{ stat: Stat.Parry_Multiplier, value: 14 },
		{ stat: Stat.Dodge, value: 7 } 
	] }},
	413103: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Hat, ItemType.Gloves], stats: [
		{ stat: Stat.Parry_Multiplier, value: 11 },
		{ stat: Stat.Toughness, value: 6 } 
	] }},
	413104: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Hat, ItemType.Gloves], stats: [
		{ stat: Stat.Parry_Multiplier, value: 6 },
		{ stat: Stat.Defense, value: 10 } 
	] }},
	414101: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Hat, ItemType.Gloves], stats: [
		{ stat: Stat.Parry_Multiplier, value: 18 },
	] }},
	414102: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Hat, ItemType.Gloves], stats: [
		{ stat: Stat.Parry_Multiplier, value: 15 },
		{ stat: Stat.Dodge, value: 8 } 
	] }},
	414103: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Hat, ItemType.Gloves], stats: [
		{ stat: Stat.Parry_Multiplier, value: 12 },
		{ stat: Stat.Toughness, value: 7 } 
	] }},
	414104: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Hat, ItemType.Gloves], stats: [
		{ stat: Stat.Parry_Multiplier, value: 7 },
		{ stat: Stat.Defense, value: 11 } 
	] }},

	422101: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Ring, ItemType.Amulet], stats: [
		{ stat: Stat.Critical_Multiplier, value: 13 }
	] }},
	422102: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Ring, ItemType.Amulet], stats: [
		{ stat: Stat.Critical_Multiplier, value: 10 },
		{ stat: Stat.Hit, value: 4 }
	] }},
	422103: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Ring, ItemType.Amulet], stats: [
		{ stat: Stat.Critical_Multiplier, value: 10 },
		{ stat: Stat.Pierce, value: 4 }
	] }},
	422104: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Ring, ItemType.Amulet], stats: [
		{ stat: Stat.Critical_Multiplier, value: 8 },
		{ stat: Stat.Defense_Break, value: 11 }
	] }},
	423101: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Ring, ItemType.Amulet], stats: [
		{ stat: Stat.Critical_Multiplier, value: 14 }
	] }},
	423102: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Ring, ItemType.Amulet], stats: [
		{ stat: Stat.Critical_Multiplier, value: 11 },
		{ stat: Stat.Hit, value: 5 }
	] }},
	423103: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Ring, ItemType.Amulet], stats: [
		{ stat: Stat.Critical_Multiplier, value: 11 },
		{ stat: Stat.Pierce, value: 5 }
	] }},
	423104: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Ring, ItemType.Amulet], stats: [
		{ stat: Stat.Critical_Multiplier, value: 9 },
		{ stat: Stat.Defense_Break, value: 13 }
	] }},
	424101: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Ring, ItemType.Amulet], stats: [
		{ stat: Stat.Critical_Multiplier, value: 15 }
	] }},
	424102: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Ring, ItemType.Amulet], stats: [
		{ stat: Stat.Critical_Multiplier, value: 12 },
		{ stat: Stat.Hit, value: 6 }
	] }},
	424103: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Ring, ItemType.Amulet], stats: [
		{ stat: Stat.Critical_Multiplier, value: 12 },
		{ stat: Stat.Pierce, value: 6 }
	] }},
	424104: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Ring, ItemType.Amulet], stats: [
		{ stat: Stat.Critical_Multiplier, value: 10 },
		{ stat: Stat.Defense_Break, value: 15 }
	] }},



	432101: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Body], stats: [
		{ stat: Stat.Parry_Multiplier, value: 10 },
		{ stat: Stat.Dodge, value: 10 }
	] }},
	432102: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Body], stats: [
		{ stat: Stat.Parry_Multiplier, value: 8 },
		{ stat: Stat.Dodge, value: 8 } ,
		{ stat: Stat.Toughness, value: 4 } 
	] }},
	432103: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Body], stats: [
		{ stat: Stat.Parry_Multiplier, value: 10 },
		{ stat: Stat.Dodge, value: 10 },
		{ stat: Stat.Defense, value: 2 } 
	] }},
	432104: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Body], stats: [
		{ stat: Stat.Parry_Multiplier, value: 7 },
		{ stat: Stat.Dodge, value: 7 },
		{ stat: Stat.Max_Hp, value: 3 } 
	] }},
	433101: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Body], stats: [
		{ stat: Stat.Parry_Multiplier, value: 11 },
		{ stat: Stat.Dodge, value: 11 }
	] }},
	433102: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Body], stats: [
		{ stat: Stat.Parry_Multiplier, value: 9 },
		{ stat: Stat.Dodge, value: 9 } ,
		{ stat: Stat.Toughness, value: 5 } 
	] }},
	433103: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Body], stats: [
		{ stat: Stat.Parry_Multiplier, value: 11 },
		{ stat: Stat.Dodge, value: 11 },
		{ stat: Stat.Defense, value: 3 } 
	] }},
	433104: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Body], stats: [
		{ stat: Stat.Parry_Multiplier, value: 8 },
		{ stat: Stat.Dodge, value: 8 },
		{ stat: Stat.Max_Hp, value: 4 } 
	] }},
	434101: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Body], stats: [
		{ stat: Stat.Parry_Multiplier, value: 12 },
		{ stat: Stat.Dodge, value: 12 }
	] }},
	434102: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Body], stats: [
		{ stat: Stat.Parry_Multiplier, value: 10 },
		{ stat: Stat.Dodge, value: 10 } ,
		{ stat: Stat.Toughness, value: 6 } 
	] }},
	434103: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Body], stats: [
		{ stat: Stat.Parry_Multiplier, value: 12 },
		{ stat: Stat.Dodge, value: 12 },
		{ stat: Stat.Defense, value: 4 } 
	] }},
	434104: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Body], stats: [
		{ stat: Stat.Parry_Multiplier, value: 9 },
		{ stat: Stat.Dodge, value: 9 },
		{ stat: Stat.Max_Hp, value: 5 } 
	] }},





	442101: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Belt, ItemType.Shoes], stats: [
		{ stat: Stat.Dodge, value: 16 },
	] }},
	442102: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Belt, ItemType.Shoes], stats: [
		{ stat: Stat.Dodge, value: 13 },
		{ stat: Stat.Parry_Multiplier, value: 6 }
	] }},
	442103: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Belt, ItemType.Shoes], stats: [
		{ stat: Stat.Dodge, value: 10 },
		{ stat: Stat.Toughness, value: 5 } 
	] }},
	442104: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Belt, ItemType.Shoes], stats: [
		{ stat: Stat.Dodge, value: 5 },
		{ stat: Stat.Defense, value: 9 } 
	] }},
	443101: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Belt, ItemType.Shoes], stats: [
		{ stat: Stat.Dodge, value: 17 },
	] }},
	443102: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Belt, ItemType.Shoes], stats: [
		{ stat: Stat.Dodge, value: 14 },
		{ stat: Stat.Parry_Multiplier, value: 7 }
	] }},
	443103: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Belt, ItemType.Shoes], stats: [
		{ stat: Stat.Dodge, value: 11 },
		{ stat: Stat.Toughness, value: 6 } 
	] }},
	443104: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Belt, ItemType.Shoes], stats: [
		{ stat: Stat.Dodge, value: 6 },
		{ stat: Stat.Defense, value: 10 } 
	] }},
	444101: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Belt, ItemType.Shoes], stats: [
		{ stat: Stat.Dodge, value: 18 },
	] }},
	444102: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Belt, ItemType.Shoes], stats: [
		{ stat: Stat.Dodge, value: 15 },
		{ stat: Stat.Parry_Multiplier, value: 8 }
	] }},
	444103: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Belt, ItemType.Shoes], stats: [
		{ stat: Stat.Dodge, value: 12 },
		{ stat: Stat.Toughness, value: 7 } 
	] }},
	444104: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Belt, ItemType.Shoes], stats: [
		{ stat: Stat.Dodge, value: 7 },
		{ stat: Stat.Defense, value: 11 } 
	] }},
}