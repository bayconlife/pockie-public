const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class Sharpness extends PassiveSkill {
	static modifier = Stat.Speed_Multiplier;
	static amount = 50;
}