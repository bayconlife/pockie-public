const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class PetMaxMpExpert extends PassiveSkill {
	static modifier = Stat.Max_Mp;
	static amount = 50;
}