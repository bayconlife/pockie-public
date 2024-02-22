import { Fragment, useContext } from 'react';
import { useAppSelector } from '../../../hooks';
import { BloodlineContext } from '../BloodlineContext';
import JPanel from '../../../components/UI/JPanel';
import { Label } from '../../../components/UI/Label';
import { ActiveSoul, Soul } from './Soul';
import { JButton } from '../../../components/UI/JButton';
import { JScrollPane } from '../../../components/UI/JScollPane';
import { closeDisplay, display } from '../../../util/EventEmitter';
import { SoulSynthesis } from './Synthesis';

export function Souls() {
  const limit = useContext(BloodlineContext);
  const souls = useAppSelector((state) => state.character.bloodlines.souls);
  const selectedLimit = useAppSelector((state) => limit && state.character.bloodlines.limits[limit]);

  return (
    <JPanel width={280}>
      <Label className="bold sm center" text="Souls equipped to selected limit" />
      <JPanel y={20}>
        {[0, 1, 2, 3, 4].map((i, idx) => (
          <Fragment key={idx}>
            {selectedLimit && !!selectedLimit.souls?.[idx] && (
              <ActiveSoul idx={idx} id={selectedLimit.souls[idx].id} level={selectedLimit.souls[idx].level} />
            )}
            {(!selectedLimit || !selectedLimit.souls?.[idx]) && (
              <JPanel
                x={5 + idx * 55}
                y={Math.floor(idx / 5) * 70}
                size={{ width: 50, height: 50 }}
                background="UIResource.Common.BigBG5"
                padding={2}></JPanel>
            )}
          </Fragment>
        ))}
      </JPanel>

      <JPanel y={85}>
        <JButton x={0} text="Refine" disabled />
        {/* <JButton x={105} text="Refine" /> */}
        <JButton
          x={205}
          text="Synthesize"
          onClick={() => display('soulSynthesis', <SoulSynthesis onClose={() => closeDisplay('soulSynthesis')} />)}
        />
      </JPanel>

      <Label y={120} className="bold sm center" text="Soul Inventory" />

      <JPanel y={140} width={280} height={210} background="UIResource.Common.BigBG2" padding={5}>
        <JScrollPane size={{ width: 270, height: 200 }} hidden>
          {souls.map(({ id, level }, idx) => (
            <Soul key={idx} idx={idx} id={id} level={level} />
          ))}
        </JScrollPane>
      </JPanel>
    </JPanel>
  );
}
