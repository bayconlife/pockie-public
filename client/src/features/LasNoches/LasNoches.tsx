import * as React from 'react';
import GameContainer from '../../components/GameContainer';
import { NpcMenu } from '../../components/NpcMenu/NpcMenu';
import { TopMenu } from '../TopMenu/TopMenu';
import { toServer } from '../../util/ServerSocket';

export const LasNoches: React.FC<{}> = () => {
  return (
    <GameContainer src={`scenes/backgrounds/3101.png`}>
      <TopMenu />
      <NpcMenu npc={17003} onEnd={() => toServer('switchScene', 171)} moveable={false}>
        <div
          className="clickable"
          onClick={() =>
            toServer('lasNochesEnter', {}, () => {
              toServer('switchScene', 61);
            })
          }>
          Common Route
        </div>
        <div className="" onClick={() => {}}>
          Express Route
        </div>
        <div className="" onClick={() => {}}>
          VIP Route
        </div>
      </NpcMenu>
    </GameContainer>
  );
};
