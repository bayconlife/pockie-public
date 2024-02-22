
function hasDailyLimit(limit, item) {
	item.innate.dailyLimit = limit;

	return item;
}

function isPetFood(type, hunger, item) {
	item.innate.petFood = { type, hunger };

	return item;
}

module.exports = {
	hasDailyLimit,
	isPetFood,
	getGrayOutfits: () => [
		290003, 290009, 290012, 290014, 290016, 290017, 290018, 290019, 290020, 290026, 290032, 290033, 290034, 290036, 290039, 290061, 290063, 290065
	],
	getBlueOutfits: () => [
		290006, 290007, 290010, 290011, 290013, 290015, 290021, 290022, 290023, 290052, 290054, 290076, 290028, 290060, 290062, 290064, 290066, 290069
	],
	getOrangeOufits: () => [
		290001, 290004, 290005, 290008, 290027, 290029, 290037, 290035, 290045, 290046, 290047, 290048, 290049, 290051, 290055, 290056, 290057, 290058, 
		290072, 290074 ,290084, 290085, 290090
	],
}