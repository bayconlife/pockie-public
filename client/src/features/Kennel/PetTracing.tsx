import ImageButton from '../../components/Buttons/ImageButton';
import { Grid } from '../../components/Grid';
import Panel from '../../components/Panel/Panel';
import { JButton } from '../../components/UI/JButton';
import { JImage } from '../../components/UI/JImage';
import { JLayout } from '../../components/UI/JLayout';
import JPanel from '../../components/UI/JPanel';
import { JTextField } from '../../components/UI/JTextField';
import { MultilineLabel } from '../../components/UI/MultilineLabel';
import GridBG from '../../assets/Grid_YellowBSD.png';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setPetTracePartial } from '../../slices/characterSlice';
import { Core, IItem } from '../../slices/inventorySlice';
import { Item } from '../../components/Item';
import { batch } from 'react-redux';
import { ItemLocation } from '../../enums';
import { hidePetTracing } from '../../slices/panelSlice';
import { prompt } from '../../util/EventEmitter';
import { toServer } from '../../util/ServerSocket';
import { getItemLocation, getItemPosition } from '../../resources/Items';

enum State {
  READY,
  REVEALING,
  FINISHED,
}

export function PetTracing() {
  const dispatch = useAppDispatch();
  const show = useAppSelector((state) => state.panels.petTracing);
  const trace = useAppSelector((state) => state.character.petTracing);
  const [state, setState] = useState<State>(State.READY);
  const [rewards, setRewards] = useState<IItem[]>([]);
  const [route, setRoute] = useState<number[]>([]);
  const [queue, setQueue] = useState<number[]>([]);

  const board = trace.board;
  const powers = trace.powers;

  function startGame(idx: number) {
    if (state !== State.READY || trace.started || board[idx] > 10) {
      return;
    }

    toServer('startPetTracingBoard', idx, (config: any) => {
      dispatch(setPetTracePartial(config.trace));
      batch(() => {
        setState(State.REVEALING);
        setRewards(config.rewards);
        setQueue(config.route);
      });
    });
  }

  if (queue.length) {
    setTimeout(() => {
      const newQueue = [...queue];

      newQueue.shift();

      batch(() => {
        setRoute([...route, queue[0]]);
        setQueue(newQueue);
      });
    }, 3000);
  } else if (state === State.REVEALING) {
    toServer('updateInventory');
    setState(State.FINISHED);
  }

  if (!show) {
    return null;
  }

  return (
    <Panel name="Pet Tracing" onClose={() => dispatch(hidePetTracing())}>
      <JPanel size={{ width: 500, height: 505 }} layout={<JLayout />}>
        <JPanel size={{ width: 500, height: 61 }} background="UIResource.Common.BigBG1">
          <JImage position={{ x: 20, y: 10 }} src="ui/UIResource/Pursuit/IconConnect1.png" />
          <JImage position={{ x: 65, y: 23 }} src="ui/UIResource/Pursuit/IconMultiply.png" />
          {powers[0] > 9 ? (
            <>
              <JImage position={{ x: 85, y: 15 }} src={`ui/UIResource/Pursuit/${Math.floor(powers[0] / 10)}.png`} />
              <JImage position={{ x: 110, y: 15 }} src={`ui/UIResource/Pursuit/${powers[0] % 10}.png`} />
            </>
          ) : (
            <JImage position={{ x: 85, y: 15 }} src={`ui/UIResource/Pursuit/${powers[0]}.png`} />
          )}

          <JImage position={{ x: 155, y: 10 }} src="ui/UIResource/Pursuit/IconEddy1.png" />
          <JImage position={{ x: 200, y: 23 }} src="ui/UIResource/Pursuit/IconMultiply.png" />
          {powers[1] > 9 ? (
            <>
              <JImage position={{ x: 220, y: 15 }} src={`ui/UIResource/Pursuit/${Math.floor(powers[1] / 10)}.png`} />
              <JImage position={{ x: 245, y: 15 }} src={`ui/UIResource/Pursuit/${powers[1] % 10}.png`} />
            </>
          ) : (
            <JImage position={{ x: 220, y: 15 }} src={`ui/UIResource/Pursuit/${powers[1]}.png`} />
          )}

          <JImage position={{ x: 290, y: 10 }} src="ui/UIResource/Pursuit/IconKeek1.png" />
          <JImage position={{ x: 335, y: 23 }} src="ui/UIResource/Pursuit/IconMultiply.png" />
          {powers[2] > 9 ? (
            <>
              <JImage position={{ x: 355, y: 15 }} src={`ui/UIResource/Pursuit/${Math.floor(powers[2] / 10)}.png`} />
              <JImage position={{ x: 380, y: 15 }} src={`ui/UIResource/Pursuit/${powers[2] % 10}.png`} />
            </>
          ) : (
            <JImage position={{ x: 355, y: 15 }} src={`ui/UIResource/Pursuit/${powers[2]}.png`} />
          )}

          <ImageButton
            defaultImage="ui/UIResource/Pursuit/HelpButton.png"
            onClick={() => {}}
            style={{ position: 'absolute', left: 445, top: 10 }}
            disabled
          />
        </JPanel>

        <JPanel size={{ width: 500, height: 440 }} layout={<JLayout horizontal />}>
          <JPanel size={{ width: 335, height: 440 }} background="UIResource.Common.BigBG1">
            {/* <Game onClick={() => {}} /> */}
            {board.map((i, idx) => (
              <JPanel key={idx} position={{ x: (idx % 3) * 105 + 20, y: Math.floor(idx / 3) * 135 + 10 }}>
                <GridItem
                  direction={i}
                  onClick={() => startGame(idx)}
                  disabled={state !== State.READY || trace.started}
                  reward={rewards[route.indexOf(idx)]}
                  fade={queue[0] === idx}
                  onPowerClick={() => {
                    toServer('usePetTracingPower', idx);
                  }}
                />
              </JPanel>
            ))}

            <JButton
              size={{ width: 100, height: 22 }}
              position={{ x: 117, y: 410 }}
              text="New Card"
              disabled={trace.started ? (state === State.REVEALING ? true : false) : false}
              onClick={() =>
                toServer('newPetTraceBoard', null, () => {
                  batch(() => {
                    setState(State.READY);
                    setRewards([]);
                    setRoute([]);
                    setQueue([]);
                  });
                })
              }
            />
          </JPanel>

          <JPanel size={{ width: 160, height: 440 }} background="UIResource.Common.BigBG1">
            <JPanel
              size={{ width: 140, height: 20 }}
              position={{ x: 10, y: 10 }}
              background="UIResource.Common.BigBG3"
              style={{ textAlign: 'center' }}>
              <b>Scoreboard</b>
            </JPanel>

            <MultilineLabel size={{ width: 80, height: 20 }} position={{ x: 10, y: 37 }} text="Remaining" />
            <JTextField size={{ width: 65, height: 20 }} position={{ x: 85, y: 35 }} text={'' + trace.attemptsLeft} />

            <JPanel size={{ width: 140, height: 2 }} position={{ x: 10, y: 57 }} background="UIResource.Common.PartitionYellow" />

            <MultilineLabel size={{ width: 80, height: 20 }} position={{ x: 10, y: 62 }} text="Day Total" />
            <JTextField size={{ width: 65, height: 20 }} position={{ x: 85, y: 60 }} text={'' + trace.score} />

            <JPanel size={{ width: 140, height: 2 }} position={{ x: 10, y: 82 }} background="UIResource.Common.PartitionYellow" />

            <MultilineLabel size={{ width: 80, height: 20 }} position={{ x: 10, y: 87 }} text="High Score" />
            <JTextField size={{ width: 65, height: 20 }} position={{ x: 85, y: 85 }} text={'' + trace.highScore} />

            <JPanel size={{ width: 140, height: 2 }} position={{ x: 10, y: 107 }} background="UIResource.Common.PartitionYellow" />

            {/* <MultilineLabel size={{ width: 80, height: 20 }} position={{ x: 10, y: 112 }} text="Rank" />
            <JTextField size={{ width: 65, height: 20 }} position={{ x: 85, y: 110 }} /> */}

            {/* <JPanel size={{ width: 140, height: 2 }} position={{ x: 10, y: 132 }} background="UIResource.Common.PartitionYellow" /> */}

            <JButton
              size={{ width: 115, height: 22 }}
              position={{ x: 23, y: 145 }}
              text="Purchase More"
              onClick={() =>
                prompt('Would you like to spend 100 coupons to buy 10 more attempts?', () => {
                  toServer('buyPetTraceAttempts');
                })
              }
            />

            <JPanel
              size={{ width: 140, height: 20 }}
              position={{ x: 10, y: 195 }}
              background="UIResource.Common.BigBG3"
              style={{ textAlign: 'center' }}>
              <b>Holding</b>
            </JPanel>

            <JPanel size={{ width: 117, height: 171 }} position={{ x: 21, y: 225 }} background="UIResource.Common.BigBG1" padding={5}>
              <Holding />
            </JPanel>

            <JButton
              size={{ width: 115, height: 23 }}
              position={{ x: 23, y: 405 }}
              text="Into Pack"
              onClick={() => toServer('claimPetTraceRewards', null)}
            />
          </JPanel>
        </JPanel>
      </JPanel>
    </Panel>
  );
}

