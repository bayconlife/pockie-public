const expeditionConfig = {
	...JSON.parse(JSON.stringify(require('../mainland'))),
	Modules: [
		'ExpeditionArena',
		'Hunt',
		'Pets', 
		'Scenes'
	],
	version: '1.0.4-expedition'
}

expeditionConfig.Leveling.config.maxLevel = 52;

module.exports = expeditionConfig;