import * as React from 'react';
import { skillIcons } from '../../../resources/skills';
import { UserSkills } from '../../interfaces/Interfaces';
import { MultilineLabel } from '../../UI/MultilineLabel';
import EventEmitter from '../../../util/EventEmitter';
import useTranslator from '../../../hooks/translate';
import { SkillTooltip } from '../../Tooltips/SkillTooltip';
import useObjectTranslator from '../../../hooks/objectTranslate';
import JPanel from '../../UI/JPanel';
import { SkillIcon } from '../../SkillIcon/SkillIcon';
import { useTranslation } from 'react-i18next';
import { FightStat } from '../../../enums';
import { JImage } from '../../UI/JImage';
import { JScrollPane } from '../../UI/JScollPane';
import { CDNImage } from '../../Elements/Image';

export const ViewCharacters: React.FC<{ characters: any[] }> = ({ characters }) => {
  const [isExpanded, setExpanded] = React.useState(false);
  const [indexes, setIndexes] = React.useState([0, 1]);

  React.useEffect(() => {
    const id = EventEmitter.on('updateCharacters', ({ offense, defense }) => {
      setIndexes([offense, defense]);
    });

    return () => {
      EventEmitter.off(id);
    };
  }, []);

  return (
    <>
      {!isExpanded && (
        <>
          <CDNImage
            src="ui/combat/view_character.png"
            style={{ position: 'absolute', top: 245, left: 0, cursor: 'pointer' }}
            onClick={() => setExpanded(true)}
          />
          <MultilineLabel
            size={{ width: 12, height: 150 }}
            position={{ x: 9, y: 250 }}
            text="View Character"
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'upright',
              letterSpacing: -4,
              color: 'white',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
            title="Passive"
          />

          <CDNImage
            src="ui/combat/view_character.png"
            style={{ position: 'absolute', top: 245, right: 0, cursor: 'pointer' }}
            onClick={() => setExpanded(true)}
          />
          <MultilineLabel
            size={{ width: 12, height: 150 }}
            position={{ x: 981, y: 250 }}
            text="View Character"
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'upright',
              letterSpacing: -4,
              color: 'white',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
            title="Passive"
          />
        </>
      )}

      <StatInfo character={characters[indexes[0]]} onClick={() => setExpanded(false)} expanded={isExpanded} />
      <StatInfo character={characters[indexes[1]]} onClick={() => setExpanded(false)} expanded={isExpanded} flipped={true} />
    </>
  );
};

