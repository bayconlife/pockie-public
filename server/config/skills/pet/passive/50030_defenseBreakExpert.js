const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class PetDefenseBreakExpert extends PassiveSkill {
	static modifier = Stat.Defense_Break;
	static amount = 51;
}