import * as React from 'react';
import { useAppSelector } from '../../../hooks';
import JPanel from '../../UI/JPanel';
import { MultilineLabel } from '../../UI/MultilineLabel';
import { JButton } from '../../UI/JButton';
import Panel from '../../Panel/Panel';
import { useTranslation } from 'react-i18next';
import { getItemName } from '../../../resources/Items';
import { compressToEncodedURIComponent } from 'lz-string';

export const FightResult: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useTranslation();
  const fight = useAppSelector((state) => state.fight.fight);
  const rewards = useAppSelector((state) => state.fight.rewards);
  let rewardText = '';

  function shareBattle() {
    const compressed = compressToEncodedURIComponent(JSON.stringify(fight));

    if (compressed.length < 2400) {
      const url = window.location.href + '?access=replay&&data=' + compressed;
      navigator.clipboard.writeText(url);

      alert('Copied the url to clipboard');
    } else {
      navigator.clipboard.writeText(compressed);
      alert(
        'Fight data is too large to create url. Navigate to ' +
          window.location.href +
          '?access=replay and add the copied data to the input box.'
      );
    }
  }

  if (rewards === null) {
    return null;
  }

  if (rewards != undefined) {
    rewardText = Object.entries(rewards)
      .filter(([key, value]) => !['items'].includes(key))
      .map(([name, reward]) => {
        return `${name.toUpperCase()}: ${reward}`;
      })
      .join('\n');
  }

  return (
    <Panel name="Combat Results" moveable={false} style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      <JPanel size={{ width: 420, height: 262 }}>
        <JPanel size={{ width: 420, height: 230 }} background="UIResource.Common.BigBG1">
          <JPanel size={{ width: 300, height: 40 }} position={{ x: 8, y: 8 }} background="UIResource.Common.BigBG3">
            <MultilineLabel size={{ width: 300, height: 40 }} text=""></MultilineLabel>
          </JPanel>

          <JPanel size={{ width: 300, height: 80 }} position={{ x: 8, y: 55 }} background="UIResource.Common.BigBG3">
            <MultilineLabel size={{ width: 300, height: 80 }} text=""></MultilineLabel>
          </JPanel>

          <JPanel size={{ width: 300, height: 80 }} position={{ x: 8, y: 140 }} background="UIResource.Common.BigBG3">
            <MultilineLabel size={{ width: 300, height: 80 }} position={{ x: 2, y: 2 }} text="">
              {rewardText + '\n'}
              {rewards?.items
                ?.map((item: number | number[]) => {
                  if (Array.isArray(item)) {
                    return `${getItemName(item[0])} for ${item[1]}`;
                  }

                  return `${getItemName(item)}`;
                })
                .join('\n')}
            </MultilineLabel>
          </JPanel>

          <JButton size={{ width: 85, height: 22 }} position={{ x: 320, y: 15 }} disabled text="Save Battle" />
          <JButton size={{ width: 85, height: 22 }} position={{ x: 320, y: 45 }} onClick={shareBattle} text="Share Battle" />
          <JButton size={{ width: 85, height: 22 }} position={{ x: 320, y: 75 }} disabled text="" />
          <JButton size={{ width: 85, height: 22 }} position={{ x: 320, y: 105 }} disabled text="" />

          <JPanel size={{ width: 63, height: 63 }} position={{ x: 331, y: 147 }} background="UIResource.Icon.Grid_HeadPortraitBase2">
            <JPanel size={{ width: 52, height: 52 }} position={{ x: 6, y: 6 }}></JPanel>
          </JPanel>
        </JPanel>

        <JButton size={{ width: 100, height: 22 }} position={{ x: 30, y: 240 }} disabled text="Replay Battle" />
        <JButton size={{ width: 100, height: 22 }} position={{ x: 163, y: 240 }} disabled text="" />
        <JButton size={{ width: 100, height: 22 }} position={{ x: 290, y: 240 }} onClick={onClose} text="Close" />
      </JPanel>
    </Panel>
  );
};
