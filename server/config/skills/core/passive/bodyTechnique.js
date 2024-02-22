const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class BodyTechnique extends PassiveSkill {
	static modifier = Stat.SkillAdd5;
	static amount = 3;
}