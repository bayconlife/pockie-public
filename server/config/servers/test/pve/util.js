const { createMonsterStats } = require("../../../monsters");

function generateFieldMonster({avatar, level, skills=[], canKickBombs = false, override = {}}) {
	const maxHp = Math.floor(Math.pow(level * 10 + 7, 1.18 + 0.05 * Math.floor(level/10)));
	const minAttack = Math.floor(25 + Math.pow(level * 4, 1.04));
	const maxAttack = Math.floor(minAttack * 1.18);
	const speed = Math.floor(1000 + level * 15);
	const defense = Math.floor(200 + Math.pow(level * 4, 1.15));
	const crit = 0;
	const hit = 0;
	const dodge = 0;
	const defenseBreak = 0;
	const parry = 0;
	const pierce = 0;
	const con = 0;
	const stoneMin = Math.floor(8 * (1 + level / 30));
	const stoneMax = Math.ceil(stoneMin * 1.1);
	const dropTable = 3000000 +  Math.floor((level - 1) / 5) *  5 + 1
	
	return {
		...createMonsterStats(
			avatar, 
			level, 
			Math.floor(Math.pow(level * 5, 1.2)), 
			maxHp, // hp
			maxHp, // chakra
			minAttack, 
			maxAttack, 
			speed, 
			defense, 
			crit, 
			230, 
			hit, 
			dodge, 
			defenseBreak, 
			parry, 
			pierce, 
			con, 
			dropTable, 
			[stoneMin, stoneMax], 
			skills, 
			canKickBombs
		),	
		...override
	}
}

module.exports = {
	generateFieldMonster
}