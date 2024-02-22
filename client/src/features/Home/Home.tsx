import { useEffect, useState } from 'react';
import GameContainer from '../../components/GameContainer';
import { SmallMap } from '../SmallMap/SmallMap';
import { TopMenu } from '../TopMenu/TopMenu';
import { Crops } from './Crops';
import { HomeScene } from './HomeScene';
import EventEmitter from '../../util/EventEmitter';
import { FarmOptions } from './FarmOptions';
import { SERVER_CONFIG } from '../../util/serverConfig';
import { BottomMenu } from '../BottomMenu/BottomMenu';

export function Home() {
  const [selectedPlot, setSelectedPlot] = useState(-1);

  useEffect(() => {
    const id = EventEmitter.on('showFarmOptions', (plot) => {
      setSelectedPlot(plot);
    });

    return () => {
      EventEmitter.off(id);
    };
  }, []);

  return (
    <GameContainer src={`scenes/home/bg.png`}>
      <HomeScene />

      <TopMenu />
      <SmallMap />

      {selectedPlot !== -1 && <FarmOptions onClose={() => setSelectedPlot(-1)} selectedPlot={selectedPlot} />}

      {/* <Crops /> */}
      <BottomMenu />
    </GameContainer>
  );
}
