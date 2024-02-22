const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class PetParryExpert extends PassiveSkill {
	static modifier = Stat.Parry_Multiplier;
	static amount = 38;
}