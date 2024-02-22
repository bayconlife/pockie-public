const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class ToolMaster extends PassiveSkill {
	static modifier = Stat.SkillAdd6;
	static amount = 1500;
}