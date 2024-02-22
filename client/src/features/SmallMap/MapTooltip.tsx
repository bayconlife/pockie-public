import { useEffect, useState } from 'react';
import useTranslator from '../../hooks/translate';
import EventEmitter from '../../util/EventEmitter';
import { useAppSelector } from '../../hooks';
import { Tooltip } from '../../components/Tooltips/Tooltip';
import { SERVER_CONFIG } from '../../util/serverConfig';

export function MapTooltip() {
  const t = useTranslator();
  const playerLevel = useAppSelector((state) => state.stats.stats.level);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; scene: number } | null>(null);
  const scenes = SERVER_CONFIG.SCENES;

  useEffect(() => {
    const tooltipId = EventEmitter.on('mapTooltip', (data) => {
      setTooltip({ x: data.x, y: data.y, scene: data.key });
    });
    const closeTooltipId = EventEmitter.on('mapTooltipExit', () => setTooltip(null));

    return () => {
      EventEmitter.off(tooltipId);
      EventEmitter.off(closeTooltipId);
    };
  }, []);

  if (tooltip === null) {
    return null;
  }

  const { level = 0, npcs = [], monsters = [], boss = 0 } = { ...scenes[tooltip.scene] };

  return (
    <Tooltip offsetX={tooltip.x} offsetY={tooltip.y - 426} text={[]}>
      <div style={{ width: 300, fontSize: '0.8rem' }}>
        <div style={{ textAlign: 'center', color: 'gold' }}>{t(`scene__${tooltip.scene}--name`)}</div>
        {level !== 0 && (
          <div style={{ color: 'lightblue' }}>
            Entry Level: <span style={{ color: playerLevel < level ? 'red' : 'whitesmoke' }}>{level}</span>
          </div>
        )}

        {npcs.length > 0 && (
          <div style={{ color: 'teal' }}>
            Npcs: <span style={{ color: 'green' }}>{npcs.map((id: number) => t(`npc__${id}--name`)).join(', ')}</span>
          </div>
        )}

        {monsters.length > 0 && (
          <div style={{ color: 'teal' }}>
            Monsters: <span style={{ color: 'green' }}>{monsters.map((id: number) => t(`monster__${id}--name`)).join(', ')}</span>
          </div>
        )}

        {boss !== 0 && <div>Boss: {t(`npc__${boss}--name`)}</div>}
      </div>
    </Tooltip>
  );
}
