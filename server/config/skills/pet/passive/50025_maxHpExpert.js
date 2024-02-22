const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class PetMaxHpExpert extends PassiveSkill {
	static modifier = Stat.Max_Hp;
	static amount = 50;
}