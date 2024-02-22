const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class Ferocious extends PassiveSkill {
	static modifier = Stat.Attack_Multiplier;
	static amount = 50;
}