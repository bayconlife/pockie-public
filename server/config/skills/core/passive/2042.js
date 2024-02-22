const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class WindMaster extends PassiveSkill {
	static modifier = Stat.SkillAdd4;
	static amount = 1500;
}