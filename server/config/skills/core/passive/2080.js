const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class IllusionBasic extends PassiveSkill {
	static modifier = Stat.SkillAdd8;
	static amount = 500;
}