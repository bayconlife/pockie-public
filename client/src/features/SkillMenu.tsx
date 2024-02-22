import * as React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setEquippedSkills, showSkills } from '../slices/skillsSlice';
import { UserSkills } from '../components/interfaces/Interfaces';
import Panel from '../components/Panel/Panel';
import JPanel from '../components/UI/JPanel';
import { getInfo } from '../resources/skillInfo';
import { JButton } from '../components/UI/JButton';
import { SkillIcon as Skill } from '../components/SkillIcon/SkillIcon';
import { JTextField } from '../components/UI/JTextField';
import { CDNImage } from '../components/Elements/Image';
import { toServer } from '../util/ServerSocket';

const LevelDisplay: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  return (
    <JPanel size={{ width: 26, height: 12 }} position={{ x, y }} background="UIResource.SkillTree.TextBG">
      <div style={{ color: 'white', fontSize: 10, textAlign: 'center' }}></div>
    </JPanel>
  );
};

const SkillIcon: React.FC<{ x: number; y: number; style: any; skill?: UserSkills; onClick?: Function }> = ({
  x,
  y,
  style,
  skill,
  onClick,
}) => {
  const skillsKnown = useAppSelector((state) => state.skills.known);

  const info = skillsKnown.find((i) => i.id === skill);
  const text = getInfo(skill || UserSkills.BASIC_ATTACK, 1);

  if (!!skill) {
    text.push(skill.toString());
  }

  if (info === undefined) {
    style = {
      ...style,
      filter: 'grayscale(100%)',
    };
  }

  return (
    <>
      <JPanel size={{ width: 30, height: 30 }} position={{ x, y }}>
        <JPanel size={{ width: 26, height: 26 }} position={{ x: 2, y: 2 }} background="UIResource.Icon.Grid_YellowBSD">
          {skill !== null && (
            <Skill
              id={skill!}
              style={{ marginLeft: 1, marginTop: 1, ...style }}
              onClick={() => {
                if (info === undefined) {
                  return;
                }
                onClick?.(skill);
              }}
            />
          )}
        </JPanel>
      </JPanel>
    </>
  );
};

const EquippedSkillIcon: React.FC<{ x: number; y: number; skill?: UserSkills; onClick?: Function }> = ({ x, y, skill, onClick }) => {
  let style: any = { top: 1, left: 1, cursor: 'pointer' };

  return <SkillIcon x={x} y={y} style={style} skill={skill} onClick={onClick} />;
};

const SelectSkillIcon: React.FC<{ x: number; y: number; skill?: UserSkills; onClick?: Function }> = ({ x, y, skill, onClick }) => {
  const skillsEquipped = useAppSelector((state) => state.skills.equipped);
  const equipped = skillsEquipped.includes(skill);

  let style: any = { top: 1, left: 1, cursor: 'pointer' };

  if (equipped) {
    style = { ...style, filter: 'brightness(0.5)' };
  }

  if (onClick == undefined) {
    style.cursor = 'default';
  }

  return <SkillIcon x={x} y={y} style={style} skill={skill} onClick={equipped ? () => {} : onClick} />;
};

