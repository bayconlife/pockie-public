const ItemType = require('../../../items/types').Item;
const BoxType = require('../../../items/types').BoxType;

// Selection
// content - list of tabs that contains a list of[outfit, level]

function createGrayOutfits(level) {
	return [
		[[290003, level], [290009, level], [290012, level], [290014, level], [290016, level], [290017, level], [290018, level], [290019, level], [290020, level]],
		[[290026, level], [290032, level], [290033, level], [290034, level], [290036, level], [290039, level], [290061, level], [290063, level], [290065, level]]
	]
}

function createBlueOutfits(level) {
	return [[
		[290006, level], [290007, level], [290010, level], [290011, level], [290013, level], [290015, level], [290021, level], [290022, level], [290023, level], [290052, level], 
		[290054, level], [290076, level]
	],[
		[290028, level], [290060, level], [290062, level], [290064, level], [290066, level], [290069, level]
	]]
}

function createOrangeOutfits(level) {
	return [[
		[290001, level], [290004, level], [290005, level], [290008, level], [290045, level], [290046, level], [290047, level], [290048, level], [290049, level], [290051, level], 
		[290055, level], [290056, level], [290084, level], [290057, level],
	],[
		[290058, level], [290029, level], [290027, level], [290037, level], [290035, level], [290072, level], [290074, level], [290085, level], [290090, level],
	]]
}

function createRedOutfits(level) {
	return [[
		[2940060, level], [2940090, level], [2940110, level], [290053, level],
	],[
		[2940080, level], [290030, level], [290044, level]
	]]
}

function createOutfitArray(outfits, level) {
	return outfits.map(group => group.map(iid => [iid, level]));
}

function createShippudenOutfits(level) {
	return createOutfitArray([
		[2940030, 2940040, 2940050, 2940070, 2940130],
		[2940140, 290067, 290031]
	], level);
}

function createAllOutfits(level) {
	return [[
			[290003, level], [290009, level], [290012, level], [290014, level], [290016, level], [290017, level], [290018, level], [290032, level], [290033, level], [290034, level], [290026, level], [290036, level], [290039, level], [290061, level], [290063, level],
		],[
			[290008, level], [290010, level], [290011, level], [290013, level], [290015, level], [290019, level], [290020, level], [290022, level], [290021, level], [290028, level], [290037, level], [290052, level], [290060, level], [290062, level], [290064, level], [290065, level], [290069, level], [290076, level],
		],[
			[290001, level], [290007, level], [290035, level], [290045, level], [290048, level], [290049, level], [290054, level], [290055, level], [290057, level], [290058, level], [290029, level], [290067, level], [290066, level], [290072, level], [290074, level], [290084, level], [290085, level], [290090, level],
		],[
			[290004, level], [290005, level], [290006, level], [290024, level], [290027, level], [290030, level], [290031, level], [290047, level], [290051, level], [290056, level], [290070, level], [290098, level], [290023, level], [2940030, level], [2940040, level], [2940050, level], [2940060, level], [2940070, level], [2940080, level], [2940130, level], [2940140, level],
		],[
			[290044, level], [290046, level], [290050, level], [290053, level], [2940090, level], [2940110, level]
		],[
			[290087, level], [290086, level], [290088, level], [290089, level]
		],[
			[290075, level], [290095, level], [290170, level], [290178, level]
		]]
}

function createPets(level) {
	return [[
		[320002, level], [320003, level], [320006, level], [320008, level], [320015, level], [320016, level], [320017, level], [320018, level],  [320019, level], 
		[320025, level], [320026, level], [320027, level], [320028, level], [320029, level], [320030, level], [320031, level],
	]]
}

module.exports = {
	

  159100: { type: ItemType.Box, src: 'etc/267', size: 1, value: 0, innate: { boxType: BoxType.SelectOutfit, content: createAllOutfits(14) }},
  159101: { type: ItemType.Box, src: 'etc/267', size: 1, value: 0, innate: { boxType: BoxType.SelectOutfit, content: createGrayOutfits(0) }},
  159102: { type: ItemType.Box, src: 'etc/268', size: 1, value: 0, innate: { boxType: BoxType.SelectOutfit, content: createBlueOutfits(0) }},
  159103: { type: ItemType.Box, src: 'etc/269', size: 1, value: 0, innate: { boxType: BoxType.SelectOutfit, content: createOrangeOutfits(0) }},

  160101: { type: ItemType.Box, src: 'etc/267', size: 1, value: 0, innate: { boxType: BoxType.SelectOutfit, content: createGrayOutfits(0) }},
  160102: { type: ItemType.Box, src: 'etc/268', size: 1, value: 0, innate: { boxType: BoxType.SelectOutfit, content: createBlueOutfits(0) }},
  160103: { type: ItemType.Box, src: 'etc/269', size: 1, value: 0, innate: { boxType: BoxType.SelectOutfit, content: createOrangeOutfits(0) }},
	160104: { type: ItemType.Box, src: 'etc/269', size: 1, value: 0, innate: { boxType: BoxType.SelectOutfit, content: [[
		[290087, 0], [290088, 0]
	],[
		[290086, 0], [290089, 0]
	]]}},
	160105: { type: ItemType.Box, src: 'etc/305', size: 1, value: 0, innate: { boxType: BoxType.SelectOutfit, content: createOrangeOutfits(27) }},

	160107: { type: ItemType.Box, src: 'etc/307', size: 1, value: 0, innate: { boxType: BoxType.SelectOutfit, content: createPets(21) }},
	
	160110: { type: ItemType.Box, src: 'etc/305', size: 1, value: 0, innate: { boxType: BoxType.SelectOutfit, content: createShippudenOutfits(27) }},
	160111: { type: ItemType.Box, src: 'etc/269', size: 1, value: 0, innate: { boxType: BoxType.SelectOutfit, content: createRedOutfits(0) }},
	
	160113: { type: ItemType.Box, src: 'etc/269', size: 1, value: 0, innate: { boxType: BoxType.SelectOutfit, content: createShippudenOutfits(0) }},
	160114: { type: ItemType.Box, src: 'etc/269', size: 1, value: 0, innate: { boxType: BoxType.SelectOutfit, content: createRedOutfits(0) }},
}