const ItemType = require('./items/types').Item;
module.exports = {
    cost: 10000,
    types: [
        ItemType.Weapon,
		ItemType.Body,
		ItemType.Helm,
		ItemType.Shoes,
		ItemType.Gloves,
		ItemType.Belt,
        ItemType.Amulet,
        ItemType.Ring
    ]
}