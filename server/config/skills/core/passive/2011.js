const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class WaterExpert extends PassiveSkill {
	static modifier = Stat.SkillAdd1;
	static amount = 1000;
}