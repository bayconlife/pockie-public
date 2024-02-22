const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class IllusionaryTechnique extends PassiveSkill {
	static modifier = Stat.SkillAdd8;
	static amount = 3;
}