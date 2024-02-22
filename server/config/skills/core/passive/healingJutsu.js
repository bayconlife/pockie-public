const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class HealingJutsu extends PassiveSkill {
	static modifier = Stat.SkillAdd9;
	static amount = 3;
}