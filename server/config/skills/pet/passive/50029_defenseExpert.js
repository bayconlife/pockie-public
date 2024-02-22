const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class PetDefenseExpert extends PassiveSkill {
	static modifier = Stat.Defense;
	static amount = 58;
}