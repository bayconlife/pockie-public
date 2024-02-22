import * as React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { switchState } from '../../slices/stateSlice';
import { Landing } from '../Landing/Landing';
import { hideMap } from '../../slices/mapSlice';
import { SiteState } from '../../enums';
import { addPlayer, clearScene, removePlayer, setScene } from '../../slices/sceneSlice';
import { batch } from 'react-redux';
import { setStats } from '../../slices/statSlice';
import { patchInventory, setItems } from '../../slices/inventorySlice';
import { setKnownSkills } from '../../slices/skillsSlice';
import { setQuests } from '../../slices/questsSlice';
import { setShops } from '../../slices/shopSlice';
import { setHomeVillage, setMultiFight, setSlotFight } from '../../slices/uiSlice';
import { setDungeon } from '../../slices/dungeonSlice';
import { setMedals, setPots, setHistory } from '../../slices/arenaSlice';
import { play } from '../../util/MusicPlayer';
import { setCharacterPartial } from '../../slices/characterSlice';
import { setParty } from '../../slices/partySlice';
import { GameLoader } from '../GameLoader/GameLoader';
import { Game } from '../Game/Game';
import { cancelFromServer, fromServer, logOff, toServer } from '../../util/ServerSocket';
import { setStones } from '../../slices/currencySlice';

const SiteStateFactory: React.FC<{}> = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.state.state);

  React.useEffect(() => {
    fromServer('addPlayerToScene', (data) => dispatch(addPlayer(data)));
    fromServer('inventoryPatch', (data) => dispatch(patchInventory(data)));
    fromServer('partyUpdate', (party) => dispatch(setParty(party)));
    fromServer('removePlayerFromScene', (data) => dispatch(removePlayer(data)));
    fromServer('updateCharacter', (data) => dispatch(setCharacterPartial(data)));
    fromServer('updateDungeon', (data) => dispatch(setDungeon(data)));
    fromServer('updateItems', (data) => dispatch(setItems(data)));
    fromServer('updateMultiFight', (data) => dispatch(setMultiFight(data)));
    fromServer('updateVillageSelection', (data) => dispatch(setHomeVillage(data)));
    fromServer('updateShops', (data) => dispatch(setShops(data)));
    fromServer('updatePotShops', (data) => dispatch(setPots(data)));
    fromServer('updateSkillsKnown', (data) => dispatch(setKnownSkills(data)));
    fromServer('updateSlots', (data) => dispatch(setSlotFight(data)));
    fromServer('updateStats', (data) => dispatch(setStats(data)));
    fromServer('updateStones', (data) => dispatch(setStones(data)));
    fromServer('updateMedals', (data) => dispatch(setMedals(data)));
    fromServer('updateQuests', (data) => dispatch(setQuests(data)));
    fromServer('relog', () => {
      logOff();
      batch(() => {
        dispatch(clearScene());
        dispatch(switchState(SiteState.LANDING));
      });
    });
    fromServer('updateArenaHistory', (data) => dispatch(setHistory(data)));
    fromServer('requestSwitchScene', (scene) => toServer('switchScene', scene));
    fromServer('switchScene', (data) => {
      batch(() => {
        dispatch(hideMap());
        dispatch(setScene(data));
        play(data.scene);
      });
    });

    return () => {
      cancelFromServer('addPlayerToScene');
      cancelFromServer('inventoryPatch');
      cancelFromServer('partyUpdate');
      cancelFromServer('removePlayerFromScene');
      cancelFromServer('updateCharacter');
      cancelFromServer('updateDungeon');
      cancelFromServer('updateItems');
      cancelFromServer('updateMultiFight');
      cancelFromServer('updateParty');
      cancelFromServer('updateVillageSelection');
      cancelFromServer('updateShops');
      cancelFromServer('updatePotShops');
      cancelFromServer('updateSkillsKnown');
      cancelFromServer('updateSlots');
      cancelFromServer('updateStats');
      cancelFromServer('updateStones');
      cancelFromServer('updateMedals');
      cancelFromServer('updateQuests');
      cancelFromServer('relog');
      cancelFromServer('requestSwitchScene');
      cancelFromServer('switchScene');
    };
  }, [dispatch]);

  function getContent() {
    switch (state) {
      case SiteState.GAME:
        return <Game />;
      case SiteState.GAME_LOADER:
        return <GameLoader />;
      default:
        return <Landing />;
    }
  }

  const content = React.useMemo(getContent, [state]);

  return content;
};

export default SiteStateFactory;
