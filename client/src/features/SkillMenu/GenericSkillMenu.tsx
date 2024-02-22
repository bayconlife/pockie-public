import * as React from 'react';
import { UserSkills } from '../../components/interfaces/Interfaces';
import JPanel from '../../components/UI/JPanel';
import { getInfo } from '../../resources/skillInfo';
import { SkillIcon as Skill } from '../../components/SkillIcon/SkillIcon';
import { JTextField } from '../../components/UI/JTextField';
import { CDNImage } from '../../components/Elements/Image';

const LevelDisplay: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  return (
    <JPanel size={{ width: 26, height: 12 }} position={{ x, y }} background="UIResource.SkillTree.TextBG">
      <div style={{ color: 'white', fontSize: 10, textAlign: 'center' }}></div>
    </JPanel>
  );
};

const SkillIcon: React.FC<{
  x: number;
  y: number;
  style: any;
  skill?: number | null;
  onClick?: Function;
}> = ({ x, y, style, skill, onClick }) => {
  const text = getInfo(skill || UserSkills.BASIC_ATTACK, 1);

  if (!!skill) {
    text.push(skill.toString());
  }

  return (
    <>
      <JPanel size={{ width: 30, height: 30 }} position={{ x, y }}>
        <JPanel size={{ width: 26, height: 26 }} position={{ x: 2, y: 2 }} background="UIResource.Icon.Grid_YellowBSD">
          {!!skill && (
            <Skill
              id={skill!}
              style={{ marginLeft: 1, marginTop: 1, ...style }}
              onClick={() => {
                onClick?.(skill);
              }}
            />
          )}
        </JPanel>
      </JPanel>
    </>
  );
};

const EquippedSkillIcon: React.FC<{ x: number; y: number; skill?: number | null; onClick?: Function }> = ({ x, y, skill, onClick }) => {
  let style: any = { top: 1, left: 1, cursor: 'pointer' };

  return <SkillIcon x={x} y={y} style={style} skill={skill} onClick={onClick} />;
};

const SelectSkillIcon: React.FC<{
  x: number;
  y: number;
  equippedSkills?: (number | null)[];
  skill?: number | null;
  onClick?: Function;
}> = ({ x, y, skill, onClick, equippedSkills }) => {
  const equipped = equippedSkills?.find((s) => s === skill);

  let style: any = { top: 1, left: 1, cursor: 'pointer' };

  if (equipped) {
    style = { ...style, filter: 'brightness(0.5)' };
  }

  if (onClick == undefined) {
    style.cursor = 'default';
  }

  return <SkillIcon x={x} y={y} style={style} skill={skill} onClick={equipped ? () => {} : onClick} />;
};

const EquippedSkillDisplay: React.FC<{ x: number; y: number; skill?: number | null; onClick?: Function }> = ({ x, y, skill, onClick }) => {
  return (
    <>
      <EquippedSkillIcon x={x} y={y} skill={skill} onClick={onClick} />
      <LevelDisplay x={x + 2} y={y + 31} />
    </>
  );
};

const LockedSkillDisplay: React.FC<{ x: number; y: number; slot: number; onClick?: Function }> = ({ x, y, slot, onClick }) => {
  return (
    <>
      <CDNImage src="ui/UIResource/SkillTree/Lock4.png" style={{ position: 'absolute', left: x + 2, top: y + 2 }} />
      <LevelDisplay x={x + 2} y={y + 31} />
    </>
  );
};

const SkillDisplay: React.FC<{ x: number; y: number; equippedSkills?: (number | null)[]; skill?: UserSkills; onClick?: Function }> = ({
  x,
  y,
  skill,
  onClick,
  equippedSkills,
}) => {
  return (
    <>
      <SelectSkillIcon x={x} y={y} skill={skill} onClick={onClick} equippedSkills={equippedSkills} />
      <LevelDisplay x={x + 2} y={y + 31} />
    </>
  );
};

const ActiveSkillList: React.FC<{ x: number; equippedSkills: (number | null)[]; skills?: UserSkills[]; onClick?: Function }> = ({
  x,
  skills,
  onClick,
  equippedSkills,
}) => {
  return (
    <JPanel size={{ width: 37, height: 201 }} position={{ x, y: 105 }} background="UIResource.SkillTree.BG">
      <SkillDisplay x={2} y={5} skill={skills ? skills[0] : undefined} onClick={onClick} equippedSkills={equippedSkills} />
      <SkillDisplay x={2} y={53} skill={skills ? skills[1] : undefined} onClick={onClick} equippedSkills={equippedSkills} />
      <SkillDisplay x={2} y={101} skill={skills ? skills[2] : undefined} onClick={onClick} equippedSkills={equippedSkills} />
      <SkillDisplay x={2} y={149} skill={skills ? skills[3] : undefined} onClick={onClick} equippedSkills={equippedSkills} />
    </JPanel>
  );
};

const PassiveSkill: React.FC<{ x: number; id: number }> = ({ x, id }) => {
  return (
    <JPanel size={{ width: 37, height: 48 }} position={{ x, y: 30 }} background="UIResource.SkillTree.BG">
      <SkillDisplay x={2} y={1} skill={id} />
    </JPanel>
  );
};

interface Props {
  equipped: (number | null)[];
  onEquip: (skills: (number | null)[]) => void;
  onUnequip: (skills: (number | null)[]) => void;
}

