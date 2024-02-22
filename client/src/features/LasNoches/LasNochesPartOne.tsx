import * as React from 'react';
import { BottomMenu } from '../BottomMenu/BottomMenu';
import GameContainer from '../../components/GameContainer';
import { LasNochesPrompt } from './LasNochesPrompt';
import { TopMenu } from '../TopMenu/TopMenu';

export const LasNochesPartOne: React.FC<{}> = () => {
  return (
    <GameContainer src={`scenes/backgrounds/las_noches_part_one.png`}>
      <TopMenu />
      <BottomMenu />

      <LasNochesPrompt />
    </GameContainer>
  );
};
