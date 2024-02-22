const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class SealMaster extends PassiveSkill {
	static modifier = Stat.SkillAdd7;
	static amount = 1500;
}