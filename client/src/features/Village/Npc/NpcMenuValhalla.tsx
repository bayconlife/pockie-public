import * as React from 'react';
import { NpcMenu } from '../../../components/NpcMenu/NpcMenu';
import { toServer } from '../../../util/ServerSocket';

export const NpcMenuValhalla: React.FC<{ onEnd: () => void }> = ({ onEnd }) => {
  return (
    <NpcMenu onEnd={onEnd} npc={17001}>
      <div className="clickable" onClick={() => toServer('switchScene', 5001)}>
        Enter Valhalla
      </div>
    </NpcMenu>
  );
};
