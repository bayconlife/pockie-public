const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class PetPierceExpert extends PassiveSkill {
	static modifier = Stat.Pierce;
	static amount = 58;
}