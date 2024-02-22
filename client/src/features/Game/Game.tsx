import { Display } from '../Display/Display';
import Fight from '../Fight/Fight';
import GameStateFactory from '../States/GameStateFactory';

export function Game() {
  return (
    <>
      <GameStateFactory />
      <Display />
      {/* <Fight /> */}
    </>
  );
}
