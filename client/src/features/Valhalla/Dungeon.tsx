import * as React from 'react';
import ImageButton from '../../components/Buttons/ImageButton';
import GameContainer from '../../components/GameContainer';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setLocation, setSubLocation } from '../../slices/dungeonSlice';
import { JButton } from '../../components/UI/JButton';
import { TopMenu } from '../TopMenu/TopMenu';
import { FightState, setFightState } from '../../slices/fightSlice';
import { CDNImage } from '../../components/Elements/Image';
import { cancelFromServer, fromServer, toServer } from '../../util/ServerSocket';

// prettier-ignore
const locationOffset: number[][][] = [
  [[374, 162]],
  [[374, 162], [582, 403]],
  [[257, 96], [434, 367], [612, 201]],
  [[230, 135], [395, 339], [596, 94], [705, 373]],
  [[340, 200], [601, 81], [403, 402], [679, 326]],
  [[114, 189], [340, 262], [657, 99], [623, 397]],
  [[120, 167], [358, 335], [634, 106], [658, 323]],
  [[596, 139], [140, 132], [517, 362]]
];

// prettier-ignore
const completeOffset: number[][][] = [
  [[25, 34]],
  [[25, 34], [12, 1]],
  [[19, 53], [23, 1], [0, 26]],
  [[43, 40], [17, 0], [6, 44], [0, 0]],
  [[2, 38], [7, 42], [51, 0], [1, 1]],
  [[43, 39], [57, 1], [7, 43], [11, 1]],
  [[35, 25], [19, 1], [10, 35], [52, 0]],
  [[25, 0], [20, 55], [24, 0]]
];

export function Dungeon({}) {
  const dispatch = useAppDispatch();

  const id = useAppSelector((store) => store.dungeon.id);
  const locations = useAppSelector((store) => store.dungeon.locations);
  const location = useAppSelector((store) => store.dungeon.location);
  const subLocation = useAppSelector((store) => store.dungeon.subLocation);
  const [completed, setCompleted] = React.useState(false);

  React.useEffect(() => {
    toServer('dungeonRefresh');
    fromServer('dungeonUpdate', ({ location, subLocation }: { location: number; subLocation: number }) => {
      dispatch(setLocation(location));
      dispatch(setSubLocation(subLocation));
    });

    fromServer('dungeonComplete', (_) => setCompleted(true));

    return () => {
      cancelFromServer('dungeonUpdate');
      cancelFromServer('dungeonComplete');
    };
  }, []);

  const onSelect = React.useCallback(() => {
    dispatch(setFightState(FightState.LOADING));
    toServer('dungeonFight', {});
  }, []);

  return (
    <GameContainer src="scenes/valhalla/bg.png">
      <TopMenu />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}>
        <CDNImage src={`scenes/valhalla/dungeons/${id}/map.png`} />
        {locations.map((i, idx) => (
          <Location
            key={idx}
            x={locationOffset[id][idx][0]}
            y={locationOffset[id][idx][1]}
            onSelect={onSelect}
            location={idx}
            subLocation={subLocation}
            isComplete={idx < location}
          />
        ))}
        {completed && (
          <JButton
            size={{ width: 100, height: 50 }}
            position={{ x: 450, y: 525 }}
            text="Leave"
            onClick={() => toServer('switchScene', 5001)}
          />
        )}

        <JButton position={{ x: 915, y: 15 }} text="Abandon" onClick={() => toServer('dungeonAbandon')} />
      </div>
    </GameContainer>
  );
}

interface LocationProps {
  x: number;
  y: number;
  onSelect: () => void;
  location: number;
  subLocation: number;
  isComplete: boolean;
}

function Location({ x, y, onSelect, location, subLocation, isComplete }: LocationProps) {
  const [showSelect, setShowSelect] = React.useState(false);
  const currentLocation = useAppSelector((store) => store.dungeon.location);
  const id = useAppSelector((store) => store.dungeon.id);
  const fightState = useAppSelector((state) => state.fight.state);
  const myId = useAppSelector((store) => store.account.id);
  const partyLeader = useAppSelector((store) => store.party.party?.leader);

  const iAmLeader = myId === partyLeader;

  React.useEffect(() => {
    setShowSelect(false);
  }, [isComplete]);

  return (
    <>
      <div style={{ position: 'absolute', left: x, top: y }}>
        {isComplete ? (
          <CDNImage
            src={`scenes/valhalla/dungeons/${id}/${location}_complete.png`}
            style={{ position: 'absolute', left: completeOffset[id][location][0], top: completeOffset[id][location][1] }}
          />
        ) : (
          <ImageButton
            defaultImage={`scenes/valhalla/dungeons/${id}/${location}.png`}
            onClick={() => setShowSelect(!showSelect)}
            disabled={location !== currentLocation}
          />
        )}
      </div>

      {showSelect && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '100' }}>
          <CDNImage src="scenes/valhalla/dungeons/select.png" />

          {[0, 1, 2, 3, 4].map((i, idx) => (
            <ImageButton
              key={`sub-${idx}`}
              defaultImage="icons/monsters/10005.png"
              style={{ position: 'absolute', top: 220, left: 82 + 70 * idx }}
              imageStyle={{ width: 50 }}
              onClick={onSelect}
              disabled={idx !== subLocation || fightState !== FightState.FINISHED || !iAmLeader}
            />
          ))}
          <ImageButton
            defaultImage="scenes/valhalla/close.png"
            onClick={() => setShowSelect(false)}
            style={{ position: 'absolute', left: 422, top: 7 }}
          />
        </div>
      )}
    </>
  );
}
