const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class EarthRelease extends PassiveSkill {
	static modifier = Stat.SkillAdd2;
	static amount = 3;
}