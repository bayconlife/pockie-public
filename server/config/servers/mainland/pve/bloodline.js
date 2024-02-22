const Stat = require('../../../lines').Stat;

module.exports = {
	Config: {
		itemsPerDay: 10,
		itemsPerTurnIn: 4,
		amityGainedPerTurnIn: 30,
		soulLevelLimits: [25, 25, 25, 36, 36, 51, 71, 71]
	},
	Limits: {
		1: {
			level: 20,
			item: 148023,
			amity: 30,
			avatar: 16,
			stats: [23, 11, 23], // str, agi, sta
			bonus: [[Stat.SkillAdd5, 2], [Stat.Toughness, 43], [Stat.Strength, 30]]
		},
		2: {
			level: 20,
			item: 148023,
			amity: 30,
			avatar: 63,
			stats: [18, 13, 24], // str, agi, sta
			bonus: [[Stat.SkillAdd6, 2], [Stat.Defense, 53], [Stat.Defense_Break, 47]]
		},
		3: {
			level: 25, // kiba
			item: 148024,
			amity: 210,
			avatar: 17,
			stats: [18, 25, 12], // str, agi, sta
			bonus: [[Stat.SkillAdd5, 2], [Stat.Pierce, 47], [Stat.Dodge, 30]]
		},
		4: {
			level: 28, // shino
			item: 148024,
			amity: 210,
			avatar: 18,
			stats: [12, 23, 23], // str, agi, sta
			bonus: [[Stat.SkillAdd6, 2], [Stat.Defense, 53], [Stat.Speed_Multiplier, 37]]
		},
		5: {
			level: 26, // hinata
			item: 148025,
			amity: 210,
			avatar: 37,
			stats: [23, 20, 13], // str, agi, sta
			bonus: [[Stat.SkillAdd5, 2], [Stat.Agility, 30], [Stat.Critical_Multiplier, 30]]
		},
		6: {
			level: 31, // neji
			item: 148025,
			amity: 210,
			avatar: 22,
			stats: [20, 20, 20], // str, agi, sta
			bonus: [[Stat.SkillAdd5, 2], [Stat.Hit, 47], [Stat.Stamina, 30]]
		},
		7: {
			level: 26, // shizune
			item: 148026,
			amity: 210,
			avatar: 39,
			stats: [12, 14, 30], // str, agi, sta
			bonus: [[Stat.SkillAdd9, 2], [Stat.Stamina, 30], [Stat.Max_Hp_Multiplier, 37]]
		},
		8: {
			level: 31, // guren ??
			item: 148026,
			amity: 210,
			avatar: 97,
			stats: [13, 25, 22], // str, agi, sta
			bonus: [[Stat.SkillAdd7, 2], [Stat.Max_Hp_Multiplier, 47], [Stat.Hit, 47]]
		},
		9: {
			level: 36, // shikamaru
			item: 148027,
			amity: 720,
			avatar: 19,
			stats: [18, 24, 50], // str, agi, sta
			bonus: [[Stat.SkillAdd8, 3], [Stat.Parry_Multiplier, 44], [Stat.Defense, 77]]
		},
		11: {
			level: 39, // yamato
			item: 148027,
			amity: 720,
			avatar: 24,
			stats: [33, 29, 33], // str, agi, sta
			bonus: [[Stat.SkillAdd2, 3], [Stat.Hit, 69], [Stat.Dodge, 44]]
		},
		12: {
			level: 37, // ino
			item: 148028,
			amity: 720,
			avatar: 60,
			stats: [31, 24, 38], // str, agi, sta
			bonus: [[Stat.SkillAdd8, 3], [Stat.Stamina, 44], [Stat.Pierce, 69]]
		},
		16: {
			level: 38, // temari
			item: 148029,
			amity: 720,
			avatar: 62,
			stats: [32, 32, 30], // str, agi, sta
			bonus: [[Stat.SkillAdd4, 3], [Stat.Hit, 69], [Stat.Attack_Multiplier, 55]]
		},
		18: {
			level: 37, // haku
			item: 148030,
			amity: 720,
			avatar: 64,
			stats: [22, 38, 33], // str, agi, sta
			bonus: [[Stat.SkillAdd1, 3], [Stat.Hit, 69], [Stat.Agility, 44]]
		},
	},
	Souls: {
		1: {
			stat: Stat.Defense,
			levels: [12, 20, 34, 53, 77, 107, 142, 178]
		},
		2: {
			stat: Stat.Defense_Break,
			levels: [11, 18, 30, 47, 69, 96, 127, 159]
		},
		3: {
			stat: Stat.Dodge,
			levels: [7, 12, 19, 30, 44, 60, 80, 101]
		},
		4: {
			stat: Stat.Hit,
			levels: [11, 18, 30, 47, 69, 96, 127, 159]
		},
		5: {
			stat: Stat.Critical,
			levels: [7, 12, 19, 30, 44, 60, 80, 101]
		},
		6: {
			stat: Stat.Toughness,
			levels: [10, 17, 28, 43, 63, 87, 115, 144]
		},
		7: {
			stat: Stat.Max_Hp,
			levels: [12, 20, 34, 53, 77, 107, 142, 178]
		},
		8: {
			stat: Stat.Max_Mp,
			levels: [12, 20, 34, 53, 77, 107, 142, 178]
		},
		9: {
			stat: Stat.Pierce,
			levels: [11, 18, 30, 47, 69, 96, 127, 159]
		},
		10: {
			stat: Stat.Parry_Multiplier,
			levels: [7, 12, 19, 30, 44, 60, 80, 101]
		},
		11: {
			stat: Stat.Min_Attack,
			levels: [4, 6, 10, 16, 23, 32, 42, 53]
		},
		12: {
			stat: Stat.Max_Attack,
			levels: [4, 6, 10, 16, 23, 32, 42, 53]
		},
		13: {
			stat: Stat.Speed_Multiplier,
			levels: [9, 15, 24, 37, 55, 75, 100, 125]
		},
	}
}