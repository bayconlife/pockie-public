const ItemType = require('./types').Item;
const Lines = require('../lines').Lines;

function addLine(id) {
	const line = Lines[id];

	const randomInt = (lower, upper) => {
		if (upper < lower) {
			return upper;
		}
	
		return Math.floor(Math.random() * (upper - lower + 1)) + lower;
	};

	return {...line, roll: randomInt(line.min, line.max)}
}

module.exports = {
	210101: { type: ItemType.Amulet, src: 'amulets/21', size: 1, value: 1, price: 63, innate: { level: 4 }},
	210102: { type: ItemType.Amulet, src: 'amulets/1', size: 1, value: 11, price: 81, innate: { level: 14 }},
	210103: { type: ItemType.Amulet, src: 'amulets/12', size: 1, value: 21, price: 95, innate: { level: 24 }},
	210104: { type: ItemType.Amulet, src: 'amulets/23', size: 1, value: 31, price: 106, innate: { level: 34 }},
	210105: { type: ItemType.Amulet, src: 'amulets/3', size: 1, value: 41, price: 116, innate: { level: 44 }},
	210106: { type: ItemType.Amulet, src: 'amulets/14', size: 1, value: 51, price: 125, innate: { level: 54 }},
	210107: { type: ItemType.Amulet, src: 'amulets/45', size: 1, value: 61, price: 134, innate: { level: 64 }},
	210108: { type: ItemType.Amulet, src: 'amulets/41', size: 1, value: 71, price: 142, innate: { level: 74 }},
	210109: { type: ItemType.Amulet, src: 'amulets/47', size: 1, value: 81, price: 150, innate: { level: 84 }},
	210110: { type: ItemType.Amulet, src: 'amulets/23', size: 1, value: 91, price: 0, innate: { level: 94 }},
	210113: { type: ItemType.Amulet, src: 'amulets/50', size: 1, value: 0, price: 0, innate: { level: 61 }},
	210114: { type: ItemType.Amulet, src: 'amulets/51', size: 1, value: 0, price: 0, innate: { level: 61 }},
	210115: { type: ItemType.Amulet, src: 'amulets/52', size: 1, value: 0, price: 0, innate: { level: 61 }},
	210116: { type: ItemType.Amulet, src: 'amulets/53', size: 1, value: 0, price: 0, innate: { level: 61 }},
	210117: { type: ItemType.Amulet, src: 'amulets/54', size: 1, value: 0, price: 0, innate: { level: 61 }},
	210118: { type: ItemType.Amulet, src: 'amulets/61', size: 1, value: 71, price: 142, innate: { level: 71 }},
	210119: { type: ItemType.Amulet, src: 'amulets/62', size: 1, value: 71, price: 142, innate: { level: 71 }},
	210120: { type: ItemType.Amulet, src: 'amulets/63', size: 1, value: 71, price: 142, innate: { level: 71 }},
	210121: { type: ItemType.Amulet, src: 'amulets/50', size: 1, value: 0, price: 0, innate: { level: 81 }},
	210122: { type: ItemType.Amulet, src: 'amulets/51', size: 1, value: 0, price: 0, innate: { level: 81 }},
	210123: { type: ItemType.Amulet, src: 'amulets/52', size: 1, value: 0, price: 0, innate: { level: 81 }},
	210124: { type: ItemType.Amulet, src: 'amulets/53', size: 1, value: 0, price: 0, innate: { level: 81 }},
	210125: { type: ItemType.Amulet, src: 'amulets/54', size: 1, value: 0, price: 0, innate: { level: 81 }},
	210126: { type: ItemType.Amulet, src: 'amulets/61', size: 1, value: 81, price: 142, innate: { level: 81 }},
	210127: { type: ItemType.Amulet, src: 'amulets/62', size: 1, value: 81, price: 142, innate: { level: 81 }},
	210128: { type: ItemType.Amulet, src: 'amulets/63', size: 1, value: 81, price: 142, innate: { level: 81 }},

	// 210150: { type: ItemType.Amulet, src: 'amulets/42', size: 1, value: 11, price: 81, innate: { level: 14, lines: [addLine(2000)]}}
}