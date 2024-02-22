import { ItemLocations, ItemType } from '../../enums';
import { SocketFunction } from '../../types';
import { error } from '../kernel/errors';
import {
  addItemToLocation,
  createItem,
  emitItems,
  getItem,
  getItemAmount,
  getItemInLocation,
  getItemType,
  isLocationFilled,
  itemSwap,
  reduceItem,
} from './itemSystem';
import { randomInt } from '../../components/random';
import { getNextPosition } from './inventory';
import { Pet } from '../../resources/pet';
import { GameModule } from '../../components/classes';
import { notice } from '../kernel/notices';
import { Item } from '../../interfaces';

const locations = [
  ItemLocations.PetFood1,
  ItemLocations.PetFood2,
  ItemLocations.PetFood3,
  ItemLocations.PetFood4,
  ItemLocations.PetFood5,
  ItemLocations.PetFood6,
];

export function updatePetToMatchLevel(item: Item) {
  let skillTotal = item.props.skills.unlocked.reduce((sum: number, next: number) => sum + next, 0);

  while ((skillTotal < Pet.skillCount[item.props.level] ?? 0) && skillTotal < 18) {
    let pos = randomInt(0, 2);

    while (item.props.skills.unlocked[pos] >= 6) {
      pos = randomInt(0, 2);
    }

    item.props.skills.unlocked[pos] += 1;
    skillTotal = item.props.skills.unlocked.reduce((sum: number, next: number) => sum + next, 0);
  }

  item.props.needed = Pet.exp[item.props.level];
}

const petDiscoverSkill: SocketFunction<{ type: number }> = async (socket, character, { type }, cb) => {
  if (!isLocationFilled(character, ItemLocations.Pet)) {
    return error(socket, 'No pet to gain skills');
  }

  if (type > 2) {
    return error(socket, 'Invalid type');
  }

  const pet = getItemInLocation(character, ItemLocations.Pet);

  if (pet === undefined) {
    return error(socket, 'Invalid pet in slot');
  }

  if (pet.props.skills.available <= 0) {
    return error(socket, 'Needs growth level first.');
  }

  const unlocks = pet.props.skills.unlocked[type];
  let skills: number[] = pet.props.skills.aura;
  let locks: number[] = pet.props.skills.locks ?? [];

  if (type === 1) {
    skills = pet.props.skills.active;
  } else if (type === 2) {
    skills = pet.props.skills.passive;
  }

  if (unlocks == 2 && locks.length == 2 && locks.every((id) => skills.includes(id))) {
    return error(socket, 'error__cant_remove_skill');
  }

  let skillList = [...Pet.allPetSkills[type], ...Pet.naturePetSkills[pet.props.nature][type]];

  if (pet.iid in Pet.specificPetSkills) {
    skillList.push(...Pet.specificPetSkills[pet.iid][type]);
  }

  skillList = skillList.filter((id) => !skills.includes(id));

  if (skillList.length === 0) {
    return error(socket, 'No skills left to learn.');
  }

  const skill = skillList[randomInt(0, skillList.length - 1)];

  if (skills.length >= unlocks) {
    let removeIndex = randomInt(0, skills.length - 1);
    let c = 0;

    while (locks.includes(skills[removeIndex]) && c < 100) {
      removeIndex = randomInt(0, skills.length - 1);
      c++; // just in case until I can pin down what causes the infinite loop
    }

    skills[removeIndex] = skill;
  } else {
    skills.push(skill);
  }

  pet.props.skills.locks = [];
  pet.props.skills.available -= 1;

  return [emitItems];
};

const petFeed: SocketFunction = async (socket, character, data: any, cb) => {
  if (!(ItemLocations.Pet in character.locations)) {
    return error(socket, 'No pet to feed');
  }

  let growth = 0;

  locations.forEach((location) => {
    if (location in character.locations) {
      growth += character.items[character.locations[location]].props.hunger;
      reduceItem(character, character.items[character.locations[location]], 1);
    }
  });

  const pet = character.items[character.locations[ItemLocations.Pet]];

  pet.props.exp += growth;

  if (pet.props.exp > pet.props.needed) {
    pet.props.skills.available += 1;
    pet.props.exp -= pet.props.needed;
  }

  return [emitItems];
};

const petLockSkill: SocketFunction<number> = async (socket, character, id, cb) => {
  const pet = getItemInLocation(character, ItemLocations.Pet);

  if (pet === undefined) {
    return error(socket, 'error__missing_pet');
  }

  if ((pet.props.skills.locks ?? []).length >= 2) {
    return error(socket, 'error__already_locked_two_skills');
  }

  let hasSkill = pet.props.skills.aura.includes(id) || pet.props.skills.active.includes(id) || pet.props.skills.passive.includes(id);

  if (!hasSkill) {
    return error(socket, 'error__skill_not_learned');
  }

  let petLocks = Object.keys(character.items)
    .filter((k) => character.items[k].iid === Pet.lockSkillItem)
    .map((k) => character.items[k]);
  const currentLocks = pet.props.skills.locks?.length ?? 0;
  let petLocksNeeded = currentLocks < 1 ? 1 : 2;

  if (petLocks.reduce((sum, i) => (sum += getItemAmount(i)), 0) < petLocksNeeded) {
    return notice(socket, `Not enough Pet Skill Lock items found. You need 1 to lock your first skill and 2 to lock your second skill.`);
  }

  pet.props.skills.locks = [...(pet.props.skills.locks ?? []), id];

  for (let i = petLocks.length - 1; i >= 0; i--) {
    const count = getItemAmount(petLocks[i]);

    if (count >= petLocksNeeded) {
      reduceItem(character, petLocks[i], petLocksNeeded);
    } else {
      petLocksNeeded -= count;
      reduceItem(character, petLocks[i], count);
    }
  }

  cb();

  return [emitItems];
};

