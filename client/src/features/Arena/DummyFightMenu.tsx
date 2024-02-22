import { useEffect, useState } from 'react';
import Panel from '../../components/Panel/Panel';
import JPanel from '../../components/UI/JPanel';
import { GenericSkillMenu } from '../SkillMenu/GenericSkillMenu';
import { JLayout } from '../../components/UI/JLayout';
import { JButton } from '../../components/UI/JButton';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { FightState, setFightState } from '../../slices/fightSlice';
import { toServer } from '../../util/ServerSocket';

export function DummyFightMenu({ onClose }: { onClose: () => void }) {
  const dispatch = useAppDispatch();
  const fightState = useAppSelector((state) => state.fight.state);
  const [skills, setSkills] = useState<(number | null)[]>(JSON.parse(localStorage.getItem('dummy-skills') ?? '[]'));
  const [stats, setStats] = useState({
    hp: 600,
    chakra: 600,
    speed: 1000,
    minAttack: 10,
    maxAttack: 20,
    parry: 0,
    pierce: 0,
    dodge: 0,
    hit: 0,
    defense: 0,
    defenseBreak: 0,
    break: 0,
    critical: 0,
    con: 0,
    ...JSON.parse(localStorage.getItem('dummy-stats') ?? JSON.stringify({})),
  });

  useEffect(() => {
    localStorage.setItem('dummy-skills', JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem('dummy-stats', JSON.stringify(stats));
  }, [stats]);

  return (
    <Panel name="Dummy Fight Setup" onClose={onClose}>
      <JLayout horizontal>
        <JPanel size={{ width: 446, height: 396 }}>
          <GenericSkillMenu onEquip={setSkills} onUnequip={setSkills} equipped={skills} />
        </JPanel>

        <JPanel size={{ width: 200, height: 396 }} background="UIResource.Common.BigBG1" padding={4}>
          Hp:
          <input type="number" min={1} max={6000} value={stats.hp} onChange={(e) => setStats({ ...stats, hp: Number(e.target.value) })} />
          <br />
          Chakra:
          <input
            type="number"
            min={1}
            max={6000}
            value={stats.chakra}
            onChange={(e) => setStats({ ...stats, chakra: Number(e.target.value) })}
          />
          <br />
          Speed:
          <input
            type="number"
            min={500}
            max={3000}
            value={stats.speed}
            onChange={(e) => setStats({ ...stats, speed: Number(e.target.value) })}
          />
          <br />
          Min Attack:
          <input
            type="number"
            min={0}
            max={stats.maxAttack}
            value={stats.minAttack}
            onChange={(e) => setStats({ ...stats, minAttack: Number(e.target.value) })}
          />
          <br />
          Max Attack:
          <input
            type="number"
            min={0}
            max={500}
            value={stats.maxAttack}
            onChange={(e) => setStats({ ...stats, maxAttack: Number(e.target.value) })}
          />
          <br />
          Block:
          <input
            type="number"
            min={0}
            max={1500}
            value={stats.parry}
            onChange={(e) => setStats({ ...stats, parry: Number(e.target.value) })}
          />
          <br />
          Pierce:
          <input
            type="number"
            min={0}
            max={1500}
            value={stats.pierce}
            onChange={(e) => setStats({ ...stats, pierce: Number(e.target.value) })}
          />
          <br />
          Dodge:
          <input
            type="number"
            min={0}
            max={1500}
            value={stats.dodge}
            onChange={(e) => setStats({ ...stats, dodge: Number(e.target.value) })}
          />
          <br />
          Hit:
          <input type="number" min={1} max={1500} value={stats.hit} onChange={(e) => setStats({ ...stats, hit: Number(e.target.value) })} />
          <br />
          Defense:
          <input
            type="number"
            min={0}
            max={1500}
            value={stats.defense}
            onChange={(e) => setStats({ ...stats, defense: Number(e.target.value) })}
          />
          <br />
          Break:
          <input
            type="number"
            min={0}
            max={1500}
            value={stats.defenseBreak}
            onChange={(e) => setStats({ ...stats, defenseBreak: Number(e.target.value) })}
          />
          <br />
          Crit:
          <input
            type="number"
            min={0}
            max={1500}
            value={stats.critical}
            onChange={(e) => setStats({ ...stats, critical: Number(e.target.value) })}
          />
          <br />
          Const:
          <input type="number" min={0} max={1500} value={stats.con} onChange={(e) => setStats({ ...stats, con: Number(e.target.value) })} />
        </JPanel>
      </JLayout>
      <JButton
        text="Fight"
        onClick={() => {
          dispatch(setFightState(FightState.LOADING));
          toServer('dummyFight', { stats, skills });
        }}
        disabled={fightState !== FightState.FINISHED}
      />
    </Panel>
  );
}
