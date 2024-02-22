const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class WindRelease extends PassiveSkill {
	static modifier = Stat.SkillAdd4;
	static amount = 3;
}