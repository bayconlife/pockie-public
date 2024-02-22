const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class SealBasic extends PassiveSkill {
	static modifier = Stat.SkillAdd7;
	static amount = 500;
}