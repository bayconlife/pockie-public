const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class PetDodgeExpert extends PassiveSkill {
	static modifier = Stat.Dodge;
	static amount = 38;
}