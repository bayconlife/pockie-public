const Rasengan = require("../../../../../skills/core/active/rasengan");

module.exports = class Rasengan2 extends Rasengan {
  windDamage = 2.2;
  reflectedDamage = 0.2;

  skillInfo = [this.mpModifier, this.probability, this.windDamage * 100, this.reflectedDamage * 100];
}