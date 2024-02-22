const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class Wisdom extends PassiveSkill {
	static modifier = Stat.Max_Mp;
	static amount = 25;
}