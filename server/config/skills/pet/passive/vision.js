const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class Vision extends PassiveSkill {
	static modifier = Stat.Hit;
	static amount = 29;
}