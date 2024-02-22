const { createMonsterStats } = require("../../../monsters")

function generateMonster(avatar, level, exp, hp, chakra, min, max, spd, def, crit=0, hit=0, dodge=0, defenseBreak=0, parry=0, pierce=0, con=0, dropTable=0, stones=[0, 0], skills=[]) {
	return createMonsterStats(avatar, level, exp, hp, chakra, min, max, spd, def, crit, 230, hit, dodge, defenseBreak, parry, pierce, con, dropTable, stones, skills);
}

module.exports = {
	330171: generateMonster(10076, 2, 24, 30, 30, 19, 23, 996, 71, 0, 0, 0, 0, 0, 0, 0, 0, [121, 148]),
	330061: generateMonster(10065, 4, 42, 32, 32, 23, 28, 997, 95, 0, 0, 0, 0, 0, 0, 0, 0, [133, 162]),
	330261: generateMonster(10085, 6, 63, 59, 59, 27, 33, 998, 115, 0, 0, 0, 0, 0, 0, 0, 0, [142, 174]),
	320011: generateMonster(10001, 8, 87, 73, 73, 31, 38, 1000, 154, 0, 0, 0, 0, 0, 0, 0, 0, [151, 184]),
}