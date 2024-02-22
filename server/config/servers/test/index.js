const lodash = require('lodash');
const mainlandConfig = require('../mainland');
const config = lodash.cloneDeep(mainlandConfig);
	
config.version = '1.0.0-test'
config.Modules.push(
	'TestDrops',
);

config.TestDrops = require('./systems/genericLines');

config.Items.Items = {
	...config.Items.Items,
	...require('./items/avatars'),
}

config.Monsters = {
	...config.Monsters,
	...require('./pve/field'),
}

config.Skills = {
	...config.Skills,
	...require('./skills'),
}

config.Valhalla.Monsters = {
	...config.Valhalla.Monsters,
	...require('./pve/valhalla').Monsters,
}

config.Valhalla.Gates = {
	...config.Valhalla.Gates,
	...require('./pve/valhalla').Gates,
}

module.exports = config;