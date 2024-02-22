const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class WindEnhancement extends PassiveSkill {
	static modifier = Stat.SkillAdd4;
	static amount = 100;
}