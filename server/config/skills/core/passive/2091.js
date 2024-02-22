const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class HealingExpert extends PassiveSkill {
	static modifier = Stat.SkillAdd9;
	static amount = 1000;
}