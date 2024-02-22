import './MapContainer.css';
import * as React from 'react';
import { useAppSelector } from '../../hooks';
import { WorldMapScene } from './WorldMapScene';
import { useDispatch } from 'react-redux';
import { hideMap } from '../../slices/mapSlice';
import { MapTooltip } from './MapTooltip';

const config = {
  type: Phaser.WEBGL,
  height: 426,
  width: 768,
  scene: [WorldMapScene],
  parent: 'map-container',
  scale: {
    mode: Phaser.Scale.CENTER_BOTH,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
  },
};

export const MapContainer: React.FC<{}> = () => {
  const showMap = useAppSelector((state) => state.map.show);

  if (!showMap) {
    return null;
  }

  return <WorldMap />;
};

const WorldMap: React.FC<{}> = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const game = new Phaser.Game(config);

    game.scene.start('world-map', { onClose: () => dispatch(hideMap()) });

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div id="map">
      <div id="map-container">
        <MapTooltip />
      </div>
    </div>
  );
};
