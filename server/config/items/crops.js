const ItemType = require('./types').Item;

module.exports = {
	170001: { type: ItemType.Crop, src: 'crops/1', innate: { hunger: 5, type: 7 }, value: 8 },
	170002: { type: ItemType.Crop, src: 'crops/2', innate: { hunger: 80, type: 4 }, value: 8 },
	170003: { type: ItemType.Crop, src: 'crops/3', innate: { hunger: 80, type: 4 }, value: 8 },
	170004: { type: ItemType.Crop, src: 'crops/4', innate: { hunger: 180, type: 4 }, value: 23 },
	170006: { type: ItemType.Crop, src: 'crops/6', innate: { hunger: 180, type: 4 }, value: 23 },
	170007: { type: ItemType.Crop, src: 'crops/7', innate: { hunger: 180, type: 4 }, value: 23 },
	170008: { type: ItemType.Crop, src: 'crops/8', innate: { hunger: 10, type: 4 }, value: 23 },
	170009: { type: ItemType.Crop, src: 'crops/9', innate: { hunger: 5, type: 4 }, value: 8 },
	170010: { type: ItemType.Crop, src: 'crops/10', innate: { hunger: 10, type: 7 }, value: 23 },
	
	170110: { type: ItemType.Crop, src: 'crops/5', innate: { hunger: 330, type: 4 }, value: 32 },
	170112: { type: ItemType.Crop, src: 'crops/11', innate: { hunger: 150, type: 1 }, value: 32 },
	170113: { type: ItemType.Crop, src: 'foods/13', innate: { hunger: 5, type: 2 }, value: 8 },
	170114: { type: ItemType.Crop, src: 'foods/55', innate: { hunger: 5, type: 3 }, value: 8 },
	170115: { type: ItemType.Crop, src: 'foods/42', innate: { hunger: 5, type: 5 }, value: 8 },
	170116: { type: ItemType.Crop, src: 'foods/61', innate: { hunger: 80, type: 7 }, value: 8 },
	170117: { type: ItemType.Crop, src: 'foods/89', innate: { hunger: 80, type: 3 }, value: 8 },
	170118: { type: ItemType.Crop, src: 'foods/16', innate: { hunger: 80, type: 2 }, value: 8 },
	170119: { type: ItemType.Crop, src: 'foods/88', innate: { hunger: 80, type: 5 }, value: 8 },
	170120: { type: ItemType.Crop, src: 'tasks/2', innate: { hunger: 10, type: 3 }, value: 23 },
	170121: { type: ItemType.Crop, src: 'foods/8', innate: { hunger: 10, type: 2 }, value: 23 },
	170122: { type: ItemType.Crop, src: 'foods/39', innate: { hunger: 10, type: 5 }, value: 23 },
	170123: { type: ItemType.Crop, src: 'foods/68', innate: { hunger: 180, type: 7 }, value: 23 },
	170124: { type: ItemType.Crop, src: 'foods/30', innate: { hunger: 180, type: 3 }, value: 23 },
	170125: { type: ItemType.Crop, src: 'foods/26', innate: { hunger: 180, type: 2 }, value: 23 },
	170126: { type: ItemType.Crop, src: 'foods/41', innate: { hunger: 180, type: 5 }, value: 23 },
	170127: { type: ItemType.Crop, src: 'crops/14', innate: { hunger: 330, type: 1 }, value: 32 },
}

// const CropItems = {
//   170001: { type: ItemType.Crop, innate: { hunger: 8, type: 5 }, value: 7 }, // Weeds
//   170002: { type: ItemType.Crop, innate: { hunger: 8, type: 80 }, value: 4 }, // Eggplant
//   170003: { type: ItemType.Crop, innate: { hunger: 8, type: 80 }, value: 4 }, // Corn
//   170004: { type: ItemType.Crop, innate: { hunger: 23, type: 180 }, value: 4 }, // Chili
//   170006: { type: ItemType.Crop, innate: { hunger: 23, type: 180 }, value: 4 }, // Pineapple
//   170007: { type: ItemType.Crop, innate: { hunger: 23, type: 180 }, value: 4 }, // Nut
//   170008: { type: ItemType.Crop, innate: { hunger: 23, type: 10 }, value: 4 }, // Pumpkin
//   170009: { type: ItemType.Crop, innate: { hunger: 8, type: 5 }, value: 4 }, // Mushroom
//   170010: { type: ItemType.Crop, innate: { hunger: 23, type: 10 }, value: 7 }, // Sunflower
//   170110: { type: ItemType.Crop, innate: { hunger: 32, type: 330 }, value: 4 }, // Watermelon
//   170112: { type: ItemType.Crop, innate: { hunger: 32, type: 150 }, value: 1 }, // Small Beans
//   170113: { type: ItemType.Crop, innate: { hunger: 8, type: 5 }, value: 2 }, // Bread
//   170114: { type: ItemType.Crop, innate: { hunger: 8, type: 5 }, value: 3 }, // Meatball
//   170115: { type: ItemType.Crop, innate: { hunger: 8, type: 5 }, value: 5 }, // Lollipop
//   170116: { type: ItemType.Crop, innate: { hunger: 8, type: 80 }, value: 7 }, // Miso Soup
//   170117: { type: ItemType.Crop, innate: { hunger: 8, type: 80 }, value: 3 }, // Roast Chicken
//   170118: { type: ItemType.Crop, innate: { hunger: 8, type: 80 }, value: 2 }, // Sandwich
//   170119: { type: ItemType.Crop, innate: { hunger: 8, type: 80 }, value: 5 }, // Cola
//   170120: { type: ItemType.Crop, innate: { hunger: 23, type: 10 }, value: 3 }, // Meaty Bones
//   170121: { type: ItemType.Crop, innate: { hunger: 23, type: 10 }, value: 2 }, // Yangchun Noodles
//   170122: { type: ItemType.Crop, innate: { hunger: 23, type: 10 }, value: 5 }, // Marshmallow
//   170123: { type: ItemType.Crop, innate: { hunger: 23, type: 180 }, value: 7 }, // Milk
//   170124: { type: ItemType.Crop, innate: { hunger: 23, type: 180 }, value: 3 }, // Lobster
//   170125: { type: ItemType.Crop, innate: { hunger: 23, type: 180 }, value: 2 }, // Pizza
//   170126: { type: ItemType.Crop, innate: { hunger: 23, type: 180 }, value: 5 }, // Chocolate
//   170127: { type: ItemType.Crop, innate: { hunger: 32, type: 330 }, value: 1 }, // Medium Beans
// }