function Holding() {
  const items = useAppSelector((state) =>
    Object.keys(state.inventory.items)
      .filter((uid) => getItemLocation(state.inventory.items[uid]) === ItemLocation.PetTracing)
      .map((uid) => state.inventory.items[uid])
  );

  return (
    <Grid location={99} numberOfTiles={24} tilesPerRow={4} bg={GridBG}>
      {items.map((item) => (
        <Item key={item.uid + '-' + getItemPosition(item)} item={item} onClick={() => {}} noBackground perRow={4} />
      ))}
    </Grid>
  );
}

function GridItem({
  direction,
  onClick,
  disabled,
  reward,
  fade,
  onPowerClick,
}: {
  direction: number;
  onClick: () => void;
  disabled: boolean;
  reward: IItem | null;
  fade: boolean;
  onPowerClick: () => void;
}) {
  let src = 'mystery';
  const style: React.CSSProperties = {
    transition: 'opacity 3s linear',
  };

  if (direction === 0) {
    src = 'mystery';
  } else if (direction === 1) {
    src = 'down'; // up
    style.transform = 'scaleX(-1) scaleY(-1)';
  } else if (direction === 2) {
    src = 'right';
  } else if (direction === 3) {
    src = 'down';
  } else if (direction === 4) {
    src = 'right'; // left
    style.transform = 'scaleX(-1)';
  } else if (direction === 11) {
    src = 'down_broken'; // up
    style.transform = 'scaleX(-1) scaleY(-1)';
  } else if (direction === 12) {
    src = 'right_broken';
  } else if (direction === 13) {
    src = 'down_broken';
  } else if (direction === 14) {
    src = 'right_broken'; // left
    style.transform = 'scaleX(-1)';
  }

  src = `ui/UIResource/Pursuit/${src}.png`;

  if (fade) {
    style.opacity = '0';
  }

  if (reward) {
    reward.core[Core.AMOUNT] = 1;
  }

  let btnType = 'IconEddy2';

  if (direction > 10) {
    btnType = 'IconConnect2';
  } else if (direction === 0) {
    btnType = 'IconKeek2';
  }

  return (
    <>
      <div onClick={onClick} style={{ cursor: btnType === 'IconConnect2' ? 'not-allowed' : 'pointer' }}>
        <JImage position={{ x: 0 }} src="ui/UIResource/Pursuit/card_bg.png" />
        {reward ? (
          <div style={{ width: 85, height: 95 }}>
            <Item item={reward} onClick={() => {}} style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} noBackground />
          </div>
        ) : (
          <JImage position={{ x: 16, y: 21 }} src={src} style={style} />
        )}
      </div>
      <JButton size={{ width: 84, height: 25 }} position={{ x: 0, y: 103 }} text="" disabled={disabled} onClick={onPowerClick}>
        <JImage
          position={{ x: 42 - 15 }}
          src={`ui/UIResource/Pursuit/${btnType}.png`}
          style={{ userSelect: 'none', pointerEvents: 'none' }}
        />
      </JButton>
    </>
  );
}
