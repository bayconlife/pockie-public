import { useEffect } from 'react';
import GameContainer from '../../components/GameContainer';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { switchState } from '../../slices/stateSlice';
import { SiteState } from '../../enums';
import { batch } from 'react-redux';
import { setCharacterData } from '../../slices/characterSlice';
import { setItems } from '../../slices/inventorySlice';
import { setQuests } from '../../slices/questsSlice';
import { setEquippedSkills, setKnownSkills } from '../../slices/skillsSlice';
import { setStats } from '../../slices/statSlice';
import { setDisplayName, setSlotFight, setHomeVillage, setMultiFight } from '../../slices/uiSlice';
import { setArenaStats } from '../../slices/arenaSlice';
import { setServerConfig } from '../../util/serverConfig';
import { setPartyId } from '../../slices/partySlice';
import { LoadState, setId, setLoadState, setServerId, setServerVersion } from '../../slices/accountSlice';
import { setExploration, setHunt } from '../../slices/fieldSlice';
import { setAssetConfig } from '../../util/assetConfig';
import { Spinner } from '../../components/Spinner';
import { CenterContainer } from '../../components/CenterContainer/CenterContainer';
import { cancelFromServer, connectWithJWT, fromServer, toServer } from '../../util/ServerSocket';
import { setStones } from '../../slices/currencySlice';

export function GameLoader() {
  const dispatch = useAppDispatch();
  const loadState = useAppSelector((state) => state.account.loading);

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    const onLoad = (character: any) => {
      batch(() => {
        console.log(character);
        dispatch(setArenaStats(character.arena));
        dispatch(setCharacterData(character));
        dispatch(setDisplayName(character.displayName));
        dispatch(setEquippedSkills(character.skills));
        dispatch(setExploration(character.exploration));
        dispatch(setHomeVillage(character.homeVillage));
        dispatch(setHunt(character.hunt));
        dispatch(setId(character.accountId));
        dispatch(setItems(character.items));
        dispatch(setKnownSkills(character.skillsKnown));
        dispatch(setMultiFight(character.multiFight));
        dispatch(setPartyId(character.party));
        dispatch(setQuests(character.quests));
        dispatch(setServerId(character.serverId));
        dispatch(setServerVersion(character.serverVersion));
        dispatch(setSlotFight(character.slotFights));
        dispatch(setStats(character.stats));
        dispatch(setStones(character.stones));
      });

      Object.keys(character.serverConfig).forEach((key) => {
        setServerConfig(key.toUpperCase(), character.serverConfig[key]);
      });

      Promise.all([
        fetch(`${process.env.REACT_APP_CDN_PATH}scenes/npcs.json`)
          .then((r) => r.json())
          .then((d) => setAssetConfig('SCENE_NPCS', d))
          .catch((e) => console.error(e)),
        fetch(`json/items.json`)
          .then((r) => r.json())
          .then((d) => setAssetConfig('ITEMS', d))
          .catch((e) => console.error(e)),
      ]).finally(() => dispatch(setLoadState(LoadState.LOADED)));
    };

    fromServer('loadData', onLoad);

    if (jwt === null) {
      dispatch(switchState(SiteState.LANDING));
    } else {
      dispatch(setLoadState(LoadState.LOADING));
      connectWithJWT(jwt);
    }

    return () => {
      cancelFromServer('loadData');
    };
  }, [dispatch]);

  useEffect(() => {
    if (loadState === LoadState.LOADED) {
      dispatch(switchState(SiteState.GAME));
      toServer('sceneGoToCurrent');
    }
  }, [loadState, dispatch]);

  return (
    <>
      <GameContainer src="scenes/loading.png"></GameContainer>

      <CenterContainer>
        <div>Loading Character Data</div>
        <div style={{ position: 'relative', left: '50%', transform: 'translateX(-25px)' }}>
          <Spinner width={50} />
        </div>
      </CenterContainer>
    </>
  );
}
