const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class PetToughnessExpert extends PassiveSkill {
	static modifier = Stat.Toughness;
	static amount = 52;
}