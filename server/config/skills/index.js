require('./util');

module.exports = {
	...require('./core/index'),
	...require('./pet/index'),
	...require('./monster/index'),
	...require('./items')
}