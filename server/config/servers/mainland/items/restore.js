const { hasDailyLimit, isPetFood } = require('./util');

const ItemType = require('../../../items/types').Item;

function createBaseItem(imageId, value, price, base='pharmacy') {
	return { type: ItemType.Pharmacy, size: 1, src: `${base}/${imageId}`, value, price };
}

module.exports = {
	160001: hasDailyLimit(3, isPetFood(6, 80, {...createBaseItem(1, 0, 300), innate: { energy: 20 }})),
	160002: hasDailyLimit(3, isPetFood(6, 80, {...createBaseItem(2, 0, 400), innate: { energy: 30 }})),
	160003: hasDailyLimit(3, isPetFood(6, 80, {...createBaseItem(3, 0, 500), innate: { energy: 40 }})),
	160004: hasDailyLimit(3, isPetFood(6, 180, {...createBaseItem(4, 29, 200), innate: { energy: 10 }})),
	160005: hasDailyLimit(3, isPetFood(6, 10, {...createBaseItem(5, 24, 100), innate: { energy: 5 }})),
	
	160006: isPetFood(6, 5, {...createBaseItem(6, 1, 16), innate: { hp: 150 }}),
	160007: isPetFood(6, 5, {...createBaseItem(7, 1, 20), innate: { hp: 250 }}),
	160008: isPetFood(6, 5, {...createBaseItem(8, 1, 24), innate: { hp: 350 }}),
	160009: isPetFood(6, 5, {...createBaseItem(9, 1, 26), innate: { hp: 450 }}),
	160010: isPetFood(6, 5, {...createBaseItem(10, 1, 29), innate: { hp: 550 }}),
	160011: isPetFood(6, 5, {...createBaseItem(11, 1, 31), innate: { hp: 700 }}),
	160012: isPetFood(6, 5, {...createBaseItem(12, 1, 33), innate: { hp: 800 }}),
	160013: isPetFood(6, 5, {...createBaseItem(13, 1, 35), innate: { hp: 900 }}),
	160014: isPetFood(6, 5, {...createBaseItem(14, 1, 37), innate: { hp: 1000 }}),
	160015: isPetFood(6, 5, {...createBaseItem(15, 1, 39), innate: { hp: 1100 }}),

	160016: isPetFood(6, 5, {...createBaseItem(16, 1, 16), innate: { mp: 150 }}),
	160017: isPetFood(6, 5, {...createBaseItem(17, 1, 20), innate: { mp: 250 }}),
	160018: isPetFood(6, 5, {...createBaseItem(18, 1, 24), innate: { mp: 350 }}),
	160019: isPetFood(6, 5, {...createBaseItem(19, 1, 26), innate: { mp: 450 }}),
	160020: isPetFood(6, 5, {...createBaseItem(20, 1, 29), innate: { mp: 550 }}),
	160021: isPetFood(6, 5, {...createBaseItem(21, 1, 31), innate: { mp: 700 }}),
	160022: isPetFood(6, 5, {...createBaseItem(22, 1, 33), innate: { mp: 800 }}),
	160023: isPetFood(6, 5, {...createBaseItem(23, 1, 35), innate: { mp: 900 }}),
	160024: isPetFood(6, 5, {...createBaseItem(24, 1, 37), innate: { mp: 1000 }}),
	160025: isPetFood(6, 5, {...createBaseItem(25, 1, 39), innate: { mp: 1100 }}),

	160026: isPetFood(6, 80, {...createBaseItem(26, 15, 60), innate: { hp: 150, mp: 150 }}),
	160027: isPetFood(6, 80, {...createBaseItem(27, 15, 72), innate: { hp: 250, mp: 250 }}),
	160028: isPetFood(6, 80, {...createBaseItem(28, 15, 78), innate: { hp: 350, mp: 350 }}),
	160029: isPetFood(6, 80, {...createBaseItem(29, 15, 87), innate: { hp: 450, mp: 450 }}),
	160030: isPetFood(6, 80, {...createBaseItem(30, 15, 93), innate: { hp: 550, mp: 550 }}),
	160031: isPetFood(6, 80, {...createBaseItem(31, 15, 99), innate: { hp: 700, mp: 700 }}),
	160032: isPetFood(6, 80, {...createBaseItem(32, 15, 105), innate: { hp: 800, mp: 800 }}),
	160033: isPetFood(6, 80, {...createBaseItem(33, 15, 111), innate: { hp: 900, mp: 900 }}),
	160034: isPetFood(6, 80, {...createBaseItem(34, 15, 117), innate: { hp: 1000, mp: 1000 }}),
	160035: isPetFood(6, 80, {...createBaseItem(35, 15, 120), innate: { hp: 1100, mp: 1100 }}),
	160036: isPetFood(6, 80, {...createBaseItem(36, 15, 130), innate: { hp: 1200, mp: 1200 }}),

	160050: isPetFood(6, 100, {...createBaseItem(100, 1, 0, 'etc'), innate: { hp: 1000 }}),
	160051: isPetFood(6, 100, {...createBaseItem(100, 1, 0, 'etc'), innate: { hp: 2000 }}),
	160052: isPetFood(6, 100, {...createBaseItem(100, 1, 0, 'etc'), innate: { hp: 3000 }}),
	160053: isPetFood(6, 100, {...createBaseItem(100, 1, 0, 'etc'), innate: { hp: 4000 }}),
	160054: isPetFood(6, 100, {...createBaseItem(100, 1, 0, 'etc'), innate: { hp: 5000 }}),
	160055: isPetFood(6, 100, {...createBaseItem(100, 1, 0, 'etc'), innate: { hp: 6000 }}),
	160056: isPetFood(6, 100, {...createBaseItem(100, 1, 0, 'etc'), innate: { hp: 7000 }}),
	160057: isPetFood(6, 100, {...createBaseItem(100, 1, 0, 'etc'), innate: { hp: 8000 }}),
	160058: isPetFood(6, 100, {...createBaseItem(100, 1, 0, 'etc'), innate: { hp: 9000 }}),
	160059: isPetFood(6, 100, {...createBaseItem(100, 1, 0, 'etc'), innate: { hp: 10000 }}),

	160070: isPetFood(6, 100, {...createBaseItem(100, 1, 0, 'etc'), innate: { mp: 1000 }}),
	160071: isPetFood(6, 100, {...createBaseItem(100, 1, 0, 'etc'), innate: { mp: 2000 }}),
	160072: isPetFood(6, 100, {...createBaseItem(100, 1, 0, 'etc'), innate: { mp: 3000 }}),
	160073: isPetFood(6, 100, {...createBaseItem(100, 1, 0, 'etc'), innate: { mp: 4000 }}),
	160074: isPetFood(6, 100, {...createBaseItem(100, 1, 0, 'etc'), innate: { mp: 5000 }}),
	160075: isPetFood(6, 100, {...createBaseItem(100, 1, 0, 'etc'), innate: { mp: 6000 }}),
	160076: isPetFood(6, 100, {...createBaseItem(100, 1, 0, 'etc'), innate: { mp: 7000 }}),
	160077: isPetFood(6, 100, {...createBaseItem(100, 1, 0, 'etc'), innate: { mp: 8000 }}),
	160078: isPetFood(6, 100, {...createBaseItem(100, 1, 0, 'etc'), innate: { mp: 9000 }}),
	160079: isPetFood(6, 100, {...createBaseItem(100, 1, 0, 'etc'), innate: { mp: 10000 }}),

	160080: isPetFood(6, 5, {...createBaseItem(36, 1, 41), innate: { hp: 1200 }}),
	160081: isPetFood(6, 5, {...createBaseItem(36, 1, 41), innate: { mp: 1200 }}),
}