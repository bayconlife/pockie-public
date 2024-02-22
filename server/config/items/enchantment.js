const ItemType = require('./types').Item;
const Stat = require('../lines').Stat;

module.exports = {
	400100: { type: ItemType.Enchantment, src: 'gems/1', price: 1, value: 1, innate: { level: 1, types: [ItemType.Weapon], stats: [
		{ stat: Stat.Max_Attack, value: 1 }
	] }},
	402100: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Weapon], stats: [
		{ stat: Stat.Critical_Multiplier, value: 13 }
	] }},
	402101: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Weapon], stats: [
		{ stat: Stat.Critical_Multiplier, value: 10 },
		{ stat: Stat.Hit, value: 4 }
	] }},
	402102: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Weapon], stats: [
		{ stat: Stat.Critical_Multiplier, value: 10 },
		{ stat: Stat.Pierce, value: 4 }
	] }},
	402103: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Weapon], stats: [
		{ stat: Stat.Critical_Multiplier, value: 8 },
		{ stat: Stat.Defense_Break, value: 11 }
	] }},
	402104: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Weapon], stats: [
		{ stat: Stat.Critical_Multiplier, value: 4 },
		{ stat: Stat.Max_Attack, value: 1 }
	] }},
	402110: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Hat, ItemType.Gloves], stats: [
		{ stat: Stat.Parry_Multiplier, value: 16 },
	] }},
	402111: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Hat, ItemType.Gloves], stats: [
		{ stat: Stat.Parry_Multiplier, value: 13 },
		{ stat: Stat.Dodge, value: 6 } 
	] }},
	402112: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Hat, ItemType.Gloves], stats: [
		{ stat: Stat.Parry_Multiplier, value: 10 },
		{ stat: Stat.Toughness, value: 5 } 
	] }},
	402113: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Hat, ItemType.Gloves], stats: [
		{ stat: Stat.Parry_Multiplier, value: 5 },
		{ stat: Stat.Defense, value: 9 } 
	] }},
	402120: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Ring, ItemType.Amulet], stats: [
		{ stat: Stat.Critical_Multiplier, value: 13 }
	] }},
	402121: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Ring, ItemType.Amulet], stats: [
		{ stat: Stat.Critical_Multiplier, value: 10 },
		{ stat: Stat.Hit, value: 4 }
	] }},
	402122: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Ring, ItemType.Amulet], stats: [
		{ stat: Stat.Critical_Multiplier, value: 10 },
		{ stat: Stat.Pierce, value: 4 }
	] }},
	402123: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Ring, ItemType.Amulet], stats: [
		{ stat: Stat.Critical_Multiplier, value: 8 },
		{ stat: Stat.Defense_Break, value: 11 }
	] }},
	402130: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Body], stats: [
		{ stat: Stat.Parry_Multiplier, value: 10 },
		{ stat: Stat.Dodge, value: 10 }
	] }},
	402131: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Body], stats: [
		{ stat: Stat.Parry_Multiplier, value: 8 },
		{ stat: Stat.Dodge, value: 8 } ,
		{ stat: Stat.Toughness, value: 4 } 
	] }},
	402132: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Body], stats: [
		{ stat: Stat.Parry_Multiplier, value: 10 },
		{ stat: Stat.Dodge, value: 10 },
		{ stat: Stat.Defense, value: 2 } 
	] }},
	402133: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Body], stats: [
		{ stat: Stat.Parry_Multiplier, value: 7 },
		{ stat: Stat.Dodge, value: 7 },
		{ stat: Stat.Max_Hp, value: 3 } 
	] }},
	402140: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Belt, ItemType.Shoes], stats: [
		{ stat: Stat.Dodge, value: 16 },
	] }},
	402141: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Belt, ItemType.Shoes], stats: [
		{ stat: Stat.Dodge, value: 13 },
		{ stat: Stat.Parry_Multiplier, value: 6 }
	] }},
	402142: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Belt, ItemType.Shoes], stats: [
		{ stat: Stat.Dodge, value: 10 },
		{ stat: Stat.Toughness, value: 5 } 
	] }},
	402143: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 21, types: [ItemType.Belt, ItemType.Shoes], stats: [
		{ stat: Stat.Dodge, value: 5 },
		{ stat: Stat.Defense, value: 9 } 
	] }},
	403100: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Weapon], stats: [
		{ stat: Stat.Critical_Multiplier, value: 14 }
	] }},
	403101: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Weapon], stats: [
		{ stat: Stat.Critical_Multiplier, value: 11 },
		{ stat: Stat.Hit, value: 5 }
	] }},
	403102: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Weapon], stats: [
		{ stat: Stat.Critical_Multiplier, value: 11 },
		{ stat: Stat.Pierce, value: 5 }
	] }},
	403103: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Weapon], stats: [
		{ stat: Stat.Critical_Multiplier, value: 9 },
		{ stat: Stat.Defense_Break, value: 13 }
	] }},
	403104: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Weapon], stats: [
		{ stat: Stat.Critical_Multiplier, value: 5 },
		{ stat: Stat.Max_Attack, value: 2 }
	] }},
	403110: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Hat, ItemType.Gloves], stats: [
		{ stat: Stat.Parry_Multiplier, value: 17 },
	] }},
	403111: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Hat, ItemType.Gloves], stats: [
		{ stat: Stat.Parry_Multiplier, value: 14 },
		{ stat: Stat.Dodge, value: 7 } 
	] }},
	403112: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Hat, ItemType.Gloves], stats: [
		{ stat: Stat.Parry_Multiplier, value: 11 },
		{ stat: Stat.Toughness, value: 6 } 
	] }},
	403113: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Hat, ItemType.Gloves], stats: [
		{ stat: Stat.Parry_Multiplier, value: 6 },
		{ stat: Stat.Defense, value: 10 } 
	] }},
	403120: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Ring, ItemType.Amulet], stats: [
		{ stat: Stat.Critical_Multiplier, value: 14 }
	] }},
	403121: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Ring, ItemType.Amulet], stats: [
		{ stat: Stat.Critical_Multiplier, value: 11 },
		{ stat: Stat.Hit, value: 5 }
	] }},
	403122: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Ring, ItemType.Amulet], stats: [
		{ stat: Stat.Critical_Multiplier, value: 11 },
		{ stat: Stat.Pierce, value: 5 }
	] }},
	403123: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Ring, ItemType.Amulet], stats: [
		{ stat: Stat.Critical_Multiplier, value: 9 },
		{ stat: Stat.Defense_Break, value: 13 }
	] }},
	403130: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Body], stats: [
		{ stat: Stat.Parry_Multiplier, value: 11 },
		{ stat: Stat.Dodge, value: 11 }
	] }},
	403131: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Body], stats: [
		{ stat: Stat.Parry_Multiplier, value: 9 },
		{ stat: Stat.Dodge, value: 9 } ,
		{ stat: Stat.Toughness, value: 5 } 
	] }},
	403132: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Body], stats: [
		{ stat: Stat.Parry_Multiplier, value: 11 },
		{ stat: Stat.Dodge, value: 11 },
		{ stat: Stat.Defense, value: 3 } 
	] }},
	403133: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Body], stats: [
		{ stat: Stat.Parry_Multiplier, value: 8 },
		{ stat: Stat.Dodge, value: 8 },
		{ stat: Stat.Max_Hp, value: 4 } 
	] }},
	403140: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Belt, ItemType.Shoes], stats: [
		{ stat: Stat.Dodge, value: 17 },
	] }},
	403141: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Belt, ItemType.Shoes], stats: [
		{ stat: Stat.Dodge, value: 14 },
		{ stat: Stat.Parry_Multiplier, value: 7 }
	] }},
	403142: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Belt, ItemType.Shoes], stats: [
		{ stat: Stat.Dodge, value: 11 },
		{ stat: Stat.Toughness, value: 6 } 
	] }},
	403143: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 31, types: [ItemType.Belt, ItemType.Shoes], stats: [
		{ stat: Stat.Dodge, value: 6 },
		{ stat: Stat.Defense, value: 10 } 
	] }},
	404100: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Weapon], stats: [
		{ stat: Stat.Critical_Multiplier, value: 15 }
	] }},
	404101: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Weapon], stats: [
		{ stat: Stat.Critical_Multiplier, value: 12 },
		{ stat: Stat.Hit, value: 6 }
	] }},
	404102: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Weapon], stats: [
		{ stat: Stat.Critical_Multiplier, value: 12 },
		{ stat: Stat.Pierce, value: 6 }
	] }},
	404103: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Weapon], stats: [
		{ stat: Stat.Critical_Multiplier, value: 10 },
		{ stat: Stat.Defense_Break, value: 16 }
	] }},
	404104: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Weapon], stats: [
		{ stat: Stat.Critical_Multiplier, value: 6 },
		{ stat: Stat.Max_Attack, value: 3 }
	] }},
	404110: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Hat, ItemType.Gloves], stats: [
		{ stat: Stat.Parry_Multiplier, value: 18 },
	] }},
	404111: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Hat, ItemType.Gloves], stats: [
		{ stat: Stat.Parry_Multiplier, value: 15 },
		{ stat: Stat.Dodge, value: 8 } 
	] }},
	404112: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Hat, ItemType.Gloves], stats: [
		{ stat: Stat.Parry_Multiplier, value: 12 },
		{ stat: Stat.Toughness, value: 7 } 
	] }},
	404113: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Hat, ItemType.Gloves], stats: [
		{ stat: Stat.Parry_Multiplier, value: 7 },
		{ stat: Stat.Defense, value: 11 } 
	] }},
	404120: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Ring, ItemType.Amulet], stats: [
		{ stat: Stat.Critical_Multiplier, value: 15 }
	] }},
	404121: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Ring, ItemType.Amulet], stats: [
		{ stat: Stat.Critical_Multiplier, value: 12 },
		{ stat: Stat.Hit, value: 6 }
	] }},
	404122: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Ring, ItemType.Amulet], stats: [
		{ stat: Stat.Critical_Multiplier, value: 12 },
		{ stat: Stat.Pierce, value: 6 }
	] }},
	404123: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Ring, ItemType.Amulet], stats: [
		{ stat: Stat.Critical_Multiplier, value: 10 },
		{ stat: Stat.Defense_Break, value: 15 }
	] }},
	404130: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Body], stats: [
		{ stat: Stat.Parry_Multiplier, value: 12 },
		{ stat: Stat.Dodge, value: 12 }
	] }},
	404131: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Body], stats: [
		{ stat: Stat.Parry_Multiplier, value: 10 },
		{ stat: Stat.Dodge, value: 10 } ,
		{ stat: Stat.Toughness, value: 6 } 
	] }},
	404132: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Body], stats: [
		{ stat: Stat.Parry_Multiplier, value: 12 },
		{ stat: Stat.Dodge, value: 12 },
		{ stat: Stat.Defense, value: 4 } 
	] }},
	404133: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Body], stats: [
		{ stat: Stat.Parry_Multiplier, value: 9 },
		{ stat: Stat.Dodge, value: 9 },
		{ stat: Stat.Max_Hp, value: 5 } 
	] }},
	404140: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Belt, ItemType.Shoes], stats: [
		{ stat: Stat.Dodge, value: 18 },
	] }},
	404141: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Belt, ItemType.Shoes], stats: [
		{ stat: Stat.Dodge, value: 15 },
		{ stat: Stat.Parry_Multiplier, value: 8 }
	] }},
	404142: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Belt, ItemType.Shoes], stats: [
		{ stat: Stat.Dodge, value: 12 },
		{ stat: Stat.Toughness, value: 7 } 
	] }},
	404143: { type: ItemType.Enchantment, src: 'gems/1', price: 50, value: 32, innate: { level: 41, types: [ItemType.Belt, ItemType.Shoes], stats: [
		{ stat: Stat.Dodge, value: 7 },
		{ stat: Stat.Defense, value: 11 } 
	] }},
}