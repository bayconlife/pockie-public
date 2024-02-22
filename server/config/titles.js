const Stat = require('./lines').Stat;

module.exports = {
	Titles: {
		0: [],
		1: [[Stat.Strength, 13], [Stat.Agility, 13], [Stat.Stamina, 13]], // Level 20
		2: [[Stat.Strength, 15], [Stat.Agility, 15], [Stat.Stamina, 15]], // Level 30
		3: [[Stat.Strength, 17], [Stat.Agility, 17], [Stat.Stamina, 17]], // Level 40
		4: [[Stat.Strength, 19], [Stat.Agility, 19], [Stat.Stamina, 19]], // Level 50

		// Collection Titles - Don't give any stats
		13: [],
		14: [],
		15: [],
		16: [],
		17: [],
		18: [],
		19: [],
		20: [],
		21: [],
		22: [],
		23: [],
		24: [],
		25: [],
		26: [],
		27: [],
		75: [],
		76: [],
	}
}