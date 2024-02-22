import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { SERVER_CONFIG } from '../../../util/serverConfig';
import { Label } from '../../../components/UI/Label';
import JPanel from '../../../components/UI/JPanel';
import { Limit } from './Limit';
import { JButton } from '../../../components/UI/JButton';
import { toServer } from '../../../util/ServerSocket';
import { activateBloodline, deactivateBloodline } from '../../../slices/characterSlice';

export function SelectedLimit({ limit }: { limit: number | null }) {
  const dispatch = useAppDispatch();
  const activeLimits = useAppSelector((state) => state.character.bloodlines.active);
  const limitData = useAppSelector((state) => state.character.bloodlines.limits[limit ?? -1]);
  const [loading, setLoading] = useState(false);

  const stats = {
    str: 0,
    agi: 0,
    sta: 0,
    block: 0,
    pierce: 0,
    def: 0,
    crit: 0,
    min_attack: 0,
    max_attack: 0,
    speed: 0,
    dodge: 0,
    hp: 0,
    hit: 0,
    break: 0,
    const: 0,
    chakra: 0,
  };

  const data = limit && SERVER_CONFIG.BLOODLINE.Limits[limit];
  const isActive = !!limit && activeLimits.includes(limit);

  if (data) {
    stats.str += data.stats[0];
    stats.agi += data.stats[1];
    stats.sta += data.stats[2];
  }

  if (!!limitData) {
    const serverSoulData = SERVER_CONFIG.BLOODLINE.Souls;
    const statMap = {
      1: 'def',
      2: 'break',
      3: 'dodge',
      4: 'hit',
      5: 'crit',
      6: 'const',
      7: 'hp',
      8: 'chakra',
      9: 'pierce',
      10: 'block',
      11: 'min_attack',
      12: 'max_attack',
      13: 'speed',
    };
    limitData.souls.forEach((soul) => {
      //@ts-ignore
      console.log(statMap[soul.id], soul);
      //@ts-ignore
      stats[statMap[soul.id]] += serverSoulData[soul.id]?.levels[soul.level] ?? 0;
    });
  }

  return (
    <>
      <Label y={0} className="bold sm center" text="Selected" />
      <JPanel x={0} y={15} size={{ width: 50, height: 50 }} background="UIResource.Common.BigBG5" padding={2}>
        {limit && <Limit id={limit} />}
      </JPanel>
      <JButton
        x={70}
        y={28}
        text={isActive ? 'Deactivate' : 'Activate'}
        disabled={!limit || (!isActive && !activeLimits.includes(null))}
        loading={loading}
        onClick={() => {
          if (!limit || (!isActive && !activeLimits.includes(null))) {
            return;
          }

          setLoading(true);
          if (isActive) {
            toServer('bloodlineDeactivate', limit, () => {
              dispatch(deactivateBloodline(limit));
              setLoading(false);
            });
          } else {
            toServer('bloodlineActivate', limit, () => {
              dispatch(activateBloodline(limit));
              setLoading(false);
            });
          }
        }}
      />

      <JPanel size={{ width: 185, height: 2 }} position={{ x: 10, y: 70 }} background="UIResource.Common.PartitionYellow" />

      <JPanel y={80}>
        <StatLine y={0} label={'Str'} value={stats.str} />
        <StatLine y={25} label={'Agi'} value={stats.agi} />
        <StatLine y={50} label={'Sta'} value={stats.sta} />
        <StatLine y={75} label={'Block'} value={stats.block} />
        <StatLine y={100} label={'Pierce'} value={stats.pierce} />
        <StatLine y={125} label={'Def'} value={stats.def} />
        <StatLine y={150} label={'Crit'} value={stats.crit} />

        <JPanel x={114}>
          <StatLine y={0} label={'Attack'} value={`${stats.min_attack}-${stats.max_attack}`} />
          <StatLine y={25} label={'Speed'} value={(stats.speed / 10).toFixed(2)} />
          <StatLine y={50} label={'Dodge'} value={stats.dodge} />
          <StatLine y={75} label={'Hp'} value={stats.hp} />
          <StatLine y={100} label={'Hit'} value={stats.hit} />
          <StatLine y={125} label={'Break'} value={stats.break} />
          <StatLine y={150} label={'Const'} value={stats.const} />
          <StatLine y={175} label={'Chakra'} value={stats.chakra} />
        </JPanel>
      </JPanel>
    </>
  );
}

function StatLine({ y, label, value }: { y: number; label: string; value: number | string }) {
  return (
    <JPanel y={y}>
      <Label className="bold sm" y={3} text={label} />
      <JPanel
        x={45}
        size={{ width: 50, height: 20 }}
        position={{ x: 0, y: 0 }}
        background="UIResource.Common.TextBG2"
        padding={3}
        style={{ textAlign: 'center' }}>
        {value}
      </JPanel>
    </JPanel>
  );
}
