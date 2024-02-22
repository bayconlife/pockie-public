import { User } from '../../components/classes';
import { ItemLocations } from '../../enums';
import { getItemBase, getItemInLocation } from '../items/itemSystem';

export function getAvatar(user: User) {
  return getItemBase(getItemInLocation(user, ItemLocations.Equipment_Avatar)!.iid).innate.avatar;
}
