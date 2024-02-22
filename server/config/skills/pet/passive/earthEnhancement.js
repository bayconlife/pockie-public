const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class EarthEnhancement extends PassiveSkill {
	static modifier = Stat.SkillAdd2;
	static amount = 100;
}