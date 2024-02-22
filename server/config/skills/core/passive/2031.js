const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class LightningExpert extends PassiveSkill {
	static modifier = Stat.SkillAdd3;
	static amount = 1000;
}