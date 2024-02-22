const ItemType = require('./types').Item;
const BoxType = require('./types').BoxType;
const BagType = require('./types').BagType;

module.exports = {
  150078: { type: ItemType.Etc, src: 'etc/78', size: 1, value: 34,}, // Old demon proof item?
  // ...require('./etc/trophies'),
  150108: { type: ItemType.Box, src: 'etc/88', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.Stone, 3000] }},
  150109: { type: ItemType.Box, src: 'etc/88', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.Stone, 6000] }},
  150110: { type: ItemType.Box, src: 'etc/88', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.Stone, 15000] }},
  150111: { type: ItemType.Box, src: 'etc/88', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.Stone, 24000] }},
  150112: { type: ItemType.Box, src: 'etc/88', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.Stone, 36000] }},
  150113: { type: ItemType.Box, src: 'etc/88', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.Stone, 45000] }},
  150114: { type: ItemType.Box, src: 'etc/88', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.Stone, 60000] }},
  150115: { type: ItemType.Box, src: 'etc/88', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.Stone, 75000] }},
  150116: { type: ItemType.Box, src: 'etc/88', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.Stone, 90000] }},
  150117: { type: ItemType.Box, src: 'etc/88', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.Stone, 100000] }},

  150118: { type: ItemType.Box, src: 'etc/89', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.GiftCertificate, 1] }},
  150119: { type: ItemType.Box, src: 'etc/89', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.GiftCertificate, 2] }},
  150120: { type: ItemType.Box, src: 'etc/89', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.GiftCertificate, 4] }},
  150121: { type: ItemType.Box, src: 'etc/89', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.GiftCertificate, 8] }},
  150122: { type: ItemType.Box, src: 'etc/89', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.GiftCertificate, 16] }},
  150123: { type: ItemType.Box, src: 'etc/89', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.GiftCertificate, 18] }},
  150124: { type: ItemType.Box, src: 'etc/89', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.GiftCertificate, 20] }},
  150125: { type: ItemType.Box, src: 'etc/89', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.GiftCertificate, 22] }},
  150126: { type: ItemType.Box, src: 'etc/89', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.GiftCertificate, 32] }},
  150127: { type: ItemType.Box, src: 'etc/89', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.GiftCertificate, 40] }},
  // 128...147 voided in sheet
  150148: { type: ItemType.Box, src: 'etc/90', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.ArenaMedal, 10] }},
  150149: { type: ItemType.Box, src: 'etc/90', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.ArenaMedal, 210] }},
  150150: { type: ItemType.Box, src: 'etc/90', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.ArenaMedal, 220] }},
  150151: { type: ItemType.Box, src: 'etc/90', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.ArenaMedal, 230] }},
  150152: { type: ItemType.Box, src: 'etc/90', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.ArenaMedal, 240] }},
  150153: { type: ItemType.Box, src: 'etc/90', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.ArenaMedal, 250] }},
  150154: { type: ItemType.Box, src: 'etc/90', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.ArenaMedal, 260] }},
  150155: { type: ItemType.Box, src: 'etc/90', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.ArenaMedal, 270] }},
  150156: { type: ItemType.Box, src: 'etc/90', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.ArenaMedal, 280] }},
  150157: { type: ItemType.Box, src: 'etc/90', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.ArenaMedal, 300] }},
  150158: { type: ItemType.Box, src: 'etc/90', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.ArenaMedal, 800] }},
  150159: { type: ItemType.Box, src: 'etc/90', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.ArenaMedal, 2000] }},
  150160: { type: ItemType.Box, src: 'etc/90', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.ArenaMedal, 5000] }},
  150161: { type: ItemType.Box, src: 'etc/90', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.ArenaMedal, 1000] }},
  150162: { type: ItemType.Box, src: 'etc/90', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.ArenaMedal, 2000] }},

  150167: { type: ItemType.Box, src: 'etc/86', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.Exp, 45000000] }}, // Remove
  150168: { type: ItemType.Box, src: 'etc/86', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.Exp, 450] }},
  150169: { type: ItemType.Box, src: 'etc/86', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.Exp, 1300] }},
  150170: { type: ItemType.Box, src: 'etc/86', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.Exp, 2300] }},
  150171: { type: ItemType.Box, src: 'etc/86', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.Exp, 3300] }},
  150172: { type: ItemType.Box, src: 'etc/86', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.Exp, 4400] }},
  150173: { type: ItemType.Box, src: 'etc/86', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.Exp, 5000] }},
  150174: { type: ItemType.Box, src: 'etc/86', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.Exp, 6100] }},
  150175: { type: ItemType.Box, src: 'etc/86', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.Exp, 7000] }},
  150176: { type: ItemType.Box, src: 'etc/86', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.Exp, 8000] }},
  150177: { type: ItemType.Box, src: 'etc/86', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.Exp, 8700] }},

  150270: { type: ItemType.Etc, src: 'etc/vip/1', size: 4, value: 1 },
  150271: { type: ItemType.Etc, src: 'etc/vip/2', size: 4, value: 1 },
  150272: { type: ItemType.Etc, src: 'etc/vip/3', size: 4, value: 1 },

  150316: { type: ItemType.Box, src: 'etc/13', size: 1, innate: { boxType: BoxType.RandomItem, content: [110101, 110201, 110301, 110401, 110501, 110601]}},
  150345: { // Outfit Gift Box
    type: ItemType.Box, 
    src: 'etc/22',
    size: 1,
    innate: {
      boxType: BoxType.RandomItemWeighted,
      content: [
        [290003, 100], [290009, 100], [290012, 100], [290014, 100], [290016, 100], [290017, 100], [290018, 100], [290019, 100], [290020, 100], // Gray Outfits 
        [290026, 100], [290032, 100], [290033, 100], [290034, 100], [290036, 100], [290039, 100], [290061, 100], [290063, 100], [290065, 100],
        
        [290006, 400], [290007, 400], [290010, 400], [290011, 400], [290013, 400], [290015, 400], [290021, 400], [290022, 400], [290023, 400], // Blue Outfits
        [290028, 400], [290052, 400], [290054, 400], [290060, 400], [290062, 400], [290064, 400], [290066, 400], [290069, 400], [290076, 400],
      ]
    }
  }, 
  150346: { // Advanced Outfit Gift Box
    type: ItemType.Box, 
    src: 'etc/23',
    size: 1,
    innate: {
      boxType: BoxType.RandomItemWeighted,
      content: [
        [290006, 111], [290007, 111], [290010, 111], [290011, 111], [290013, 111], [290015, 111], [290021, 111], [290022, 111], [290023, 111], // Blue Outfits
        [290028, 111], [290052, 111], [290054, 111], [290060, 111], [290062, 111], [290064, 111], [290066, 111], [290069, 111], [290076, 111],

        [290001, 380], [290004, 380], [290005, 380], [290008, 380], [290027, 380], [290029, 380], [290035, 380], [290037, 380], [290045, 380], // Orange Outfits
        [290046, 380], [290047, 380], [290048, 380], [290049, 380], [290051, 380], [290055, 380], [290056, 380], [290057, 380], [290058, 380], 
        [290072, 380], [290074, 380], [290084, 380], [290085, 380], [290090, 380], 

        // [2940030, 380], [2940040, 380], [2940050, 380], [2940070, 380], [2940130, 380], [2940140, 380],
      ]
    }
  }, 
  150347: { // Elegant Gift Box
    type: ItemType.Box, 
    src: 'etc/21',
    size: 1,
    innate: {
      boxType: BoxType.RandomItemWeighted,
      content: [
        [161060, 100],
        [150301, 100],
        [150259, 200]
      ]
    }
  },
  150405: { type: ItemType.Box, src: 'etc/212', size: 4, innate: { boxType: BoxType.DropTable, table: 1000062 }},
  150406: { type: ItemType.Etc, src: 'etc/210', size: 1, value: 1},
  150433: { type: ItemType.Box, src: 'etc/217', size: 1, innate: { boxType: BoxType.AdvancedExpBag, rate: 3.74 }},
  150434: { type: ItemType.Box, src: 'etc/218', size: 1, innate: { boxType: BoxType.AdvancedExpBag, rate: 20 }},
  150435: { type: ItemType.Box, src: 'etc/219', size: 1, innate: { boxType: BoxType.AdvancedExpBag, rate: 30 }},

  150500: { type: ItemType.Box, src: 'etc/13', size: 1, innate: { boxType: BoxType.DropTable, table: 2500 }},
  150501: { type: ItemType.Box, src: 'etc/13', size: 1, innate: { boxType: BoxType.DropTable, table: 2501 }},
  150502: { type: ItemType.Box, src: 'etc/13', size: 1, innate: { boxType: BoxType.DropTable, table: 2502 }},
  150503: { type: ItemType.Box, src: 'etc/13', size: 1, innate: { boxType: BoxType.DropTable, table: 2503 }},
  150509: { type: ItemType.Box, src: 'etc/12', size: 1, innate: { boxType: BoxType.DropTable, table: 2509 }},
  150510: { type: ItemType.Box, src: 'etc/12', size: 1, innate: { boxType: BoxType.DropTable, table: 2510 }},
  150511: { type: ItemType.Box, src: 'etc/12', size: 1, innate: { boxType: BoxType.DropTable, table: 2511 }},
  150512: { type: ItemType.Box, src: 'etc/12', size: 1, innate: { boxType: BoxType.DropTable, table: 2512 }},
  150518: { type: ItemType.Box, src: 'etc/11', size: 1, innate: { boxType: BoxType.DropTable, table: 2518 }},
  150519: { type: ItemType.Box, src: 'etc/11', size: 1, innate: { boxType: BoxType.DropTable, table: 2519 }},
  150520: { type: ItemType.Box, src: 'etc/11', size: 1, innate: { boxType: BoxType.DropTable, table: 2520 }},
  150521: { type: ItemType.Box, src: 'etc/11', size: 1, innate: { boxType: BoxType.DropTable, table: 2521 }},
  
  150527: { type: ItemType.Box, src: 'etc/86', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.Exp, 1000] }},
  150528: { type: ItemType.Box, src: 'etc/86', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.Exp, 2000] }},
  150529: { type: ItemType.Box, src: 'etc/86', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.Exp, 4000] }},
  150530: { type: ItemType.Box, src: 'etc/86', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.Exp, 6000] }},
  150536: { type: ItemType.Box, src: 'etc/88', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.Stone, 5600] }},
  150537: { type: ItemType.Box, src: 'etc/88', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.Stone, 6300] }},
  150538: { type: ItemType.Box, src: 'etc/88', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.Stone, 7000] }},
  150539: { type: ItemType.Box, src: 'etc/88', size: 1, innate: { boxType: BoxType.Bag, content: [BagType.Stone, 7600] }},

  150578: { type: ItemType.Box, src: 'etc/233', size: 4, innate: { boxType: BoxType.RandomItemWeighted, content: [
    [250107, 10, 0, 4],
    [250108, 10, 0, 4],
    [260107, 10, 0, 4],
    [260108, 10, 0, 4],
    [270107, 10, 0, 4],
    [270108, 10, 0, 4],
    [240107, 10, 0, 4],
    [240108, 10, 0, 4],
    [220104, 10, 0, 4],
    [230104, 10, 0, 4],
    [210104, 10, 0, 4],
    [280104, 10, 0, 4],
    [310104, 10, 0, 4],
    [250109, 10, 0, 4],
    [250110, 10, 0, 4],
    [260109, 10, 0, 4],
    [260110, 10, 0, 4],
    [270109, 10, 0, 4],
    [270110, 10, 0, 4],
    [240109, 10, 0, 4],
    [240110, 10, 0, 4],
    [220105, 10, 0, 4],
    [230105, 10, 0, 4],
    [210105, 10, 0, 4],
    [280105, 10, 0, 4],
    [310105, 10, 0, 4],
    [250111, 10, 0, 4],
    [250112, 10, 0, 4],
    [260111, 10, 0, 4],
    [260112, 10, 0, 4],
    [270111, 10, 0, 4],
    [270112, 10, 0, 4],
    [240111, 10, 0, 4],
    [240112, 10, 0, 4],
    [220106, 10, 0, 4],
    [230106, 10, 0, 4],
    [210106, 10, 0, 4],
    [280106, 10, 0, 4],
    [310106, 10, 0, 4],    
  ]}},

  150600: { type: ItemType.Box, src: 'etc/13', size: 1, innate: { boxType: BoxType.DropTable, table: 2600 }},
  150601: { type: ItemType.Box, src: 'etc/13', size: 1, innate: { boxType: BoxType.DropTable, table: 2601 }},
  150602: { type: ItemType.Box, src: 'etc/13', size: 1, innate: { boxType: BoxType.DropTable, table: 2602 }},

  152015: { type: ItemType.Etc, src: 'gems/7', value: 0 },

  152025: { type: ItemType.Box, src: 'etc/14', size: 1, innate: { boxType: BoxType.DropTable, table: 1000088 }},

  152029: { type: ItemType.Box, src: 'etc/280', size: 4, innate: { boxType: BoxType.RandomItemWeighted, content: [
    // [190223, 1, 0, 0],
    // [190224, 1, 0, 0],
    // [190225, 1, 0, 0],
    // [190226, 1, 0, 0],
    // [190227, 1, 0, 0],
    // [190228, 1, 0, 0],
    // [190229, 1, 0, 0],
    // [190230, 1, 0, 0],
    // [190231, 1, 0, 0],
    // [190232, 1, 0, 0],
    // [190233, 1, 0, 0],
    // [190234, 1, 0, 0],
    // [190211, 1, 0, 0],
    // [190212, 1, 0, 0],
    // [190213, 1, 0, 0],
    // [190214, 1, 0, 0],
    // [190215, 1, 0, 0],
    // [190216, 1, 0, 0],
    // [190217, 1, 0, 0],
    // [190218, 1, 0, 0],
    // [190219, 1, 0, 0],
    // [190220, 1, 0, 0],
    // [190221, 1, 0, 0],
    // [190222, 1, 0, 0],    
  ]}},
  152030: { type: ItemType.Box, src: 'etc/279', size: 4, innate: { boxType: BoxType.RandomItemWeighted, content: [
    // [190203, 1, 0, 0],
    // [190204, 1, 0, 0],
    // [190205, 1, 0, 0],
    // [190206, 1, 0, 0],
    // [190207, 1, 0, 0],
    // [190208, 1, 0, 0],
    // [190209, 1, 0, 0],
    // [190210, 3, 0, 0],
  ]}},

  152044: { type: ItemType.Box, src: 'etc/166', size: 4, innate: { boxType: BoxType.DropTable, table: 1001027 }},
  152045: { type: ItemType.Box, src: 'etc/228', size: 4, innate: { boxType: BoxType.DropTable, table: 1001028 }},
  152046: { type: ItemType.Box, src: 'etc/88', size: 1, innate: { boxType: BoxType.FixedDrop, content: [[150117, 1, 1]]}},

  152059: { type: ItemType.Box, src: 'etc/78', size: 1, innate: { boxType: BoxType.FixedDrop, content: [[150078, 20, 1]]}},
  152060: { type: ItemType.Box, src: 'etc/78', size: 1, innate: { boxType: BoxType.FixedDrop, content: [
    [110101, 20, 1],
    [110201, 20, 1],
    [110301, 20, 1],
    [110401, 20, 1],
    [110501, 20, 1],
    [110601, 20, 1],
  ]}}, // REMOVE ME

  152098: { type: ItemType.Box, src: 'etc/291', size: 1, innate: { boxType: BoxType.RandomItemWeighted, content: [
    // [160113, 4930, 0, 0],
    [152044, 560, 1, 0],
    // [152030, 560, 1, 0],
    // [160104, 1050, 1, 0],
    // [152029, 1050, 1, 0],
    // [152045, 1050, 1, 0],
    // [160103, 1250, 1, 0],
    // [160102, 2500, 1, 0],
    // [161002, 2586, 1, 0],
    // [150126, 3125, 1, 0],
    // [150406, 3571, 1, 0],
    // [150078, 7200, 1, 0],
    // [152103, 3750, 1, 0],
    // [150156, 4687, 1, 0],
    // [160101, 5000, 1, 0],
    // [160001, 10800, 1, 0],
    // [141011, 13500, 1, 0],
    // [170110, 15000, 1, 0],
    // [170112, 15000, 1, 0],
    // [161004, 16875, 1, 0],
    // [161001, 16875, 1, 0],
    // [161003, 16875, 1, 0],
  ]}},

  152097: { type: ItemType.Box, src: 'etc/90', size: 1, innate: { boxType: BoxType.FixedDrop, content: [[152015, 300, 1]]}},

  152100: {type: ItemType.Box, src: 'etc/293', size: 1, innate: { boxType: BoxType.RandomItemWeighted, content: [
    [160113, 2730, 0, 0],
    [160114, 975, 0, 0],
    [152097, 100, 1, 0],
    [152044, 160, 1, 0],
    [152030, 160, 1, 0],
    [160104, 480, 1, 0],
    [152029, 480, 1, 0],
    // [150435, 0, 1, 0],
    [152059, 800, 1, 0],
    [150272, 930, 1, 0],
    [150578, 1333, 1, 0],
    // [152028, 0, 1, 0],
    [161002, 2298, 1, 0],
    [150126, 3333, 1, 0],
    [150271, 2352, 1, 0],
    [160102, 2666, 1, 0],
    [350108, 5000, 1, 0],
    [160001, 6000, 1, 0],
    [150157, 6000, 1, 0],
    [150177, 6000, 1, 0],
    [160101, 11600, 1, 0],
    [150406, 12428, 1, 0],  
  ]}},

  159104: {
    type: ItemType.Box,
    src: 'etc/114',
    size: 4,
    innate: {
      boxType: BoxType.All,
      content: [
        // [159105, -1, 1],
        [250100, 1, 1],
        [260100, 1, 1],
        [270100, 1, 1],
      ]
    }
  }
}