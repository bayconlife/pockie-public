import { LINES, LINE_GROUPS } from '../../resources/lines';
import { CustomSocket, Item } from '../../interfaces';
import { getItemType } from '../items/itemSystem';

const MODULE_NAME = 'TestDrops';

export function testDropsAddLines(socket: CustomSocket, item: Item, propCount: number) {
  const typeConfig = socket.getConfig().Base.TestDrops[getItemType(item)];
  let validLines: number[] = [];
  const currentLines = item.props.lines?.length ?? 0;

  if (!!typeConfig) {
    const levelIdx = typeConfig.levels.indexOf(item.props.level);
    const lineGroup = (typeConfig.lines[levelIdx] ?? 1001) + (4 - propCount) - currentLines;

    validLines = [...LINE_GROUPS[lineGroup]];
  } else {
    return [];
  }

  return validLines;
}
