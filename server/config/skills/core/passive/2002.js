const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class FireMaster extends PassiveSkill {
	static modifier = Stat.SkillAdd0;
	static amount = 1500;
}