const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class PetAttackPercentExpert extends PassiveSkill {
	static modifier = Stat.Attack_Multiplier;
	static amount = 100;
}