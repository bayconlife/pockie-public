const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class PetHitExpert extends PassiveSkill {
	static modifier = Stat.Hit;
	static amount = 58;
}