const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class WaterRelease extends PassiveSkill {
	static modifier = Stat.SkillAdd1;
	static amount = 3;
}