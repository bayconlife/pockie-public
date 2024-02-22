import { useState } from 'react';
import Panel from '../../components/Panel/Panel';
import { JButton } from '../../components/UI/JButton';
import JPanel from '../../components/UI/JPanel';
import { JProgressBar } from '../../components/UI/JProgressBar';
import { JTextField } from '../../components/UI/JTextField';
import { MultilineLabel } from '../../components/UI/MultilineLabel';
import { useAppSelector } from '../../hooks';
import useTranslator from '../../hooks/translate';
import { JLayout } from '../../components/UI/JLayout';
import { JImage } from '../../components/UI/JImage';
import { toServer } from '../../util/ServerSocket';

export function ExplorationV2({ onClose }: { onClose: () => void }) {
  const t = useTranslator();
  const [loading, setLoading] = useState(false);
  const characterLevel = useAppSelector((state) => state.stats.stats.level);
  const scene = useAppSelector((store) => store.scene.scene);
  const stats = useAppSelector((store) => store.character.exploration);

  const attemptsTotal = 7 + Math.floor(characterLevel / 10);
  const monstersBeaten = stats.scenes[scene]?.normal[0] ?? 0;
  const stars = stats.scenes[scene]?.normal[1] ?? 0;
  const starPercent = stars * 20 + ((stats.scenes[scene]?.normal[2] ?? 0) / (stats.scenes[scene]?.normal[3] ?? 1)) * 20;
  // const items = SERVER_CONFIG.EXPLORATION.cards[scene] ?? [];

  const percent = (monstersBeaten / 10) * 100;
  // const totalDropPercent = items.reduce((sum: number, item: any) => (sum += item.props?.rate ?? 0), 0);

  function explore() {
    setLoading(true);
    toServer('explore', null, () => {
      setLoading(false);
    });
  }

  return (
    <Panel name="Outdoor Exploration" onClose={onClose}>
      <JPanel layout={<JLayout />}>
        <JPanel size={{ width: 640, height: 26 }} background="UIResource.Common.BigBG1">
          <div style={{ padding: 5 }}>{t(`scene__${scene}--name`) + ' Exploration Zone'}</div>
          <MultilineLabel
            size={{ width: 630, height: 26 }}
            position={{ x: 0, y: 6 }}
            text={`${attemptsTotal - stats.attemptsToday}/${attemptsTotal}`}
            style={{ textAlign: 'right' }}
          />
        </JPanel>

        <JLayout horizontal>
          <JPanel size={{ width: 190, height: 308 }} background="UIResource.Common.BigBG1" padding={5} layout={<JLayout />}>
            <JPanel size={{ width: 136, height: 212 }} layout={<JLayout />}>
              <JPanel size={{ width: 136, height: 188 }} background="UIResource.OutSearch.pokeLarge" />
              <JButton
                size={{ width: 100, height: 22 }}
                onClick={explore}
                text="Explore"
                disabled={monstersBeaten < 10 || stats.attemptsToday >= attemptsTotal}
                loading={loading}
              />
            </JPanel>

            <JProgressBar size={{ width: 170, height: 18 }} progress={percent} title={`${monstersBeaten}/10`} />
            <JTextField size={{ width: 170, height: 50 }} text="Beat field monsters to fill up the bar then explore to get items." />
          </JPanel>

          <JPanel background="UIResource.Common.BigBG1" padding={5} layout={<JLayout />}>
            <JPanel size={{ width: 430, height: 20 }} background="UIResource.Common.BigBG3">
              <MultilineLabel
                size={{ width: 420, height: 18 }}
                position={{ x: 5, y: 2 }}
                text="Items that can be found every exploration."
              />
            </JPanel>

            <JPanel size={{ width: 420, height: 114 }} background="UIResource.Common.BigBG2" padding={8} style={{ marginBottom: 8 }}>
              <JLayout horizontal>
                <JPanel size={{ width: 62, height: 62 }} background="UIResource.Common.TextBG1">
                  <JImage src="ui/UIResource/Icon/IconOutSearch4.png" />
                </JPanel>
                <JPanel size={{ width: 62, height: 62 }} background="UIResource.Common.TextBG1">
                  <JImage src="ui/UIResource/Icon/IconOutSearch1.png" />
                </JPanel>
                <JPanel size={{ width: 62, height: 62 }} background="UIResource.Common.TextBG1">
                  <JImage src="ui/UIResource/Icon/IconOutSearch5.png" />
                </JPanel>
                <JPanel size={{ width: 62, height: 62 }} background="UIResource.Common.TextBG1">
                  <JImage src="ui/UIResource/Icon/IconOutSearch6.png" />
                </JPanel>
                <JPanel size={{ width: 62, height: 62 }} background="UIResource.Common.TextBG1">
                  <JImage src="ui/UIResource/Icon/IconOutSearch3.png" />
                </JPanel>
                <JPanel size={{ width: 62, height: 62 }} background="UIResource.Common.TextBG1">
                  <JImage src="ui/UIResource/Icon/IconOutSearch2.png" />
                </JPanel>
              </JLayout>
            </JPanel>

            <JPanel size={{ width: 430, height: 32 }} background="UIResource.Common.BigBG3">
              <MultilineLabel
                size={{ width: 420, height: 30 }}
                position={{ x: 5, y: 2 }}
                text="Exploration gives you star points which let you obtain items when a star is filled out."
              />
            </JPanel>

            <JPanel size={{ width: 420, height: 108 }} background="UIResource.Common.BigBG2" padding={8} layout={<JLayout />}>
              <JPanel size={{ width: 280, height: 20 }} background="UIResource.OutSearch.StarBG">
                <b style={{ fontFamily: 'Arial', fontSize: 10, position: 'absolute', top: 4, left: 3 }}>Completion Rate:</b>
                <div style={{ fontFamily: 'Arial', fontSize: 12, textAlign: 'right', paddingRight: 7, paddingTop: 3 }}>
                  {starPercent.toFixed(2) + '%'}
                </div>
                {[0, 1, 2, 3, 4].map((_: number, idx: number) => (
                  <JPanel
                    key={`star-${idx}`}
                    size={{ width: 12, height: 11 }}
                    position={{ x: 140 - (5 / 2) * 12 + idx * 12, y: 4 }}
                    background={idx < stars ? 'UIResource.OutSearch.BigStar' : 'UIResource.OutSearch.SmallStar'}
                  />
                ))}
              </JPanel>

              <JLayout horizontal>
                <JPanel size={{ width: 62, height: 62 }} background="UIResource.Common.TextBG1">
                  <JImage src="ui/UIResource/Icon/IconOutSearch8.png" />
                </JPanel>
                <JPanel size={{ width: 62, height: 62 }} background="UIResource.Common.TextBG1">
                  <JImage src="ui/UIResource/Icon/IconOutSearch7.png" />
                </JPanel>
                <JPanel size={{ width: 62, height: 62 }} background="UIResource.Common.TextBG1">
                  <JImage src="ui/UIResource/Icon/IconOutSearch6.png" />
                </JPanel>
              </JLayout>
            </JPanel>
          </JPanel>
        </JLayout>
      </JPanel>
    </Panel>
  );
}
