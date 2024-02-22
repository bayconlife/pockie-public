const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class PetExpExpert extends PassiveSkill {
	static modifier = Stat.ExpRate;
	static amount = 10;
}