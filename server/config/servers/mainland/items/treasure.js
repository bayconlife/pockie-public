const ItemType = require('../../../items/types').Item;
const BoxType = require('../../../items/types').BoxType;
const BagType = require('../../../items/types').BagType;

module.exports = {
	Items: { // 159XXX gives us 999 items to work with
		159000: { // S-Rank Secret Technqiue Scroll
			type: ItemType.Box, 
			src: 'tasks/master/38', 
			size: 1, 
			innate: {
				cost: { item: 100004, amount: 4 },
				boxType: BoxType.RandomItemWeighted,
				content: [
					[159008, 5, 0],
					[159009, 5, 0],
					[159010, 5, 0],
					[159011, 85, 0],
					[160110, 5, 1],
					[160105, 41, 1],
					[160107, 106, 1],
					[159004, 106, 1],
					[159015, 147, 1],
					[160111, 400, 1],
					[160104, 212, 1],
					[159005, 354, 1],
					[159006, 709, 1],
					[159014, 738, 1],
					[159013, 1108, 1],
					[150302, 2127, 1],
					[159000, 2607, 0],
					[152100, 2744, 1],
					[170127, 2897, 1],
					[159012, 3476, 1],
					[150117, 3476, 1], // Was 152046 which is a box with this item??? Why not just item
					[150406, 3724, 1],
				]
			}
		},
		
		159001: { // A-Rank Secret Technqiue Scroll
			type: ItemType.Box, 
			src: 'tasks/master/37', 
			size: 1, 
			innate: {
				cost: { item: 100004, amount: 3 },
				boxType: BoxType.RandomItemWeighted,
				content: [
					[160105, 18, 1],
					[160107, 41, 1],
					[159004, 41, 1],
					[159015, 57, 1],
					[160111, 150, 1],
					[290098, 83, 1],
					[160104, 111, 1],
					[159007, 166, 1],
					[159006, 222, 1],
					[159014, 231, 1],
					[160103, 277, 1],
					[159013, 347, 1],
					[150578, 416, 1],
					[160102, 555, 1],
					[159000, 833, 0],
					[170127, 925, 1],
					[160101, 1111, 1],
					[152046, 1111, 1],
					[150406, 1761, 1],
					[150302, 1973, 1],
					[159016, 2466, 1],
					[170112, 2740, 1],
					[150078, 3288, 1],
				]
			}
		},
		
		159002: { // B-Rank Secret Technqiue Scroll
			type: ItemType.Box, 
			src: 'tasks/master/36', 
			size: 1, 
			innate: {
				cost: { item: 100004, amount: 2 },
				boxType: BoxType.RandomItemWeighted,
				content: [
					[152044, 14, 1],
					[152045, 43, 1],
					[290098, 43, 1],
					[160111, 70, 1],
					[159005, 47, 1],
					[159007, 71, 1],
					[152025, 75, 1],
					[160103, 119, 1],
					[160102, 238, 1],
					[159017, 238, 1],
					[159000, 357, 0],
					[170127, 396, 1],
					[159001, 476, 0],
					[160101, 476, 1],
					[350008, 476, 1],
					[152046, 476, 1],
					[150406, 510, 1],
					[170110, 841, 1],
					[150177, 890, 1],
					[150112, 1376, 1],
					[100004, 1514, 1],
					[150121, 1892, 1],
				]
			}
		},
		159003: { // C-Rank Secret Technqiue Scroll
			type: ItemType.Box, 
			src: 'tasks/master/29', 
			size: 1, 
			innate: {
				cost: { item: 100004, amount: 1 },
				boxType: BoxType.RandomItemWeighted,
				content: [
					[290098, 23, 1],
					[160111, 30, 1],
					[159005, 25, 1],
					[159007, 37, 1],
					[120002, 100, 1],
					[150433, 125, 1],
					[159000, 125, 0],
					[150126, 156, 1],
					[150156, 156, 1],
					[152046, 166, 1],
					[350008, 166, 1],
					[350108, 166, 1],
					[159001, 166, 0],
					[150406, 178, 1],
					[150125, 227, 1],
					[159002, 250, 0],
					[170112, 277, 1],
					[150177, 294, 1],
					[150112, 454, 1],
					[100004, 500, 1],
					[150172, 1833, 1],
					[150110, 3666, 1],
				]
			}
		},
		
		159004: { type: ItemType.Box, src: 'etc/226', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.GiftCertificate, 1000] }},
		159005: { type: ItemType.Box, src: 'etc/226', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.GiftCertificate, 300] }},
		159006: { type: ItemType.Box, src: 'etc/226', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.Stone, 500000] }},
		159007: { type: ItemType.Box, src: 'etc/226', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.Exp, 100000] }},
		159008: { // Limited Blunt Box Lv. 76
			type: ItemType.Box, 
			src: 'etc/233', 
			size: 4, 
			innate: {
				boxType: BoxType.RandomItem,
				content: [286641]
			}
		},
		159009: { // Limited Blunt Box Lv. 76
			type: ItemType.Box, 
			src: 'etc/233', 
			size: 4, 
			innate: {
				boxType: BoxType.RandomItem,
				content: [286642]
			}
		},
		159010: { // Limited Blunt Box Lv. 76
			type: ItemType.Box, 
			src: 'etc/233', 
			size: 4, 
			innate: {
				boxType: BoxType.RandomItem,
				content: [286643]
			}
		},
		159011: { // Limited Edition Ring
			type: ItemType.Box, 
			src: 'etc/22', 
			size: 1, 
			innate: {
				boxType: BoxType.RandomItem,
				content: [286644]
			}
		},
		159012: { type: ItemType.Box, src: 'etc/treasure', size: 1, innate: { boxType: BoxType.FixedDrop, content: [[100004, 3, 1]] }},
		159013: { type: ItemType.Box, src: 'etc/impress/1', size: 1, innate: { boxType: BoxType.FixedDrop, content: [[350008, 2, 1]] }},
		159014: { type: ItemType.Box, src: 'etc/impress/rate', size: 1, innate: { boxType: BoxType.FixedDrop, content: [[350108, 3, 1]] }},
		159015: { type: ItemType.Box, src: 'crops/11', size: 1, innate: { boxType: BoxType.FixedDrop, content: [[170127, 20, 1]]}},
		159016: { type: ItemType.Box, src: 'etc/treasure', size: 1, innate: { boxType: BoxType.FixedDrop, content: [[100004, 2, 1]] }},
		159017: { type: ItemType.Box, src: 'etc/impress/rate', size: 1, innate: { boxType: BoxType.FixedDrop, content: [[350108, 2, 1]] }},

		159047: { type: ItemType.Box, src: 'etc/279', size: 4, innate: { boxType: BoxType.FixedDrop, content: [
			// [161003, 10, 1],
			// [161004, 10, 1],
			// [152098, 2, 1],
			// [161002, 2, 1],
			// [350008, 5, 1],
			// [152015, 50, 1],
			// [160103, 5, 1],
			// [161001, 10, 1],
			[100004, 10, 1],
			// [161009, 30, 1],
			// [161007, 30, 1],
		]}},
	},
	Config: {
		maxDiscards: 2,
		discardCost: [10, 20],
		talismanIID: 100004
	}
}