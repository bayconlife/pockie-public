const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class WaterBasic extends PassiveSkill {
	static modifier = Stat.SkillAdd1;
	static amount = 500;
}