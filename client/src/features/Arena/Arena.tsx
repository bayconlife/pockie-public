import './Arena.css';

import * as React from 'react';
import Button from './Button';
import ArenaRow from './ArenaRow';
import GameContainer from '../../components/GameContainer';
import ArenaVs from './ArenaVs';
import SkillMenu from '../SkillMenu';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setArenaStats, setBossFight, setCards, setFights, setPots, setTickets, setUserRank } from '../../slices/arenaSlice';
import { showSkills } from '../../slices/skillsSlice';
import ArenaProgressBar from './ArenaProgressBar';
import { JButton } from '../../components/UI/JButton';
import Leaderboard from './Leaderboard';
import { PotShop } from './PotShop';
import ArenaHistory from './ArenaHistory';
import ArenaStats from './ArenaStats';
import { Backdrop } from '../../components/Backdrop';
import { hideInventory, showInventory } from '../../slices/inventorySlice';
import { Inventory } from '../Inventory/Inventory';
import { DummyFightMenu } from './DummyFightMenu';
import { CDNImage } from '../../components/Elements/Image';
import { cancelFromServer, fromServer, toServer } from '../../util/ServerSocket';

const Arena: React.FC<{}> = () => {
  const dispatch = useAppDispatch();

  const userAvatar = useAppSelector((state) => state.inventory.items[state.inventory.locations[300]]?.props!.avatar);
  const fighters = useAppSelector((state) => state.arena.fighters);
  const bossFight = useAppSelector((state) => state.arena.bossFight);
  const tickets = useAppSelector((state) => state.arena.tickets);
  const Pots = useAppSelector((state) => state.arena.shopPots);
  const isInventoryVisible = useAppSelector((state) => state.inventory.show);

  const [showVs, setShowVs] = React.useState(false);
  const [selected, setSelected] = React.useState('');
  const [showShop, setShowShop] = React.useState(false);
  const [showDummyFightMenu, setShowDummyFightMenu] = React.useState(false);

  const selectedFighterIdx = fighters.findIndex((fighter) => fighter.id === selected);

  React.useEffect(() => {
    toServer('arena', null, (arenaStats: any) => {
      dispatch(setArenaStats(arenaStats));
    });

    fromServer('updateArena', (arenaStats) => {
      if (!!arenaStats.userRank) {
        dispatch(setUserRank(arenaStats.userRank));
      }

      if (arenaStats.bossFight !== undefined) {
        dispatch(setBossFight(arenaStats.bossFight));
      }

      if (arenaStats.tickets !== undefined) {
        dispatch(setTickets(arenaStats.tickets));
      }

      if (arenaStats.cards !== undefined) {
        dispatch(setCards(arenaStats.cards));
      }

      if (arenaStats.fighters !== undefined) {
        dispatch(setFights(arenaStats.fighters));
      }
    });

    if (bossFight === true) {
      toServer('arenaBossFight');
    }

    if (Pots.length === 0) {
      toServer('getPots', null, (cs: any) => {
        dispatch(setPots(cs));
      });
    }

    return () => {
      cancelFromServer('updateArena');
    };
  }, []);

  const leave = React.useCallback(() => toServer('previousScene'), []);

  const startFight = React.useCallback(() => {
    if (selected === '') {
      return;
    }

    setShowVs(false);
    toServer('arenaFight', { idx: selectedFighterIdx }, (data: any) => {});
  }, [fighters, selected]);

  const selectedFighter = fighters[selectedFighterIdx];

  function selectFighter(id: string) {
    setSelected(id);
    setShowVs(true);
  }

  function closeVs() {
    setSelected('');
    setShowVs(false);
  }

  function refreshFighters() {
    if (tickets > 0) {
      toServer('arenaRefresh', null, ({ tickets, fighters }: { tickets: number; fighters: any }) => {
        dispatch(setTickets(tickets));
        dispatch(setFights(fighters));
      });
    }
  }

  return (
    <GameContainer src="scenes/arena/arena-background.jpg">
      {bossFight ? <Backdrop /> : null}

      <div style={{ position: 'absolute', top: 100, left: 0 }}>
        <CDNImage
          src="scenes/arena/info-bar.png"
          style={{ position: 'absolute', top: 28, filter: 'drop-shadow(0px 0px 7px rgba(0, 0, 0, 255))' }}
        />
        <span className="test-text" style={{ position: 'absolute', top: 32, left: 51, width: 260, textAlign: 'center' }}>
          You have {tickets} fight tickets available.
        </span>
        <JButton size={{ width: 70, height: 22 }} position={{ x: 375, y: 30 }} text="Shop" onClick={() => setShowShop(!showShop)} />

        <CDNImage
          src="scenes/arena/info-bar.png"
          style={{ position: 'absolute', top: 62, filter: 'drop-shadow(0px 0px 7px rgba(0, 0, 0, 255))' }}
        />
        <span className="test-text" style={{ position: 'absolute', top: 65, left: 51, width: 260, textAlign: 'center' }}>
          Spend 1 ticket to refresh opponents.
        </span>
        <JButton
          size={{ width: 70, height: 22 }}
          position={{ x: 375, y: 65 }}
          text="Refresh"
          onClick={() => refreshFighters()}
          disabled={tickets <= 0}
        />

        <ArenaRow
          backgroundImage="scenes/arena/row-background-1.png"
          style={{ position: 'absolute', top: 110, left: 12 }}
          onClick={selectFighter}
          row={fighters.slice(0, 6)}
          cardRow={0}
        />
        <ArenaRow
          backgroundImage="scenes/arena/row-background-2.png"
          style={{ position: 'absolute', top: 195, left: 12 }}
          onClick={selectFighter}
          row={fighters.slice(6, 12)}
          cardRow={1}
        />
        <ArenaRow
          backgroundImage="scenes/arena/row-background-3.png"
          style={{ position: 'absolute', top: 283, left: 12 }}
          onClick={selectFighter}
          row={fighters.slice(12, 18)}
          cardRow={2}
        />
      </div>

      <ArenaProgressBar />

      <div style={{ position: 'absolute', bottom: 0, right: 0, display: 'grid', gridTemplateColumns: '150px 2fr' }}>
        <CDNImage
          src={`portraits/${userAvatar}.png`}
          style={{ position: 'absolute', right: 0, top: 13, transform: 'translate(0, -100%)', zIndex: 10 }}
        />

        <div style={{ display: 'grid', gridTemplateRows: 'repeat(3, 35px)', rowGap: 5 }}>
          <Button text="Swap Skills" onClick={() => dispatch(showSkills(true))} />
          <Button text="Swap Gear" onClick={() => (isInventoryVisible ? dispatch(hideInventory()) : dispatch(showInventory()))} />
          <Button text="Dummy Fight" onClick={() => setShowDummyFightMenu(!showDummyFightMenu)} />
          <Button text="Leave" onClick={leave} />
        </div>
        <div>
          <ArenaStats />
          <ArenaHistory />
        </div>
      </div>

      {showVs && (
        <ArenaVs
          onFight={startFight}
          onClose={closeVs}
          id={selectedFighter?.id}
          role={selectedFighter?.avatar}
          name={selectedFighter?.name}
          index={selectedFighterIdx}
        />
      )}

      <Leaderboard />

      <SkillMenu />
      {showShop && <PotShop onClose={() => setShowShop(false)} />}
      {isInventoryVisible && <Inventory />}
      {showDummyFightMenu && <DummyFightMenu onClose={() => setShowDummyFightMenu(false)} />}
    </GameContainer>
  );
};

export default Arena;
