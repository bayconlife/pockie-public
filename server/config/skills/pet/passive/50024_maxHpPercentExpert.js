const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class PetMaxHpPercentExpert extends PassiveSkill {
	static modifier = Stat.Max_Hp_Multiplier;
	static amount = 100;
}