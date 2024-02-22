import * as React from 'react';
import { useAppSelector } from '../../../hooks';

export const LevelInfo: React.FC<{ level: number }> = ({ level }) => {
  const playerLevel = useAppSelector((store) => store.stats.stats).level as number;

  return (
    <div style={{ position: 'relative' }}>
      Required Level{' '}
      <span className={playerLevel < level ? '--invalid' : ''} style={{ position: 'absolute', right: 0 }}>
        {level}
      </span>
    </div>
  );
};
