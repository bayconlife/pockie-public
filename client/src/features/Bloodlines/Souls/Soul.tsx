import { useContext, useRef, useState } from 'react';
import useTranslator from '../../../hooks/translate';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { BloodlineContext } from '../BloodlineContext';
import JPanel from '../../../components/UI/JPanel';
import { JImage } from '../../../components/UI/JImage';
import { Label } from '../../../components/UI/Label';
import { ContextMenu } from '../../../components/ContextMenu/ContextMenu';
import { toServer } from '../../../util/ServerSocket';
import { removeFromSynth, setNextSynth } from '../../../slices/bloodlineSlice';
import { SoulTooltip } from './SoulTooltip';

export function Soul({ idx, id, level }: { idx: number; id: number; level: number }) {
  const t = useTranslator();
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const limit = useContext(BloodlineContext);
  const characterLevel = useAppSelector((state) => state.stats.stats.level);
  const limits = useAppSelector((state) => state.character.bloodlines.limits);
  const synthFull = useAppSelector((state) => state.bloodline.synth.every((idx) => idx !== null));
  const synthPosition = useAppSelector((state) => state.bloodline.synth.indexOf(idx));
  const [isContextMenuShowing, setIsContextMenuShowing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const disabled = (limit && limits[limit]?.souls.find((soul) => soul.id === id)) || limit === null || level > characterLevel;

  return (
    <div
      onMouseLeave={() => {
        setIsContextMenuShowing(false);
        setIsHovering(false);
      }}
      onMouseEnter={() => setIsHovering(true)}>
      <JPanel
        divRef={ref}
        className="clickable"
        x={(idx % 5) * 55}
        y={Math.floor(idx / 5) * 70}
        size={{ width: 50, height: 50 }}
        background="UIResource.Common.BigBG5"
        padding={2}
        onClick={() => setIsContextMenuShowing(!isContextMenuShowing)}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();

          setIsContextMenuShowing(!isContextMenuShowing);
        }}>
        <JImage src={`icons/bloodlines/souls/${id}.png`} style={{ width: 45 }} />
        {synthPosition !== -1 && <Label x={-2} y={0} className="bold xs right text-shadow" text={(synthPosition + 1).toString()} />}
        <Label y={50} className="bold xs left" text={`${t(`soul__${id}`)}`} style={{ width: 40 }} />
        <Label y={50} className="bold xs right" text={`${level}`} />

        {!isContextMenuShowing && isHovering && <SoulTooltip id={id} level={level} />}
      </JPanel>

      {isContextMenuShowing && ref.current && (
        <ContextMenu position={{ x: ref.current.getBoundingClientRect().right, y: ref.current.getBoundingClientRect().y }}>
          <ContextMenu.Item
            title="Bind"
            onClick={() =>
              toServer('bindSoul', { index: idx, id: limit }, () => {
                setIsContextMenuShowing(false);
                setIsHovering(false);
              })
            }
            disabled={!!disabled}
          />

          <ContextMenu.Item
            title="Synthesize"
            onClick={() => {
              dispatch(setNextSynth(idx));
              setIsContextMenuShowing(false);
              setIsHovering(false);
            }}
            disabled={synthPosition !== -1 || synthFull || level >= 7}
          />

          {synthPosition !== -1 && (
            <ContextMenu.Item
              title="Synth Remove"
              onClick={() => {
                dispatch(removeFromSynth(idx));
                setIsContextMenuShowing(false);
                setIsHovering(false);
              }}
            />
          )}
        </ContextMenu>
      )}
    </div>
  );
}

export function ActiveSoul({ idx, id, level }: { idx: number; id: number; level: number }) {
  const t = useTranslator();
  const ref = useRef<HTMLDivElement>(null);
  const limit = useContext(BloodlineContext);
  const [isContextMenuShowing, setIsContextMenuShowing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      onMouseLeave={() => {
        setIsContextMenuShowing(false);
        setIsHovering(false);
      }}
      onMouseEnter={() => setIsHovering(true)}>
      <JPanel
        divRef={ref}
        x={5 + idx * 55}
        y={Math.floor(idx / 5) * 70}
        size={{ width: 50, height: 50 }}
        background="UIResource.Common.BigBG5"
        padding={2}
        onClick={() => setIsContextMenuShowing(!isContextMenuShowing)}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();

          setIsContextMenuShowing(!isContextMenuShowing);
        }}>
        <JImage className="clickable" src={`icons/bloodlines/souls/${id}.png`} style={{ width: 45 }} />

        {!isContextMenuShowing && isHovering && <SoulTooltip id={id} level={level} />}
      </JPanel>

      {isContextMenuShowing && ref.current && (
        <ContextMenu position={{ x: ref.current.getBoundingClientRect().right, y: ref.current.getBoundingClientRect().y }}>
          <ContextMenu.Item
            title="Destroy"
            onClick={() =>
              toServer('destroySoul', { index: idx, id: limit }, () => {
                setIsContextMenuShowing(false);
                setIsHovering(false);
              })
            }
          />
        </ContextMenu>
      )}
    </div>
  );
}
