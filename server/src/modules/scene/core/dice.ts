import { SocketFunction } from '../../../types';
import { GameModule } from '../../../components/classes';
import { randomInt } from '../../../components/random';

const MODULE_NAME = 'DiceModule';

const diceRoll: SocketFunction = async (socket, character, idx, cb) => {
  let total = 0;
  const rolls: number[] = [];

  for (let i = 0; i < 6; i++) {
    const roll = randomInt(1, 6);

    rolls.push(roll);
    total += roll;
  }

  if ([6, 16, 26, 36].includes(total)) {
    // grant angel buff 80102, 21600
  } else if ([14, 24, 34].includes(total)) {
    // grant devil buff 80202, 21600
  } else if (total >= 28) {
    // grant low level angel 80101, 7200
  } else if (total < 14) {
    // grant low level devil 80201, 7200
  }
};

export default class DiceModule extends GameModule {
  moduleName = MODULE_NAME;
  modules = {};
}
