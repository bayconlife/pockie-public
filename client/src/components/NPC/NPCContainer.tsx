import './NPCContainer.css';
import { QuestState } from '../../enums';
import { useAppSelector } from '../../hooks';
import { useNpcQuestState } from '../../hooks/questState';
import { getQuestIcon, getQuestIconSize } from '../../util/questInfo';
import JPanel from '../UI/JPanel';
import { NPCScene } from './NPCScene';
import useTranslator from '../../hooks/translate';
import { ASSET_CONFIG } from '../../util/assetConfig';
import EventEmitter from '../../util/EventEmitter';
import { useEffect, useRef } from 'react';

export function NPCContainer({ id, onClick }: { id: number; onClick?: () => void }) {
  const t = useTranslator();
  const gameRef = useRef<Phaser.Game>();
  const clickRef = useRef<(() => void) | undefined>(onClick);
  const scale = useAppSelector((state) => state.ui.scale);
  const scene = useAppSelector((state) => state.scene.scene);
  const questState = useNpcQuestState(id);

  clickRef.current = onClick;

  const npc = {
    size: [0, 0],
    position: [0, 0],
    offset: [0, 0],
    nameOffset: [0, 0],
    ...ASSET_CONFIG?.['SCENE_NPCS']?.[scene]?.[id],
  };
  const name = t(`npc__${id}--name`);

  const size = {
    width: npc.size[0] * scale,
    height: npc.size[1] * scale,
  };

  const top = (npc.position[1] + npc.offset[1]) * scale;
  const left = (npc.position[0] + npc.offset[0]) * scale;

  useEffect(() => {
    const eventId = EventEmitter.on('npc-click', (npcId) => {
      if (npcId === id) {
        clickRef.current?.();
      }
    });

    if (gameRef.current === undefined) {
      gameRef.current = new Phaser.Game({
        scene: [NPCScene],
        transparent: true,
        parent: `npc-container-${id}`,
        scale: {
          width: npc.size[0],
          height: npc.size[1],
          mode: Phaser.Scale.RESIZE,
        },
      });
      gameRef.current.scene.start('npc', { id, name });
    }

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = undefined;

      EventEmitter.off(eventId);
    };
  }, []);

  return (
    <>
      <div style={{ position: 'absolute', top, left }}>
        <div id={`npc-container-${id}`} style={{ ...size }}>
          {questState !== QuestState.NONE && (
            <JPanel className="npc__quest" size={getQuestIconSize(questState)} background={getQuestIcon(questState)} />
          )}
        </div>

        <div
          data-text={name}
          className="npc__name"
          style={{
            left: `calc(50% + ${npc.nameOffset[0]}px)`,
            fontSize: `${40 * scale}px`,
            fontFamily: 'dom',
          }}
        />
      </div>
    </>
  );
}
