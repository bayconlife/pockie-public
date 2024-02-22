const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class PetCritExpert extends PassiveSkill {
	static modifier = Stat.Critical_Multiplier;
	static amount = 34;
}