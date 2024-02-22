const ItemType = require('../../../items/types').Item;

function createBaseItem(imageId, level, scene, base='etc') {
	return { type: ItemType.Task, src: `${base}/${imageId}`, size: 1, value: 30, innate: { level, scene } };
}

module.exports = {
	150046: createBaseItem(46, 1, 2101),
}