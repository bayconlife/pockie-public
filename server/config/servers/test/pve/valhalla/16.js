const { createMonsterStats } = require("../../../../monsters");

function generateMonster(avatar, level, dropTable=0, stones=[0, 0], skills=[]) {
	const maxHp = Math.floor(Math.pow(level * 10, 1.2 + 0.05 * Math.floor(level/10)));
	const minAttack = Math.floor(25 + Math.pow(level * 4, 1.1));
	const maxAttack = Math.floor(minAttack * 1.25);
	const speed = Math.floor(1000 + level * 2);
	const defense = Math.floor(200 + Math.pow(level * 4, 1.15));
	const crit = 0;
	const hit = 0;
	const dodge = 0;
	const defenseBreak = 0;
	const parry = 0;
	const pierce = 0;
	const con = 0;
	
	return createMonsterStats(
		avatar, 
		level, 
		0, 
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
		stones, 
		skills, 
		true
	);
}


const Monsters = {
	301111: { ...generateMonster(10124, 16) }, // Normal 1-1
	301112: { ...generateMonster(10121, 16) },
	301113: { ...generateMonster(10119, 16) },

	301121: { ...generateMonster(10121, 17) },
	301122: { ...generateMonster(10124, 17) },
	301123: { ...generateMonster(10125, 17) },

	301131: { ...generateMonster(10119, 18) },
	301132: { ...generateMonster(10125, 18) },
	301133: { ...generateMonster(10126, 18) },

	301141: { ...generateMonster(10124, 19) },
	301142: { ...generateMonster(10121, 19) },
	301143: { ...generateMonster(10113, 19) },
	
	301151: { ...generateMonster(10125, 20) },
	301152: { ...generateMonster(10126, 20) },
	301153: { ...generateMonster(45, 20, 1160, [0, 0], [1810, 3805, 7777]) },
}

const Gates = {
	minLevel: 16,
	modes: {
		0: {
			partyLimit: 3,
			locations: [[
				[301111, 301112, 301113],
				[301121, 301122, 301123],
				[301131, 301132, 301133],
				[301141, 301142, 301143],
				[301151, 301152, 301153],
			]],
			sets: [
				{ id: 8160, items: [331601, 331602, 331603, 331604, 331605, 331606, 331607] },
				{ id: 8161, items: [331611, 331612, 331613, 331614, 331615, 331616, 331617] }
			],
			cards: 1016
		},
	},
}

module.exports = {
	Gates,
	Monsters
}