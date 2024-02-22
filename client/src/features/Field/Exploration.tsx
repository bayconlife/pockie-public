import Panel from '../../components/Panel/Panel';
import { JButton } from '../../components/UI/JButton';
import JPanel from '../../components/UI/JPanel';
import { JProgressBar } from '../../components/UI/JProgressBar';
import { JTextField } from '../../components/UI/JTextField';
import { MultilineLabel } from '../../components/UI/MultilineLabel';
import { useAppSelector } from '../../hooks';
import useTranslator from '../../hooks/translate';
import { SERVER_CONFIG } from '../../util/serverConfig';
import { DisplayGrid } from '../../components/Grid/DisplayGrid';
import { Item } from '../../components/Item';
import { IItem } from '../../slices/inventorySlice';
import { Label } from '../../components/UI/Label';
import { JPagination } from '../../components/UI/JPagination';
import { JLayout } from '../../components/UI/JLayout';
import { toServer } from '../../util/ServerSocket';

export function Exploration({ onClose }: { onClose: () => void }) {
  const t = useTranslator();
  const scene = useAppSelector((store) => store.scene.scene);
  const stats = useAppSelector((store) => store.field.exploration[scene]) ?? [0, 0, 0];
  const monstersBeaten = stats[0] ?? 0;
  const timesExplored = stats[1] ?? 0;
  const redeemed = stats[2] ?? 0;
  const starRewards = SERVER_CONFIG.EXPLORATION.starRewards[scene] ?? [];
  const starRates = SERVER_CONFIG.EXPLORATION.starRates[scene] ?? 1;
  const items = SERVER_CONFIG.EXPLORATION.cards[scene] ?? [];

  const percent = (monstersBeaten / 10) * 100;
  const totalDropPercent = items.reduce((sum: number, item: any) => (sum += item.props?.rate ?? 0), 0);

  function explore() {
    toServer('explore');
  }

  function collect() {
    toServer('exploreCollect');
  }

  return (
    <Panel name="Outdoor Exploration" onClose={onClose}>
      <JPanel layout={<JLayout />}>
        <JPanel size={{ width: 640, height: 26 }} background="UIResource.Common.BigBG1">
          <div style={{ padding: 5 }}>{t(`scene__${scene}--name`) + ' Exploration Zone'}</div>
          <MultilineLabel
            size={{ width: 630, height: 26 }}
            position={{ x: 0, y: 6 }}
            text={`${monstersBeaten}/10`}
            style={{ textAlign: 'right' }}
          />
        </JPanel>

        <JLayout horizontal>
          <JPanel size={{ width: 190, height: 326 }} background="UIResource.Common.BigBG1" padding={5} layout={<JLayout />}>
            <JPanel size={{ width: 136, height: 230 }} layout={<JLayout />}>
              <JPanel size={{ width: 136, height: 188 }} background="UIResource.OutSearch.Poke" />
              <JButton size={{ width: 100, height: 22 }} onClick={explore} text="Explore" disabled={monstersBeaten < 10} />
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

            <JPanel size={{ width: 420, height: 114 }} background="UIResource.Common.BigBG2" padding={8}>
              <JPagination
                perPage={5}
                items={items}
                render={(items) => (
                  <JLayout horizontal>
                    {items.map((item, idx) => (
                      <JPanel size={{ width: 64, height: 75 }} key={idx}>
                        <DisplayGrid size={{ width: 2, height: 2 }}>
                          {item && <Item item={item} style={{ position: 'relative', top: 0, left: 0 }} onClick={() => {}} />}
                        </DisplayGrid>
                        <Label
                          position={{ x: 0, y: 62 }}
                          style={{ width: 63, textAlign: 'center', fontSize: '0.75rem' }}
                          text={(((item?.props?.rate ?? 0) / totalDropPercent) * 100).toFixed(2) + '%'}
                        />
                      </JPanel>
                    ))}
                  </JLayout>
                )}
              />
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
                <div style={{ fontFamily: 'Arial', fontSize: 12, textAlign: 'right', paddingRight: 7, paddingTop: 3 }}>
                  {(((timesExplored * starRates) / starRewards.length) * 100).toFixed(2) + '%'} ({timesExplored}/
                  {starRewards.length / starRates})
                </div>
                {starRewards.map((_: number, idx: number) => (
                  <JPanel
                    key={`star-${idx}`}
                    size={{ width: 12, height: 11 }}
                    position={{ x: 140 - (starRewards.length / 2) * 12 + idx * 12, y: 4 }}
                    background={
                      Math.floor(((timesExplored * starRates) / starRewards.length) * 100) >= (idx + 1) * 20
                        ? 'UIResource.OutSearch.BigStar'
                        : 'UIResource.OutSearch.SmallStar'
                    }
                  />
                ))}
              </JPanel>

              <JLayout horizontal>
                {starRewards.map((item: IItem, idx: number) => (
                  <DisplayGrid key={idx} size={{ width: 2, height: 2 }}>
                    <Item item={item} style={{ filter: idx < redeemed ? 'grayscale(1)' : '' }} onClick={() => {}} />
                  </DisplayGrid>
                ))}
              </JLayout>
            </JPanel>

            <JButton
              size={{ width: 100, height: 22 }}
              onClick={collect}
              text="Collect"
              disabled={redeemed >= Math.floor(timesExplored * starRates)}
            />
          </JPanel>
        </JLayout>
      </JPanel>
    </Panel>
  );
}
