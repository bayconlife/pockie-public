const { BoxType, Item: ItemType } = require('../../../items/types');

module.exports = {
	160000: { type: ItemType.Box, src: 'etc/15', size: 1, innate: { boxType: BoxType.RandomSoul, content: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], level: 1 }},
}