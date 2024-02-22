const ItemType = require('./types').Item;


module.exports = {
	161001: { type: ItemType.Etc, src: 'etc/139' }, // Free Add Enchantment
	161002: { type: ItemType.Etc, src: 'etc/137' }, // Free Add Hole
	161003: { type: ItemType.Etc, src: 'etc/136' }, // Level 8 Strengthening Talisman
  161004: { type: ItemType.Etc, src: 'etc/138' }, // Refine Talisman
	161005: { type: ItemType.Etc, src: 'gems/135' }, // Skill Reset Stone
  161007: { type: ItemType.Etc, src: 'etc/recast' }, // Recast Talisman
  161008: { type: ItemType.Etc, src: 'etc/lowseal' }, // Low Level Inscription Talisman
  161009: { type: ItemType.Etc, src: 'etc/highseal' }, // High Level Inscription Talisman

	161020: { type: ItemType.FreeUse, src: 'etc/139', size: 1, value : 0, innate: { level: 30 }}, // Magic Free
	161021: { type: ItemType.FreeUse, src: 'etc/139', size: 1, value : 0, innate: { level: 40 }}, // Magic Free
	161022: { type: ItemType.FreeUse, src: 'etc/139', size: 1, value : 0, innate: { level: 50 }}, // Magic Free
	161023: { type: ItemType.FreeUse, src: 'etc/139', size: 1, value : 0, innate: { level: 60 }}, // Magic Free
	161024: { type: ItemType.FreeUse, src: 'etc/139', size: 1, value : 0, innate: { level: 70 }}, // Magic Free
	161025: { type: ItemType.FreeUse, src: 'etc/139', size: 1, value : 0, innate: { level: 80 }}, // Magic Free
	161026: { type: ItemType.FreeUse, src: 'etc/139', size: 1, value : 0, innate: { level: 90 }}, // Magic Free
	
	161040: { type: ItemType.FreeUse, src: 'etc/137', size: 1, value : 0, innate: { level: 30 }}, // Free Hole
	161041: { type: ItemType.FreeUse, src: 'etc/137', size: 1, value : 0, innate: { level: 40 }}, // Free Hole
	161042: { type: ItemType.FreeUse, src: 'etc/137', size: 1, value : 0, innate: { level: 50 }}, // Free Hole
	161043: { type: ItemType.FreeUse, src: 'etc/137', size: 1, value : 0, innate: { level: 60 }}, // Free Hole
	161044: { type: ItemType.FreeUse, src: 'etc/137', size: 1, value : 0, innate: { level: 70 }}, // Free Hole
	161045: { type: ItemType.FreeUse, src: 'etc/137', size: 1, value : 0, innate: { level: 80 }}, // Free Hole
	161046: { type: ItemType.FreeUse, src: 'etc/137', size: 1, value : 0, innate: { level: 90 }}, // Free Hole

	161060: { type: ItemType.FreeUse, src: 'etc/136', size: 1, value: 0, price: 100, innate: { level: 30 }}, // Level 1 Enhance Talisman
	161061: { type: ItemType.FreeUse, src: 'etc/136', size: 1, value: 0, price: 100, innate: { level: 40 }},
	161062: { type: ItemType.FreeUse, src: 'etc/136', size: 1, value: 0, price: 100, innate: { level: 50 }},
	161063: { type: ItemType.FreeUse, src: 'etc/136', size: 1, value: 0, price: 100, innate: { level: 60 }},
	161064: { type: ItemType.FreeUse, src: 'etc/136', size: 1, value: 0, price: 100, innate: { level: 70 }},
	161065: { type: ItemType.FreeUse, src: 'etc/136', size: 1, value: 0, price: 100, innate: { level: 80 }},
	161066: { type: ItemType.FreeUse, src: 'etc/136', size: 1, value: 0, price: 100, innate: { level: 90 }},

}