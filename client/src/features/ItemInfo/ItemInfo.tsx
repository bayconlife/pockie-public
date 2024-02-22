import './ItemInfo.css';
import * as React from 'react';
import { ItemType } from '../../enums';
import { getItemSize, getItemType } from '../../resources/Items';
import { IItem } from '../../slices/inventorySlice';
import { AmuletInfo } from './AmuletInfo';
import { ArmorInfo } from './ArmorInfo';
import { AvatarInfo } from './AvatarInfo';
import { WeaponInfo } from './WeaponInfo';
import { DefaultInfo } from './DefaultInfo';
import { BoxInfo } from './BoxInfo';
import { PharmacyInfo } from './PharmacyInfo';
import { NameInfo } from './components/NameInfo';
import { Details } from './components/Details';
import { LineBreak } from './components/LineBreak';
import { GemInfo } from './GemInfo';
import { EnchantmentInfo } from './EnchantmentInfo';
import { PetInfo } from './PetInfo';
import { TooltipContainer } from '../../components/Tooltips/TooltipContainer';
import { ImpressInfo } from './ImpressInfo';
import { WishingPotInfo } from './WishingPot';
import { PetSkillBookInfo } from './PetSkillBookInfo';

export const ItemInfo: React.FC<{ item: IItem; style?: React.CSSProperties }> = ({ item, style }) => {
  let content = null;

  switch (getItemType(item)) {
    case ItemType.Avatar:
      content = <AvatarInfo item={item} />;
      break;
    case ItemType.Weapon:
      content = <WeaponInfo item={item} />;
      break;
    case ItemType.Gloves:
    case ItemType.Helm:
    case ItemType.Body:
    case ItemType.Belt:
    case ItemType.Shoes:
      content = <ArmorInfo item={item} />;
      break;
    case ItemType.Amulet:
    case ItemType.Ring:
      content = <AmuletInfo item={item} />;
      break;
    case ItemType.Gem:
      content = <GemInfo item={item} />;
      break;
    case ItemType.Pharmacy:
      content = <PharmacyInfo item={item} />;
      break;
    case ItemType.Enchantment:
      content = <EnchantmentInfo item={item} />;
      break;
    case ItemType.Box:
      content = <BoxInfo item={item} />;
      break;
    case ItemType.Pet:
      content = <PetInfo item={item} />;
      break;
    case ItemType.Impress:
    case ItemType.ImpressRate:
      content = <ImpressInfo item={item} />;
      break;
    case ItemType.WishingPot:
      content = <WishingPotInfo item={item} />;
      break;
    case ItemType.PetSkillBook:
      content = <PetSkillBookInfo item={item} />;
      break;
    default:
      content = <DefaultInfo item={item} />;
  }

  const size = getItemSize(item);

  return (
    <TooltipContainer offsetX={size.width * 24} offsetY={-size.height * 30}>
      <div style={{ width: 300, ...style }}>
        <NameInfo item={item} />
        <LineBreak />
        {content}
        <Details item={item} />
      </div>
    </TooltipContainer>
  );
};
