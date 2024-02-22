import * as React from 'react';
import { NpcMenu } from '../../../components/NpcMenu/NpcMenu';
import { toServer } from '../../../util/ServerSocket';

export const NpcMenuLasNoches: React.FC<{ onEnd: () => void }> = ({ onEnd }) => {
  return (
    <NpcMenu onEnd={onEnd} npc={17003}>
      <div className="clickable" onClick={() => toServer('switchScene', 3101)}>
        Enter Las Noches
      </div>
    </NpcMenu>
  );
};
