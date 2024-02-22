const { Stat } = require("../../../lines");
const { PassiveSkill } = require("../../util");

module.exports = class PetDropExpert extends PassiveSkill {
	static modifier = Stat.ItemDrop;
	static amount = 20;
}