const { hasDailyLimit, isPetFood } = require('./util');

const ItemType = require('../../../items/types').Item;

function createBaseItem(imageId, value, price, base='etc') {
	return { type: ItemType.Task, size: 1, src: `${base}/${imageId}`, value, price };
}

module.exports = {
	141001: createBaseItem(82, 0, 0),
	141002: createBaseItem(87, 0, 0),
	141003: createBaseItem(87, 0, 0),
	141004: createBaseItem(87, 0, 0),
	141005: createBaseItem(87, 0, 0),
	141006: createBaseItem(87, 0, 0),
  141007: { type: ItemType.Task, src: 'tasks/4', size: 1, value: 0 },
  141008: { type: ItemType.Task, src: 'tasks/3', size: 1, value: 0 },
  141009: { type: ItemType.Task, src: 'etc/bombs/20', size: 1, value: 0 },
  141010: createBaseItem(109, 0, 0, 'gems'),
	141011: createBaseItem(36, 0, 0, 'tasks/master'),
  141012: createBaseItem(43, 0, 0, 'tasks/master'),
  141013: createBaseItem(42, 0, 0, 'tasks/master'),

	148023: createBaseItem(64, 0, 0, 'tasks'), // bbq chips
	148024: createBaseItem(65, 0, 0, 'tasks'), // anbu mask
	148025: createBaseItem(66, 0, 0, 'tasks'), // family badge
	148026: createBaseItem(67, 0, 0, 'tasks'), // secret letter
	148027: createBaseItem(68, 0, 0, 'tasks'), // shoji
	148028: createBaseItem(69, 0, 0, 'tasks'), // medic bag
	148029: createBaseItem(70, 0, 0, 'tasks'), // puppet item
	148030: createBaseItem(71, 0, 0, 'tasks'), // Kunai
}