const ItemType = require('./items/types').Item;

module.exports = {
	cost: 10,
	talismans: [161004],
	maxHoles: {
		[ItemType.Weapon]: 3,
		[ItemType.Body]: 2,
		[ItemType.Helm]: 2,
		[ItemType.Shoes]: 2,
		[ItemType.Gloves]: 2,
		[ItemType.Belt]: 2,
		[ItemType.Ring]: 1,
		[ItemType.Amulet]: 1,
	}
}