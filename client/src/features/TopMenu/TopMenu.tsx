import * as React from 'react';
import { NineSlice } from '../../components/NineSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { MultilineLabel } from '../../components/UI/MultilineLabel';
import { JButton } from '../../components/UI/JButton';
import { Settings } from '../Settings/Settings';
import { setSetting } from '../../slices/settingsSlice';
import { mute } from '../../util/MusicPlayer';
import { Portrait } from './Portrait';
import { CDNImage } from '../../components/Elements/Image';
import TopMenuBG from '../../assets/UIResource/TopMenu/backdrop.png';
import { switchState } from '../../slices/stateSlice';
import { SiteState } from '../../enums';
import { logOff, toServer } from '../../util/ServerSocket';
import { hideCodex, showCodex } from '../../slices/panelSlice';
import { Codex } from './Codex';
import { Ping } from './Ping';

export const TopMenu: React.FC<{}> = ({}) => {
  const dispatch = useAppDispatch();
  const stones = useAppSelector((state) => state.currency.stones);
  const settingsFirstSet = useAppSelector((state) => state.settings.firstSet);
  const isMuted = useAppSelector((state) => state.settings.mute);
  const currency = useAppSelector((state) => state.character.currency);
  const serverId = useAppSelector((state) => state.account.serverId);
  const serverVersion = useAppSelector((state) => state.account.version);
  const isCodexOpen = useAppSelector((state) => state.panels.codex);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(!settingsFirstSet);

  React.useEffect(() => {
    const ver = localStorage.getItem(`server-${serverId}-version`);

    if (ver !== serverVersion) {
      localStorage.setItem(`server-${serverId}-version`, serverVersion);
      localStorage.setItem(`settings-tab-open-patch-notes`, '');
      setIsSettingsOpen(true);
    }
  }, [serverId, serverVersion]);

  function setMute(_mute: boolean) {
    dispatch(setSetting({ mute: _mute }));
    mute(_mute);
  }

  return (
    <>
      <div style={{ position: 'absolute', top: 1, left: 1, width: 'calc(100% - 7px)', height: 33 }}>
        <div style={{ position: 'relative' }}>
          <NineSlice url={TopMenuBG} slice={[8, 20]} style={{ width: '100%', height: 24, position: 'absolute', top: 0 }} />
          <CDNImage src={'features/top-menu/stone.png'} style={{ position: 'absolute', top: 2, left: 4 }} />
          <MultilineLabel
            size={{ width: 80, height: 15 }}
            position={{ x: 30, y: 6 }}
            text={stones ? stones.toString() : '0'}
            style={{ color: 'whitesmoke', textAlign: 'right' }}
          />
          <CDNImage src={'features/top-menu/coupon.png'} style={{ position: 'absolute', top: 2, left: 125 }} />
          <MultilineLabel
            size={{ width: 80, height: 15 }}
            position={{ x: 150, y: 6 }}
            text={currency.giftCertificates.toString()}
            style={{ color: 'whitesmoke', textAlign: 'right' }}
          />
        </div>
        <div style={{ position: 'absolute', right: 1, top: 3, display: 'flex', gap: 5 }}>
          <Ping />
          <div style={{ width: 22, height: 22, position: 'relative', top: 2 }}>
            {isMuted ? (
              <CDNImage src={`features/top-menu/sound-off.png`} width={17} height={18} onClick={() => setMute(false)} />
            ) : (
              <CDNImage src={`features/top-menu/sound-on.png`} width={22} height={18} onClick={() => setMute(true)} />
            )}
          </div>
          <JButton text="Codex" onClick={() => dispatch(isCodexOpen ? hideCodex() : showCodex())} />
          <JButton text="Settings" onClick={() => setIsSettingsOpen(!isSettingsOpen)} />
          <JButton
            text="Log Off"
            onClick={() => {
              dispatch(switchState(SiteState.LANDING));
              logOff();
            }}
          />
        </div>
        <Portrait />
      </div>
      {isSettingsOpen && <Settings onClose={() => setIsSettingsOpen(false)} />}
      <Codex />
    </>
  );
};
