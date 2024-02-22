const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class WindExpert extends PassiveSkill {
	static modifier = Stat.SkillAdd4;
	static amount = 1000;
}