export function GenericSkillMenu({ equipped, onEquip, onUnequip }: Props) {
  const [equippedSkills, setEquippedSkills] = React.useState(() => {
    const skills = equipped;

    while (skills.length < 6) {
      skills.push(null);
    }

    return skills;
  });

  function _onEquip(id: number) {
    const newSkills = [...equippedSkills];

    for (let i = 0; i < newSkills.length; i++) {
      if (newSkills[i] === null) {
        newSkills[i] = id;
        break;
      }
    }

    onEquip(newSkills);
    setEquippedSkills(newSkills);
  }

  function _onUnequip(id: number) {
    const newSkills = [...equippedSkills];

    for (let i = 0; i < newSkills.length; i++) {
      if (newSkills[i] === id) {
        newSkills[i] = null;
        break;
      }
    }

    onUnequip(newSkills);
    setEquippedSkills(newSkills);
  }

  return (
    <JPanel>
      <JPanel size={{ width: 446, height: 311 }} background="UIResource.Common.BigBG1">
        <JTextField
          size={{ width: 104, height: 20 }}
          position={{ x: 223 - 50, y: 6 }}
          text="Passive"
          title="Passive skills are automatically equipped when obtained."
        />
        {Array(10)
          .fill(null)
          .map((_, idx) => (
            <PassiveSkill key={`passive-${idx}`} x={7 + 44 * idx} id={2800 + idx} />
          ))}

        <JTextField size={{ width: 104, height: 20 }} position={{ x: 223 - 50, y: 83 }} text="Active" />
        <ActiveSkillList
          x={7}
          skills={[UserSkills.FIREBALL, UserSkills.BALSAM, UserSkills.BLOODBOIL, UserSkills.SUNSET]}
          onClick={_onEquip}
          equippedSkills={equippedSkills}
        />
        <ActiveSkillList
          x={51}
          skills={[UserSkills.MIST, UserSkills.GIANT_WATERFALL, UserSkills.CRYSTAL_BLADE, UserSkills.PRAYER]}
          onClick={_onEquip}
          equippedSkills={equippedSkills}
        />
        <ActiveSkillList
          x={95}
          skills={[UserSkills.GREAT_MUD_RIVER, UserSkills.DETONATING_CLAY, UserSkills.EARTH_PRISON, UserSkills.MUD_WALL]}
          onClick={_onEquip}
          equippedSkills={equippedSkills}
        />
        <ActiveSkillList
          x={139}
          skills={[UserSkills.THUNDERFALL, UserSkills.CHIDORI, UserSkills.STATIC_FIELD, UserSkills.FLYING_THUNDER_GOD]}
          onClick={_onEquip}
          equippedSkills={equippedSkills}
        />
        <ActiveSkillList
          x={183}
          skills={[UserSkills.QUICKSTEP, UserSkills.WINDSTORM_ARRAY, UserSkills.GALE_PALM, UserSkills.RASENGAN]}
          onClick={_onEquip}
          equippedSkills={equippedSkills}
        />
        <ActiveSkillList
          x={227}
          skills={[UserSkills.LOTUS, UserSkills.GREAT_STRENGTH, UserSkills.EIGHT_TRIGRAM_PALM, UserSkills.THE_EIGHT_INNER_GATES_RELEASED]}
          onClick={_onEquip}
          equippedSkills={equippedSkills}
        />
        <ActiveSkillList
          x={271}
          skills={[UserSkills.PUPPET, UserSkills.BOMB, UserSkills.LIQUOR, UserSkills.SNARED]}
          onClick={_onEquip}
          equippedSkills={equippedSkills}
        />
        <ActiveSkillList
          x={315}
          skills={[
            UserSkills.TAILED_BEAST_HEART,
            UserSkills.CURSED_SEAL_OF_HEAVEN,
            UserSkills.FIVE_ELEMENTAL_SEAL,
            UserSkills.DEAD_DEMON_CONSUMING_SEAL,
          ]}
          onClick={_onEquip}
          equippedSkills={equippedSkills}
        />
        <ActiveSkillList
          x={359}
          skills={[UserSkills.ASSASSINATE, UserSkills.SUBSTITUTE, UserSkills.SEXY_TECHNIQUE, UserSkills.DEATH_MIRAGE_JUTSU]}
          onClick={_onEquip}
          equippedSkills={equippedSkills}
        />
        <ActiveSkillList
          x={403}
          skills={[UserSkills.MYSTICAL_PALM_TECHNIQUE, UserSkills.PRE_HEALING_JUTSU, UserSkills.CHAKRA_BLADE, UserSkills.CREATION_REBIRTH]}
          onClick={_onEquip}
          equippedSkills={equippedSkills}
        />
      </JPanel>

      <JPanel size={{ width: 446, height: 85 }} background="UIResource.Common.BigBG1">
        <JTextField size={{ width: 104, height: 20 }} position={{ x: 223 - 50, y: 6 }} text="Equipped" />
        <JPanel size={{ width: 396, height: 50 }} position={{ x: 25, y: 30 }} background="UIResource.SkillTree.BG">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((idx) => {
            if (idx >= 6) {
              return <LockedSkillDisplay key={idx} x={14 + idx * 38} y={2} slot={idx} onClick={() => {}} />;
            }

            return <EquippedSkillDisplay key={idx} x={14 + idx * 38} y={2} skill={equippedSkills[idx]} onClick={_onUnequip} />;
          })}
        </JPanel>
      </JPanel>
    </JPanel>
  );
}
