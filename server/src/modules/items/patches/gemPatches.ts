import { Item } from '../../../interfaces';
import { Patch, getItemIdentifier } from '.';

export function createAddHolePatch(item: Item) {
  return [Patch.ADD_HOLE, ...getItemIdentifier(item)];
}
