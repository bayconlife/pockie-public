const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class PetMaxAttackExpert extends PassiveSkill {
	static modifier = Stat.Max_Attack;
	static amount = 13;
}