const EquippedSkillDisplay: React.FC<{ x: number; y: number; skill?: UserSkills; onClick?: Function }> = ({ x, y, skill, onClick }) => {
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

const SkillDisplay: React.FC<{ x: number; y: number; skill?: UserSkills; onClick?: Function }> = ({ x, y, skill, onClick }) => {
  return (
    <>
      <SelectSkillIcon x={x} y={y} skill={skill} onClick={onClick} />
      <LevelDisplay x={x + 2} y={y + 31} />
    </>
  );
};

const ActiveSkillList: React.FC<{ x: number; skills?: UserSkills[]; onClick?: Function }> = ({ x, skills, onClick }) => {
  return (
    <JPanel size={{ width: 37, height: 201 }} position={{ x, y: 105 }} background="UIResource.SkillTree.BG">
      <SkillDisplay x={2} y={5} skill={skills ? skills[0] : undefined} onClick={onClick} />
      <SkillDisplay x={2} y={53} skill={skills ? skills[1] : undefined} onClick={onClick} />
      <SkillDisplay x={2} y={101} skill={skills ? skills[2] : undefined} onClick={onClick} />
      <SkillDisplay x={2} y={149} skill={skills ? skills[3] : undefined} onClick={onClick} />
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

const SkillMenu: React.FC<{}> = () => {
  const dispatch = useAppDispatch();
  const show = useAppSelector((state) => state.skills.show);
  const equipped = useAppSelector((state) => state.skills.equipped);
  const [showInfo, setShowInfo] = React.useState(false);

  const equipSkill = React.useCallback(
    (id: number) => {
      const slot = equipped.findIndex((id) => id === null);

      if (slot === -1 || slot >= 6) return;

      toServer('setSkill', { slot, id }, () => {
        const newEquippedSkills = [...equipped];
        newEquippedSkills[slot] = id;
        dispatch(setEquippedSkills(newEquippedSkills));
      });
    },
    [equipped]
  );

  const unequipSkill = React.useCallback(
    (id: number) => {
      const slot = equipped.findIndex((_id) => _id === id);

      if (slot === -1) return;

      toServer('removeSkill', { slot }, () => {
        const newEquippedSkills = [...equipped];
        newEquippedSkills[slot] = null;
        dispatch(setEquippedSkills(newEquippedSkills));
      });
    },
    [equipped]
  );

  const resetSkills = React.useCallback(() => {
    toServer('resetSkills');
    dispatch(setEquippedSkills([]));
  }, []);

  if (!show) return <></>;

  return (
    <>
      <Panel name="Skills" onClose={() => dispatch(showSkills(false))}>
        <JPanel size={{ width: 446, height: 311 }} background="UIResource.Common.BigBG1">
          <JButton size={{ width: 50, height: 20 }} position={{ x: 4, y: 6 }} text="Info" onClick={() => setShowInfo(!showInfo)} />
          <JButton size={{ width: 100, height: 20 }} position={{ x: 341, y: 6 }} text="Unlock All" onClick={resetSkills} />

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
            onClick={equipSkill}
          />
          <ActiveSkillList
            x={51}
            skills={[UserSkills.MIST, UserSkills.GIANT_WATERFALL, UserSkills.CRYSTAL_BLADE, UserSkills.PRAYER]}
            onClick={equipSkill}
          />
          <ActiveSkillList
            x={95}
            skills={[UserSkills.GREAT_MUD_RIVER, UserSkills.DETONATING_CLAY, UserSkills.EARTH_PRISON, UserSkills.MUD_WALL]}
            onClick={equipSkill}
          />
          <ActiveSkillList
            x={139}
            skills={[UserSkills.THUNDERFALL, UserSkills.CHIDORI, UserSkills.STATIC_FIELD, UserSkills.FLYING_THUNDER_GOD]}
            onClick={equipSkill}
          />
          <ActiveSkillList
            x={183}
            skills={[UserSkills.QUICKSTEP, UserSkills.WINDSTORM_ARRAY, UserSkills.GALE_PALM, UserSkills.RASENGAN]}
            onClick={equipSkill}
          />
          <ActiveSkillList
            x={227}
            skills={[UserSkills.LOTUS, UserSkills.GREAT_STRENGTH, UserSkills.EIGHT_TRIGRAM_PALM, UserSkills.THE_EIGHT_INNER_GATES_RELEASED]}
            onClick={equipSkill}
          />
          <ActiveSkillList
            x={271}
            skills={[UserSkills.PUPPET, UserSkills.BOMB, UserSkills.LIQUOR, UserSkills.SNARED]}
            onClick={equipSkill}
          />
          <ActiveSkillList
            x={315}
            skills={[
              UserSkills.TAILED_BEAST_HEART,
              UserSkills.CURSED_SEAL_OF_HEAVEN,
              UserSkills.FIVE_ELEMENTAL_SEAL,
              UserSkills.DEAD_DEMON_CONSUMING_SEAL,
            ]}
            onClick={equipSkill}
          />
          <ActiveSkillList
            x={359}
            skills={[UserSkills.ASSASSINATE, UserSkills.SUBSTITUTE, UserSkills.SEXY_TECHNIQUE, UserSkills.DEATH_MIRAGE_JUTSU]}
            onClick={equipSkill}
          />
          <ActiveSkillList
            x={403}
            skills={[
              UserSkills.MYSTICAL_PALM_TECHNIQUE,
              UserSkills.PRE_HEALING_JUTSU,
              UserSkills.CHAKRA_BLADE,
              UserSkills.CREATION_REBIRTH,
            ]}
            onClick={equipSkill}
          />
        </JPanel>

        <JPanel size={{ width: 446, height: 85 }} background="UIResource.Common.BigBG1">
          <JTextField size={{ width: 104, height: 20 }} position={{ x: 223 - 50, y: 6 }} text="Equipped" />
          <JPanel size={{ width: 396, height: 50 }} position={{ x: 25, y: 30 }} background="UIResource.SkillTree.BG">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((idx) => {
              if (idx >= 6) {
                return <LockedSkillDisplay key={idx} x={14 + idx * 38} y={2} slot={idx} onClick={unequipSkill} />;
              }

              return <EquippedSkillDisplay key={idx} x={14 + idx * 38} y={2} skill={equipped[idx]} onClick={unequipSkill} />;
            })}
          </JPanel>
        </JPanel>
      </Panel>

      {showInfo && <SkillInfo onClose={() => setShowInfo(false)} />}
    </>
  );
};

function SkillInfo({ onClose }: { onClose: () => void }) {
  return (
    <Panel name="Skill Activation Order" onClose={onClose}>
      <JPanel size={{ width: 446, height: 385 }} background="UIResource.Common.BigBG1" padding={4}>
        <div>
          <b>Turn Order:</b>
          <br />1 - Activate Effects
          <br />2 - If you cannot move (Dizzy, Frozen) then end Turn
          <br />3 - Trigger "Before Enemy Moves"
          <br />4 - Trigger "Before Attack"
          <br />5 - Trigger "Your Attack"
          <br />6 - Trigger "After Death"
          <br />7 - Trigger "Additional Attack"
          <br />8 - Trigger "Pet Attack"
          <br />9 - Trigger "Under Melee Attack"
          <br />
          <br />
          <b>Skill Damage & Effect Order:</b>
          <br />1 - Take Damage
          <br />2 - Trigger "After Taking Damage" Skills
          <br />3 - Apply Effects
          <br />
          <br />
          <b>"Your Attack" Skill Cast Chance:</b>
          <div>
            If you have a combined total of over 100% cast chance on "Your Attack" skills then you will be guaranteed to cast one (assuming
            you have enough chakra/aren't blocked) instead of basic attacking.
          </div>
        </div>
      </JPanel>
    </Panel>
  );
}

export default SkillMenu;
