module.exports = {
	Achievements: require('./achievements'),
	Skills: require('./skills/index'),
	SkillConfig: {
		...require('./skills/config'),
	},
	Lines: require('./lines'),
	Items: require('./items'),
	...require('./dropTable'),
	...require('./monsters'),
	...require('./npcs'),
	Scenes: require('./scenes/index'),
	...require('./quests'),
	...require('./shops'),
	Arena: {
		...require('./arena'),
		Ranks: require('./honorExp.json'),
	},
	LasNoches: {
		...require('./lasNoches')
	},
	Valhalla: {
		...require('./dungeons/valhalla')
	},
	Synthesis: {
		...require('./synthesis')
	},
	...require('./inscribe'),
	SlotFight: {
		...require('./slotFight')
	},
	Enhance: require('./enhance'),
	Enchant: require('./enchant'),
	Pet: require('./pet'),
	Cards: { ...require('./cards/index') },
	Gems: require('./gems'),
	Refine: require('./refine'),
	Titles: require('./titles'),
	Modules: ['Pets'],
	servers: {
		1: {
			config: require('./servers/mainland'),
			check: require('./servers/mainland/check'),
			newCharacter: false,
		},
		2: {
			config: require('./servers/expedition'),
			check: require('./servers/expedition/check'),
			newCharacter: false,
		},
		99: {
			config: require('./servers/test'),
			check: require('./servers/test/check'),
			newCharacter: true,
		},
	},
	socket: {
		path: ''
	},
}