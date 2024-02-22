import { useContext, useRef, useState } from 'react';
import Panel from '../../../components/Panel/Panel';
import { JButton } from '../../../components/UI/JButton';
import { JImage } from '../../../components/UI/JImage';
import JPanel from '../../../components/UI/JPanel';
import { Label } from '../../../components/UI/Label';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import useTranslator from '../../../hooks/translate';
import { Soul } from './Soul';
import { SoulTooltip } from './SoulTooltip';
import { ContextMenu } from '../../../components/ContextMenu/ContextMenu';
import { clearSynth, removeFromSynth } from '../../../slices/bloodlineSlice';
import { toServer } from '../../../util/ServerSocket';

const WIDTH = 320;
const HEIGHT = 110;

export function SoulSynthesis({ onClose }: { onClose: () => void }) {
  const dispatch = useAppDispatch();
  const synth = useAppSelector((state) => state.bloodline.synth);
  const synthResult = useAppSelector((state) => state.bloodline.synthResult);

  return (
    <Panel name="Soul Synthesis" onClose={onClose}>
      <JPanel width={WIDTH} height={HEIGHT} background="UIResource.Common.BigBG1" padding={5}>
        <JPanel>
          <JPanel x={0} size={{ width: 50, height: 50 }} background="UIResource.Common.BigBG5" padding={2}>
            {synth[0] !== null && <SynthSoul pos={0} idx={synth[0]} />}
          </JPanel>
          <JPanel x={55} y={15} size={{ width: 23, height: 23 }} background="UIResource.Compose.Add" />
          <JPanel x={85} size={{ width: 50, height: 50 }} background="UIResource.Common.BigBG5" padding={2}>
            {synth[1] !== null && <SynthSoul pos={1} idx={synth[1]} />}
          </JPanel>
          <JPanel x={140} y={15} size={{ width: 23, height: 23 }} background="UIResource.Compose.Add" />
          <JPanel x={175} size={{ width: 50, height: 50 }} background="UIResource.Common.BigBG5" padding={2}>
            {synth[2] !== null && <SynthSoul pos={2} idx={synth[2]} />}
          </JPanel>
          <JPanel x={230} y={19} size={{ width: 24, height: 16 }} background="UIResource.Compose.Amount" />
          <JPanel x={260} size={{ width: 50, height: 50 }} background="UIResource.Common.BigBG5" padding={2}>
            {synthResult !== null && <SynthSoulResult id={synthResult.id} level={synthResult.level} />}
          </JPanel>
        </JPanel>

        <JPanel y={75}>
          {/* <JButton text="Find Match" /> */}
          <JButton
            x={WIDTH / 2 - 75 / 2}
            text="Create"
            disabled={synthResult === null}
            onClick={() => toServer('synthSouls', synth, () => dispatch(clearSynth()))}
          />
        </JPanel>
      </JPanel>
    </Panel>
  );
}

function SynthSoul({ idx, pos }: { idx: number; pos: number }) {
  const t = useTranslator();
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const soul = useAppSelector((state) => state.character.bloodlines.souls[idx]);
  const [isContextMenuShowing, setIsContextMenuShowing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className="clickable"
      ref={ref}
      onClick={() => setIsContextMenuShowing(!isContextMenuShowing)}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();

        setIsContextMenuShowing(!isContextMenuShowing);
      }}
      onMouseLeave={() => {
        setIsContextMenuShowing(false);
        setIsHovering(false);
      }}
      onMouseEnter={() => setIsHovering(true)}
      style={{ width: 50 }}>
      <JImage src={`icons/bloodlines/souls/${soul.id}.png`} style={{ width: 45 }} />
      <Label y={50} className="bold xs left" text={`${t(`soul__${soul.id}`)}`} style={{ width: 40 }} />
      <Label y={50} className="bold xs right" text={`${soul.level}`} />

      {!isContextMenuShowing && isHovering && <SoulTooltip id={soul.id} level={soul.level} />}

      {isContextMenuShowing && ref.current && (
        <ContextMenu position={{ x: ref.current.getBoundingClientRect().right, y: ref.current.getBoundingClientRect().y }}>
          <ContextMenu.Item title="Remove" onClick={() => dispatch(removeFromSynth(pos))} />
        </ContextMenu>
      )}
    </div>
  );
}

function SynthSoulResult({ id, level }: { id: number; level: number }) {
  const t = useTranslator();
  const ref = useRef<HTMLDivElement>(null);
  const [isContextMenuShowing, setIsContextMenuShowing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className="clickable"
      ref={ref}
      onClick={() => setIsContextMenuShowing(!isContextMenuShowing)}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();

        setIsContextMenuShowing(!isContextMenuShowing);
      }}
      onMouseLeave={() => {
        setIsContextMenuShowing(false);
        setIsHovering(false);
      }}
      onMouseEnter={() => setIsHovering(true)}
      style={{ width: 50 }}>
      <JImage src={`icons/bloodlines/souls/${id}.png`} style={{ width: 45 }} />
      <Label y={50} className="bold xs left" text={`${t(`soul__${id}`)}`} style={{ width: 40 }} />
      <Label y={50} className="bold xs right" text={`${level}`} />

      {isHovering && <SoulTooltip id={id} level={level} />}
    </div>
  );
}
