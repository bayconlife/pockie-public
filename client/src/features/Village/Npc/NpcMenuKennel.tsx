import * as React from 'react';
import { useDispatch } from 'react-redux';
import { NpcMenu } from '../../../components/NpcMenu/NpcMenu';
import { showKennel, showPetTracing } from '../../../slices/panelSlice';

export const NpcMenuKennel: React.FC<{ onEnd: () => void }> = ({ onEnd }) => {
  const dispatch = useDispatch();

  return (
    <NpcMenu onEnd={onEnd} npc={11006}>
      <div
        className="clickable"
        onClick={() => {
          dispatch(showKennel());
          onEnd();
        }}>
        Enter Kennel
      </div>
      <div
        className="clickable"
        onClick={() => {
          dispatch(showPetTracing());
          onEnd();
        }}>
        Enter Pet Tracing
      </div>
    </NpcMenu>
  );
};
