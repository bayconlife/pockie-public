import { useEffect, useState } from 'react';
import Panel from '../../components/Panel/Panel';
import JPanel from '../../components/UI/JPanel';
import { ItemType } from '../../enums';
import { IItem } from '../../slices/inventorySlice';
import { Item } from '../../components/Item';
import { getAvatarPose } from '../../resources/Items';
import { MultilineLabel } from '../../components/UI/MultilineLabel';
import { JTextField } from '../../components/UI/JTextField';
import { Label } from '../../components/UI/Label';
import { SkillIcon } from '../../components/SkillIcon/SkillIcon';
import { CharacterContextProvider } from '../../context/CharacterContext';
import { CDNImage } from '../../components/Elements/Image';
import { cancelFromServer, fromServer } from '../../util/ServerSocket';

const labelStyle: React.CSSProperties = {
  fontWeight: 'bold',
  textAlign: 'right',
  paddingTop: 3,
  fontSize: 11,
};

export function ViewCharacter() {
  const [character, setCharacter] = useState<any | null>(null);

  useEffect(() => {
    fromServer('viewCharacter', (char) => setCharacter(char));

    return () => {
      cancelFromServer('viewCharacter');
    };
  }, []);

  if (character === null) {
    return null;
  }

  const stats = character.stats;

  return (
    <CharacterContextProvider character={character}>
      <Panel name="View Character" onClose={() => setCharacter(null)}>
        <JPanel size={{ width: 333, height: 560 }}>
          <JPanel size={{ width: 63, height: 262 }} background="UIResource.Equip.EquipBG">
            <JPanel size={{ width: 55, height: 55 }} position={{ x: 4, y: 4 }} background="UIResource.Equip.Avatar">
              <EquipmentSlot slot={ItemType.Avatar} item={character.items[character.locations[300 + ItemType.Avatar]]} />
            </JPanel>
            <JPanel size={{ width: 55, height: 83 }} position={{ x: 4, y: 61 }}>
              <EquipmentSlot slot={ItemType.Weapon} item={character.items[character.locations[300 + ItemType.Weapon]]} />
            </JPanel>
            <JPanel size={{ width: 55, height: 55 }} position={{ x: 4, y: 146 }} background="UIResource.Equip.Glove">
              <EquipmentSlot slot={ItemType.Gloves} item={character.items[character.locations[300 + ItemType.Gloves]]} />
            </JPanel>
            <JPanel size={{ width: 55, height: 55 }} position={{ x: 4, y: 203 }} background="UIResource.Equip.Pet">
              <EquipmentSlot slot={ItemType.Pet} item={character.items[character.locations[300 + ItemType.Pet]]} />
            </JPanel>
          </JPanel>

          <JPanel size={{ width: 63, height: 262 }} position={{ x: 270, y: 0 }} background="UIResource.Equip.EquipBG">
            <JPanel size={{ width: 28, height: 28 }} position={{ x: 3, y: 3 }} background="UIResource.Equip.FingerRing">
              <EquipmentSlot slot={ItemType.Ring} item={character.items[character.locations[300 + ItemType.Ring]]} />
            </JPanel>
            <JPanel size={{ width: 28, height: 28 }} position={{ x: 32, y: 3 }} background="UIResource.Equip.Amu">
              <EquipmentSlot slot={ItemType.Amulet} item={character.items[character.locations[300 + ItemType.Amulet]]} />
            </JPanel>
            <JPanel size={{ width: 55, height: 55 }} position={{ x: 4, y: 32 }} background="UIResource.Equip.Hat">
              <EquipmentSlot slot={ItemType.Helm} item={character.items[character.locations[300 + ItemType.Helm]]} />
            </JPanel>
            <JPanel size={{ width: 55, height: 55 }} position={{ x: 4, y: 89 }} background="UIResource.Equip.Cloth">
              <EquipmentSlot slot={ItemType.Body} item={character.items[character.locations[300 + ItemType.Body]]} />
            </JPanel>
            <JPanel size={{ width: 55, height: 55 }} position={{ x: 4, y: 146 }} background="UIResource.Equip.Caestus">
              <EquipmentSlot slot={ItemType.Belt} item={character.items[character.locations[300 + ItemType.Belt]]} />
            </JPanel>
            <JPanel size={{ width: 55, height: 55 }} position={{ x: 4, y: 203 }} background="UIResource.Equip.Shoes">
              <EquipmentSlot slot={ItemType.Shoes} item={character.items[character.locations[300 + ItemType.Shoes]]} />
            </JPanel>
          </JPanel>

          <JPanel size={{ width: 199, height: 218 }} position={{ x: 67, y: 43 }} background="UIResource.Equip.Peoplebg">
            <JPanel size={{ width: 173, height: 159 }} position={{ x: 11, y: 21 }}></JPanel> {/* ability*/}
            <JPanel size={{ width: 168, height: 200 }} position={{ x: 14, y: 11 }}>
              <Avatar avatar={character.items[character.locations[300 + ItemType.Avatar]]} />
            </JPanel>{' '}
            {/* avatar*/}
            <JPanel size={{ width: 150, height: 150 }} position={{ x: 25, y: 47 }}></JPanel> {/* effect*/}
            {/* <JButton size={{ width: 45, height: 44 }} position={{ x: 4, y: 5 }} text="Btn_BloodAfter" disabled />{' '} */}
            {/* "WrapSimpleButtonByLink": "UIResource.Common.ProgressHelpButton2" */}
          </JPanel>

          <JPanel size={{ width: 164, height: 36 }} position={{ x: 85, y: 3 }} background="UIResource.Common.BigBG7">
            <JPanel size={{ width: 160, height: 32 }} position={{ x: 2, y: 2 }}>
              <CDNImage
                src={`titles/${stats.title ?? 0}.gif`}
                style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}
                alt={`Title ${stats.title ?? 0}`}
              />
            </JPanel>
          </JPanel>

          <JPanel size={{ width: 332, height: 260 }} position={{ x: 0, y: 264 }} background="UIResource.Common.BigBG1">
            <MultilineLabel size={{ width: 50, height: 20 }} position={{ x: 0, y: 6 }} text={'Str'} style={labelStyle} />
            <JTextField size={{ width: 100, height: 20 }} position={{ x: 50, y: 6 }} text={stats.str.toString()} />

            <MultilineLabel size={{ width: 50, height: 20 }} position={{ x: 150, y: 6 }} text={'Attack'} style={labelStyle} />
            <JTextField size={{ width: 100, height: 20 }} position={{ x: 200, y: 6 }} text={`${stats.minAttack} - ${stats.maxAttack}`} />

            <MultilineLabel size={{ width: 50, height: 20 }} position={{ x: 150, y: 30 }} text={'Block'} style={labelStyle} />
            <JTextField
              size={{ width: 100, height: 20 }}
              position={{ x: 200, y: 30 }}
              text={stats.parry.toString()}
              title={`+${(stats.parry / 16).toFixed(2)}% chance to reduce damage by 40%\nReduced by targets Pierce\nMax: 75%`}
            />

            <JPanel size={{ width: 298, height: 2 }} position={{ x: 10, y: 54 }} background="UIResource.Common.PartitionYellow" />

            <MultilineLabel size={{ width: 50, height: 20 }} position={{ x: 0, y: 61 }} text={'Agi'} style={labelStyle} />
            <JTextField size={{ width: 100, height: 20 }} position={{ x: 50, y: 61 }} text={stats.agi.toString()} />

            <MultilineLabel size={{ width: 50, height: 20 }} position={{ x: 150, y: 61 }} text={'Speed'} style={labelStyle} />
            <JTextField
              size={{ width: 100, height: 20 }}
              position={{ x: 200, y: 61 }}
              text={`${(stats.speed / 1000).toFixed(2)}`}
              title={`Flat value: ${stats.speed}. \nTake turn every ${(5 / (stats.speed / 1000)).toFixed(2)} seconds of combat.`}
            />

            <MultilineLabel size={{ width: 50, height: 20 }} position={{ x: 150, y: 86 }} text={'Dodge'} style={labelStyle} />
            <JTextField
              size={{ width: 100, height: 20 }}
              position={{ x: 200, y: 86 }}
              text={stats.dodge.toString()}
              title={`+${(stats.dodge / 16).toFixed(2)}% chance to avoid damage\nReduced by targets Hit\nMax: 50%`}
            />

            <JPanel size={{ width: 298, height: 2 }} position={{ x: 10, y: 110 }} background="UIResource.Common.PartitionYellow" />

            <MultilineLabel size={{ width: 50, height: 20 }} position={{ x: 0, y: 117 }} text={'Sta'} style={labelStyle} />
            <JTextField size={{ width: 100, height: 20 }} position={{ x: 50, y: 117 }} text={stats.sta.toString()} />

            <MultilineLabel size={{ width: 50, height: 20 }} position={{ x: 150, y: 117 }} text={'Hp'} style={labelStyle} />
            <JTextField size={{ width: 100, height: 20 }} position={{ x: 200, y: 117 }} text={stats.maxHp.toString()} />

            <MultilineLabel size={{ width: 50, height: 20 }} position={{ x: 150, y: 142 }} text={'Chakra'} style={labelStyle} />
            <JTextField size={{ width: 100, height: 20 }} position={{ x: 200, y: 142 }} text={stats.maxChakra.toString()} />

            <JPanel size={{ width: 298, height: 2 }} position={{ x: 10, y: 166 }} background="UIResource.Common.PartitionYellow" />

            <MultilineLabel
              size={{ width: 50, height: 20 }}
              position={{ x: 0, y: 173 }}
              text={'Pierce'}
              style={labelStyle}
              title="Reduces enemy block %"
            />
            <JTextField
              size={{ width: 100, height: 20 }}
              position={{ x: 50, y: 173 }}
              text={stats.pierce.toString()}
              title={`-${(stats.pierce / 16).toFixed(2)}% enemy block chance`}
            />

            <MultilineLabel
              size={{ width: 50, height: 20 }}
              position={{ x: 150, y: 173 }}
              text={'Hit'}
              style={labelStyle}
              title="Reduces enemy dodge"
            />
            <JTextField
              size={{ width: 100, height: 20 }}
              position={{ x: 200, y: 173 }}
              text={stats.hit.toString()}
              title={`-${(stats.hit / 16).toFixed(2)}% enemy chance to avoid damage`}
            />

            <MultilineLabel
              size={{ width: 50, height: 20 }}
              position={{ x: 0, y: 199 }}
              text={'Defense'}
              style={labelStyle}
              title="Reduces damage taken"
            />
            <JTextField
              size={{ width: 100, height: 20 }}
              position={{ x: 50, y: 199 }}
              text={stats.defense.toString()}
              title={`-${(stats.defense / (stats.defense + 1354)).toFixed(2)}% damage taken`}
            />

            <MultilineLabel
              size={{ width: 50, height: 20 }}
              position={{ x: 150, y: 199 }}
              text={'Break'}
              style={labelStyle}
              title="Reduces enemy defense. Can reduce below 0 for extra damage"
            />
            <JTextField
              size={{ width: 100, height: 20 }}
              position={{ x: 200, y: 199 }}
              text={stats.defenseBreak.toString()}
              title={`+${(stats.defenseBreak / (stats.defenseBreak + 1354)).toFixed(2)}% enemy damage taken`}
            />

            <MultilineLabel
              size={{ width: 50, height: 20 }}
              position={{ x: 0, y: 225 }}
              text={'Crit'}
              style={labelStyle}
              title="Increases crit % and crit damage"
            />
            <JTextField
              size={{ width: 100, height: 20 }}
              position={{ x: 50, y: 225 }}
              text={stats.critical.toString()}
              title={`+${(stats.critical / 16).toFixed(2)}% crit chance \n+${(stats.critical / 8).toFixed(2)}% crit damage`}
            />

            <MultilineLabel
              size={{ width: 50, height: 20 }}
              position={{ x: 150, y: 225 }}
              text={'Const'}
              style={labelStyle}
              title="Reduces enemy crit % and crit damage"
            />
            <JTextField
              size={{ width: 100, height: 20 }}
              position={{ x: 200, y: 225 }}
              text={stats.con.toString()}
              title={`-${(stats.con / 16).toFixed(2)}% enemy crit chance \n-${(stats.con / 8).toFixed(2)}% enemy crit damage`}
            />

            <Label position={{ x: 5, y: 240 }} style={labelStyle} text="Hover over stats to get detailed information." />
          </JPanel>

          <JPanel size={{ width: 0, height: 0 }} position={{ x: 2, y: 530 }}>
            {character.skills.map((id: number, idx: number) => (
              <div
                key={`view-character-skill-${id}-${idx}`}
                style={{ position: 'absolute', left: (idx % 11) * 30, top: Math.floor(idx / 11) * 30 }}>
                {id === null ? <CDNImage src="ui/UIResource/SkillTree/Lock4.png" /> : <SkillIcon id={id} />}
              </div>
            ))}
          </JPanel>
        </JPanel>
      </Panel>
    </CharacterContextProvider>
  );
}

const EquipmentSlot: React.FC<{ slot: ItemType; item?: IItem }> = ({ slot, item }) => {
  let style: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  };

  style = {
    ...style,
    pointerEvents: 'none',
    background: 'green',
    filter: 'opacity(50%)',
  };

  return <>{item && <Item item={item} style={{ top: 2, left: 2 }} onClick={() => {}} noBackground />}</>;
};

const Avatar: React.FC<{ avatar: IItem }> = ({ avatar }) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transformOrigin: 'left bottom',
    transform: 'scale(0.6) translateX(-50%)',
  };

  return <>{avatar && <CDNImage src={getAvatarPose(avatar)} style={style} />}</>;
};
