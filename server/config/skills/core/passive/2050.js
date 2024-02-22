const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class BodyBasic extends PassiveSkill {
	static modifier = Stat.SkillAdd5;
	static amount = 500;
}