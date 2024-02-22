import { Callback, SocketFunction } from '../../types';
import { CustomSocket } from '../../interfaces';
import { ItemLocations, ItemType } from '../../enums';
import { error, errorInvalidItem, errorInvalidLocation } from '../kernel/errors';
import { addItemToLocation, emitItems, getItem, getItemType, itemSwap, reduceItem } from './itemSystem';
import { REFINE } from '../../resources/refine';
import { emitStones } from '../character/character';
import { addLines } from '../drop/drops';
import { GameModule } from '../../components/classes';

const locations = [ItemLocations.Refine, ItemLocations.RefineTalisman];
const refineItemTypes = [
  ItemType.Belt,
  ItemType.Weapon,
  ItemType.Gloves,
  ItemType.Ring,
  ItemType.Amulet,
  ItemType.Helm,
  ItemType.Body,
  ItemType.Shoes,
];

const refineAttempt: SocketFunction = async (socket, character, _, cb) => {
  if (!(ItemLocations.Refine in character.locations)) {
    return error(socket, 'error__required_location_is_empty');
  }

  const item = getItem(character, character.locations[ItemLocations.Refine]);

  if (item === undefined) {
    return errorInvalidLocation(socket);
  }

  const talisman = getItem(character, character.locations[ItemLocations.RefineTalisman]);
  const previousLineCount = (item.props.lines ?? []).length;

  if (talisman === undefined) {
    if (character.stones < REFINE.cost) {
      return error(socket, 'error__invalid_stones');
    }

    if (!(ItemLocations.Refine in character.locations)) {
      return error(socket, 'error__required_location_is_empty');
    }

    const item = getItem(character, character.locations[ItemLocations.Refine]);

    if (item === undefined) {
      return errorInvalidLocation(socket);
    }

    character.stones -= REFINE.cost;

    item.props.lines = [];
    addLines(socket, item, previousLineCount);

    emitStones(socket, character);
  } else {
    reduceItem(character, talisman, 1);

    item.props.lines = [];
    addLines(socket, item, previousLineCount);
  }

  cb(item);

  return [emitItems];
};

const refineSetItem: SocketFunction<{ uid: string; location: number }> = async (socket, character, { uid, location }, cb) => {
  if (!locations.includes(location)) {
    return errorInvalidLocation(socket);
  }

  const item = getItem(character, uid);

  if (item === undefined) {
    return errorInvalidItem(socket);
  }

  if (location === ItemLocations.RefineTalisman && !REFINE.talismans.includes(item.iid)) {
    return error(socket, 'error__invalid_item_for_location');
  }

  if (location === ItemLocations.Refine && !refineItemTypes.includes(getItemType(item))) {
    return error(socket, 'error__invalid_item_for_location');
  }

  if (location in character.locations) {
    itemSwap(character, item, character.items[character.locations[location]]);
  } else {
    addItemToLocation(socket, character, item, location);
  }

  return [emitItems];
};

export default class RefineModule extends GameModule {
  moduleName = 'Refine';
  modules = {
    refineAttempt,
    refineSetItem,
  };
}
