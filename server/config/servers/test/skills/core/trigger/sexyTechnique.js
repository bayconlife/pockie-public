const SexyTechnique = require("../../../../../skills/core/trigger/sexyTechnique");

module.exports = class SexyTechnique2 extends SexyTechnique {
  probability = 30;
  duration = 500;
  uses = 3;

  skillInfo = [this.mpModifier, this.probability, this.duration / 100, this.uses];
}