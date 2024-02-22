import * as React from 'react';
import { NpcMenu } from '../../../components/NpcMenu/NpcMenu';
import { Scene } from '../../../enums';
import { useAppSelector } from '../../../hooks';

export const NpcMenuShop: React.FC<{ onClick: () => void; onEnd: () => void }> = ({ onClick, onEnd }) => {
  const currentScene = useAppSelector((state) => state.scene.scene);

  return (
    <NpcMenu onEnd={onEnd} npc={currentScene === Scene.ANGEL_CITY ? 16005 : 11005} imageOverride={11005}>
      <div
        className="clickable"
        onClick={() => {
          onClick();
          onEnd();
        }}>
        Enter Shop
      </div>
    </NpcMenu>
  );
};
