const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class IllusionExpert extends PassiveSkill {
	static modifier = Stat.SkillAdd8;
	static amount = 1000;
}