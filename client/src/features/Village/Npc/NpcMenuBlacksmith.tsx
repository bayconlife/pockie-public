import * as React from 'react';
import { useDispatch } from 'react-redux';
import { NpcMenu } from '../../../components/NpcMenu/NpcMenu';
import { showArmory } from '../../../slices/panelSlice';

export const NpcMenuBlacksmith: React.FC<{ onEnd: () => void }> = ({ onEnd }) => {
  const dispatch = useDispatch();

  return (
    <NpcMenu onEnd={onEnd} npc={11003}>
      <div
        className="clickable"
        onClick={() => {
          dispatch(showArmory());
          onEnd();
        }}>
        Enter Armory
      </div>
    </NpcMenu>
  );
};
