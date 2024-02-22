const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class SharpClaws extends PassiveSkill {
	static modifier = Stat.Pierce;
	static amount = 29;
}