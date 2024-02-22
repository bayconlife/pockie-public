const ItemType = require('../../../items/types').Item;

function createBaseItem(petSkill, type) {
	return { type: ItemType.PetSkillBook, size: 1, src: `tasks/master/32`, value: 0, price: 0, innate: { petSkill, type } };
}

module.exports = {
	180035: {...createBaseItem(50020, 2), },
	180036: {...createBaseItem(50021, 2), },
	180037: {...createBaseItem(50022, 2), },
	180038: {...createBaseItem(50023, 2), },
	180039: {...createBaseItem(50024, 2), },
	180040: {...createBaseItem(50025, 2), },
	180041: {...createBaseItem(50026, 2), },
	180042: {...createBaseItem(50027, 2), },
	180043: {...createBaseItem(50028, 2), },
	180044: {...createBaseItem(50029, 2), },
	180045: {...createBaseItem(50030, 2), },
	180046: {...createBaseItem(50031, 2), },
	180047: {...createBaseItem(50034, 2), },
	180048: {...createBaseItem(50035, 2), },
}