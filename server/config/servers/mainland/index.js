const config = {
	Achievements: require('../../achievements'),
	Arena: {
		...require('../../arena'),
		Ranks: require('../../honorExp.json'),
	},
	Bloodline: require('./pve/bloodline'),
	Cards: { ...require('../../cards/index') },
	Codex: require('./codex'),
	Collection: require('./scenes/collection'),
	...require('../../dropTable'),
	Energy: require('./pve/energy'),
	Enhance: require('../../enhance'),
	Gems: require('../../gems'),
	Home: require('./scenes/home'),
	Impress: require('./crafting/impress'),
	...require('../../inscribe'),
	Items: require('../../items'),
	LasNoches: {
		...require('../../lasNoches')
	},
	Leveling: {
		exp: require('../../exp.json'),
		config: {
			maxLevel: 40,
		}
	},
	Lines: require('../../lines'),
	...require('../../monsters'),
	...require('../../npcs'),
	Pet: require('../../pet'),
	PetTracing: require('./scenes/petTracing'),
	Refine: require('../../refine'),
	Reroll: require('./scenes/reroll'),
	Scenes: {
		...require('../../scenes/index'),
		ExplorationV2: require('./pve/exploration')
	},
	...require('../../quests'),
	...require('../../shops'),
	Skills: require('../../skills/index'),
	SkillConfig: {
		...require('../../skills/config'),
	},
	SlotFight: {
		...require('../../slotFight')
	},
	Synthesis: {
		...require('../../synthesis')
	},
	Tasks: require('./pve/tasks/daily'),
	Titles: { ...require('../../titles') },
	Valhalla: {
		...require('../../dungeons/valhalla')
	},
	Modules: [
		'Achievements',
		'Arena', 
		'Bloodline',
		'Cards', 
		'Character',
		'Collection',
		'Currency',
		'Dungeons',
		'Enchant',
		'Energy',
		'Enhance',
		'Equip',
		'ExplorationV2',
		'FieldBosses',
		'Fields', 
		'Gems',
		'Home',
		'Impress',
		'Inscribe',
		'Inventory',
		'Items',
		'LasNoches',
		'Market',
		'NewPlayer', 
		'Party', 
		'Pets', 
		'PetTracing',
		'Quests',
		'Refine',
		'Reroll',
		'Scenes', 
		'Shops', 
		'SlotFights',
		'Skills',
		'Social',
		'Synthesis',
		'Tasks',
		'Titles',
		'UseItem',
		'Villages',
	],
	version: '0.11.67',
}

config.Items.Avatars = require('./items/avatar');
config.Items.Items = {
	...config.Items.Items,
	...require('./items/enchantment'),
	...require('./items/gems'),
	...require('./items/giftBag'),
	...require('./items/restore'),
	...require('./items/skillBook'),
	...require('./items/task'),
	...require('./items/wishingPot'),
	...require('./items/boxes'),
}

config.Monsters = {
	...config.Monsters,
	...require('./npc/exploration'),
	...require('./npc/ticketBoss'),
}

config.DropTables = {
	...config.DropTables,
	...require('./dropTables/petTracing'),
	...require('./dropTables/dailyTasks'),
	...require('./dropTables/ticketBoss'),
}

config.Shops = {
	...config.Shops, 
	...require('./shops/blackMarket')
}

module.exports = config;