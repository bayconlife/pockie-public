import { useState } from 'react';
import Panel from '../../components/Panel/Panel';
import JPanel from '../../components/UI/JPanel';
import { JTabbedPane } from '../../components/UI/JTabbedPane';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setSetting } from '../../slices/settingsSlice';
import { mute, setVolume } from '../../util/MusicPlayer';
import { PatchNotes } from './PatchNotes';

enum Tabs {
  SETTINGS = 'Settings',
  PATCH_NOTES = 'Patch Notes',
}

const tabs = [{ name: Tabs.SETTINGS }, { name: Tabs.PATCH_NOTES }];

export function Settings({ onClose }: { onClose: () => void }) {
  const dispatch = useAppDispatch();

  function _onClose() {
    localStorage.removeItem('settings-tab-open-patch-notes');
    dispatch(setSetting({ firstSet: true }));
    onClose();
  }

  let active = localStorage.getItem('settings-tab-open-patch-notes') !== null ? Tabs.PATCH_NOTES : Tabs.SETTINGS;

  return (
    <Panel name="Settings" onClose={_onClose}>
      <JPanel size={{ width: 400, height: 325 }}>
        <JTabbedPane size={{ width: 400, height: 300 }} tabs={tabs} active={active}>
          <JTabbedPane.Tab name={Tabs.SETTINGS}>
            <SettingsTab />
          </JTabbedPane.Tab>

          <JTabbedPane.Tab name={Tabs.PATCH_NOTES}>
            <PatchNotes />
          </JTabbedPane.Tab>
        </JTabbedPane>
      </JPanel>
    </Panel>
  );
}

function SettingsTab() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);

  const update = (partial: { [key: string]: any }) => dispatch(setSetting(partial));

  function _setVolume(e: React.ChangeEvent<HTMLInputElement>) {
    const volume = Math.min(Math.max(Number(e.target.value), 0), 100);

    dispatch(setSetting({ volume }));
    setVolume(volume);
  }

  return (
    <JPanel size={{ width: 400, height: 300 }} background="UIResource.Common.BigBG1">
      <div style={{ padding: 5 }}>
        Combat:
        <div>
          <input type="checkbox" checked={settings.originalDamage} onChange={() => update({ originalDamage: !settings.originalDamage })} />{' '}
          Original Damage Numbers
        </div>
        <div>
          Battle Font &nbsp;
          <select onChange={(v) => update({ font: v.target.value })} value={settings.font} disabled={settings.originalDamage}>
            <option value={'KOMIKAK'}>Komikak</option>
            <option value={'megadeth'}>Megadeth</option>
            <option value={'blackbox'}>Blackbox</option>
            <option value={'cooprblk'}>Cooprblk</option>
            <option value={'chowfun'}>Chowfun</option>
          </select>
        </div>
        <br /> Sound:
        <div>
          <input
            type="checkbox"
            checked={settings.mute}
            onChange={() => {
              update({ mute: !settings.mute });
              mute(!settings.mute);
            }}
          />{' '}
          Mute Music
          <br />
          Volume %{' '}
          <input
            type="number"
            min={0}
            max={100}
            value={settings.volume}
            disabled={settings.mute}
            onChange={_setVolume}
            style={{ width: 40 }}
          />
          <input
            type="range"
            min={0}
            max={100}
            value={settings.volume}
            disabled={settings.mute}
            onChange={_setVolume}
            style={{ width: 100, position: 'relative', top: 3 }}
          />
        </div>
      </div>
    </JPanel>
  );
}
