const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class SealingTechnique extends PassiveSkill {
	static modifier = Stat.SkillAdd7;
	static amount = 3;
}