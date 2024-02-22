const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class Dragonscale extends PassiveSkill {
	static modifier = Stat.Defense;
	static amount = 100;
}