const StatInfo: React.FC<{ character: any; onClick: () => void; expanded: boolean; flipped?: boolean }> = ({
  character,
  onClick,
  expanded,
  flipped = false,
}) => {
  const t = useTranslator();
  const { i18n } = useTranslation();
  const flip = flipped ? { right: -1 } : { left: 0 };
  const imageFlip = flipped ? { transform: 'scaleX(-1)' } : {};
  const [hp, setHp] = React.useState(character.hp);
  const [mana, setMana] = React.useState(character.mp);
  const [shield, setShield] = React.useState(0);
  const [speed, setSpeed] = React.useState(character.speed / 1000);

  React.useEffect(() => {
    const id = EventEmitter.on('combatStatUpdate', (data) => {
      if (data.index === character.index) {
        if (data.stat === 'hp') {
          setHp(data.value);
        } else if (data.stat === 'mp') {
          setMana(data.value);
        } else if (data.stat === FightStat.SHIELD) {
          setShield(data.value);
        } else if (data.stat === FightStat.SPEED) {
          setSpeed(500 / data.value);
        }
      }
    });

    setHp(character.hp);
    setMana(character.mp);

    return () => {
      EventEmitter.off(id);
    };
  }, [character]);

  const name = i18n.exists(`monster__${character.id}--name`) ? t(`monster__${character.id}--name`) : character.displayName ?? character.id;

  return (
    <div
      style={{ position: 'absolute', top: 145, height: 413, width: 165, display: expanded ? 'initial' : 'none', ...flip }}
      onClick={onClick}>
      <CDNImage src="ui/combat/stats.png" style={{ position: 'absolute', top: 0, ...imageFlip }} />

      <div style={{ position: 'absolute', top: 15, left: flipped ? 15 : 5 }}>
        <div className="fight__stat-row">
          <div className="fight__stat-column">{name}</div>
          <div className="fight__stat-column">LV: {character.level}</div>
        </div>
        <div className="fight__stat-row">
          {character.avatar < 500 && <div className="fight__stat-column --single">{t(`item__${290000 + character.avatar}--name`)}</div>}
        </div>
      </div>

      <div style={{ position: 'absolute', top: 55, left: 0 }}>
        <div className="fight__stat-row fight-text--red">
          <div className="fight__stat-column --single">
            <div className="fight__stat-label">Hp:</div>
            <div className="fight__stat-value">
              {hp} / {character.maxHp}
            </div>
          </div>
        </div>

        <div className="fight__stat-row fight-text--blue">
          <div className="fight__stat-column --single">
            <div className="fight__stat-label">Chakra:</div>
            <div className="fight__stat-value">
              {mana} / {character.maxMp}
            </div>
          </div>
        </div>

        <div className="fight__stat-row">
          <div className="fight__stat-column --single">
            <div className="fight__stat-label">Shield:</div>
            <div className="fight__stat-value">{shield}</div>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', top: 105, left: 0 }}>
        <div className="fight__stat-row">
          <div className="fight__stat-column --single">
            <div className="fight__stat-label">Attack:</div>
            <div className="fight__stat-value">
              {character.minAttack} - {character.maxAttack}
            </div>
          </div>
        </div>

        <div className="fight__stat-row">
          <div className="fight__stat-column --single">
            <div className="fight__stat-label">Speed:</div>
            <div className="fight__stat-value">{speed.toFixed(2)}</div>
          </div>
        </div>

        <div className="fight__stat-row">
          <div className="fight__stat-column">
            <div className="fight__stat-label">Break:</div>
            <div className="fight__stat-value">{character.defenseBreak}</div>
          </div>
          <div className="fight__stat-column">
            <div className="fight__stat-label">Def:</div>
            <div className="fight__stat-value">{character.defense}</div>
          </div>
        </div>

        <div className="fight__stat-row">
          <div className="fight__stat-column">
            <div className="fight__stat-label">Pierce:</div>
            <div className="fight__stat-value">{character.pierce}</div>
          </div>
          <div className="fight__stat-column">
            <div className="fight__stat-label">Block:</div>
            <div className="fight__stat-value">{character.parry}</div>
          </div>
        </div>

        <div className="fight__stat-row">
          <div className="fight__stat-column">
            <div className="fight__stat-label">Hit:</div>
            <div className="fight__stat-value">{character.hit}</div>
          </div>
          <div className="fight__stat-column">
            <div className="fight__stat-label">Dodge:</div>
            <div className="fight__stat-value">{character.dodge}</div>
          </div>
        </div>

        <div className="fight__stat-row">
          <div className="fight__stat-column">
            <div className="fight__stat-label">Crit:</div>
            <div className="fight__stat-value">{character.critical}</div>
          </div>
          <div className="fight__stat-column">
            <div className="fight__stat-label">Con:</div>
            <div className="fight__stat-value">{character.con}</div>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', top: 244, left: flipped ? 15 : 5 }}>
        <JImage position={{ x: 0 }} src="ui/combat/pet_icon.png" />
        {character.pet && <JImage position={{ x: 0 }} src={`icons/items/pets/${character.pet}.png`} />}

        <JScrollPane size={{ width: 100, height: 85 }} position={{ x: 60, y: -22 }} hidden>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, idx: number) => (
            <JPanel
              key={`lock-${name}-${idx}`}
              size={{ width: 0, height: 0 }}
              position={{ x: (idx % 3) * 30, y: Math.floor(idx / 3) * 30 }}>
              <CDNImage src="ui/UIResource/SkillTree/Lock4.png" style={{ position: 'absolute', left: -1, top: -1 }} />
            </JPanel>
          ))}

          {character.petSkills?.map((id: UserSkills, idx: number) => (
            <JPanel
              key={`skill-icon-${name}-${idx}`}
              size={{ width: 0, height: 0 }}
              position={{ x: (idx % 3) * 30, y: Math.floor(idx / 3) * 30 }}>
              <SkillIcon key={id + '-' + idx} id={id} />
            </JPanel>
          ))}
        </JScrollPane>
      </div>

      <div style={{ position: 'absolute', top: 315, left: flipped ? 15 : 5 }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((_, idx: number) => (
          <JPanel key={`lock-${name}-${idx}`} size={{ width: 0, height: 0 }} position={{ x: (idx % 5) * 30, y: Math.floor(idx / 5) * 30 }}>
            <CDNImage src="ui/UIResource/SkillTree/Lock4.png" style={{ position: 'absolute', left: -1, top: -1 }} />
          </JPanel>
        ))}
        {character.skills
          .filter((id: number) => !(character.petSkills ?? []).includes(id))
          .map((id: UserSkills, idx: number) => (
            <JPanel
              key={`skill-icon-${name}-${idx}`}
              size={{ width: 0, height: 0 }}
              position={{ x: (idx % 5) * 30, y: Math.floor(idx / 5) * 30 }}>
              <SkillIcon key={id + '-' + idx} id={id} />
            </JPanel>
          ))}
      </div>
    </div>
  );
};