const petSetFood: SocketFunction<{ uid: string; location: number }> = async (socket, character, { uid, location }, cb) => {
  if (!locations.includes(location)) {
    return error(socket, 'Invalid location for food');
  }

  let item = getItem(character, uid);

  if (item === undefined) {
    return error(socket, 'Invalid item');
  }

  if (getItemType(item) !== ItemType.Crop) {
    return error(socket, 'Cannot put non food into that location');
  }

  // if (getItemAmount(item) > 1) {
  //   const newItem = createItem(character.items[uid].iid);
  //   const [position, location] = getNextPosition(character, newItem);

  //   if (position === -1) {
  //     return error(socket, 'You need 1 space free.');
  //   }

  //   newItem.count = 1;
  //   newItem.position = position;
  //   newItem.location = location;

  //   character.items[item.uid].count -= 1;
  //   character.items[newItem.uid] = newItem;

  //   item = newItem;
  //   uid = newItem.uid;
  // }

  if (location in character.locations) {
    itemSwap(character, item, character.items[character.locations[location]]);
  } else {
    addItemToLocation(socket, character, item, location);
  }

  return [emitItems];
};

const petSetPet: SocketFunction<string> = async (socket, character, uid, cb) => {
  const item = getItem(character, uid);

  if (item === undefined) {
    return error(socket, 'Invalid item');
  }

  if (getItemType(item) !== ItemType.Pet) {
    return error(socket, 'Cannot put non pet into that location');
  }

  if (ItemLocations.Pet in character.locations) {
    itemSwap(character, item, character.items[character.locations[ItemLocations.Pet]]);
  } else {
    addItemToLocation(socket, character, item, ItemLocations.Pet);
  }

  return [emitItems];
};

const petSkillUseBook: SocketFunction<{ book: string; pet: string }> = async (socket, character, { book: bookId, pet: petId }, cb) => {
  const pet = getItem(character, petId);

  if (pet === undefined) {
    return error(socket, 'error__invalid_pet');
  }

  const book = getItem(character, bookId);

  if (book === undefined) {
    return error(socket, 'error__invalid_item');
  }

  let type = book.props.type;
  const unlocks = pet.props.skills.unlocked[type];
  let skills: number[] = pet.props.skills.aura;
  let locks: number[] = pet.props.skills.locks ?? [];

  if (type === 1) {
    skills = pet.props.skills.active;
  } else if (type === 2) {
    skills = pet.props.skills.passive;
  }

  if (skills.includes(book.props.petSkill)) {
    return error(socket, 'error__skill_already_added');
  }

  if (unlocks == 2 && locks.length == 2 && locks.every((id) => skills.includes(id))) {
    return error(socket, 'error__cant_remove_skill');
  }

  if (skills.length >= unlocks) {
    let removeIndex = randomInt(0, skills.length - 1);
    let c = 0;

    while (locks.includes(skills[removeIndex]) && c < 100) {
      removeIndex = randomInt(0, skills.length - 1);
      c++; // just in case until I can pin down what causes the infinite loop
    }

    skills[removeIndex] = book.props.petSkill;
  } else {
    skills.push(book.props.petSkill);
  }

  pet.props.skills.locks = [];
  reduceItem(character, book, 1);

  cb();

  return [emitItems];
};

const petUnlockSkill: SocketFunction<number> = async (socket, character, id, cb) => {
  const pet = getItemInLocation(character, ItemLocations.Pet);

  if (pet === undefined) {
    return error(socket, 'error__missing_pet');
  }

  pet.props.skills.locks = (pet.props.skills.locks ?? []).filter((i: number) => i !== id);

  cb();

  return [emitItems];
};

const storePet: SocketFunction<{ slot: number; uid: string }> = async (socket, character, { slot, uid }, cb) => {
  const item = getItem(character, uid);

  if (item === undefined) {
    return error(socket, 'Invalid item');
  }

  if (getItemType(item) !== ItemType.Pet) {
    return error(socket, 'Cannot put non pet into that location');
  }

  const location = ItemLocations.PetStorage + slot;

  if (location < ItemLocations.PetStorage || slot >= 12) {
    return error(socket, 'error__invalid_location');
  }

  if (location in character.locations) {
    itemSwap(character, item, character.items[character.locations[location]]);
  } else {
    addItemToLocation(socket, character, item, location);
  }

  return [emitItems];
};

export default class PetModule extends GameModule {
  moduleName = 'Pets';
  modules = {
    petDiscover: petDiscoverSkill,
    petFeed,
    petLockSkill,
    petSetFood,
    petSetPet,
    petSkillUseBook,
    petUnlockSkill,
    storePet,
  };
}
