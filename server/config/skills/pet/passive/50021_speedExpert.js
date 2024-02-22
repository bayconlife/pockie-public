const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class PetSpeedExpert extends PassiveSkill {
	static modifier = Stat.Speed_Multiplier;
	static amount = 100;
}