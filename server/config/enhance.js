const ItemType = require('./items/types').Item;

module.exports = {
	// failRate: [0, 33, 56, 70, 80, 87, 91, 94, 96, 97, 98, 99],
	failRate: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	weapons: 6,
	amounts: {
		[ItemType.Weapon]: {1: 6}, // This is to trigger checks but the above weapons is used for amounts
		[ItemType.Body]: {2: 2, 7: 3, 12: 4, 17: 5, 22: 6, 27: 7, 32: 8, 37: 9, 42: 10, 47: 11, 52: 12, 57: 13, 62: 14, 67: 15, 72: 16, 77: 17, 82: 18, 87: 19},
		[ItemType.Helm]: {3: 2, 13: 4, 23: 6, 33: 8, 43: 10, 53: 12, 63: 14, 73: 16, 83: 18},
		[ItemType.Shoes]: {5: 2, 15: 4, 25: 6, 35: 8, 45: 10, 55: 12, 65: 14, 75: 16, 85: 18},
		[ItemType.Gloves]: {8: 3, 18: 5, 28: 7, 38: 9, 48: 11, 58: 13, 68: 15, 78: 17, 88: 19},
		[ItemType.Belt]: {9: 3, 19: 5, 29: 7, 39: 9, 49: 11, 59: 13, 69: 15, 79: 17, 89: 19},
	},
	talismans: [161060]
}