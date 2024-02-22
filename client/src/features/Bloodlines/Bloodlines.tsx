import { useState } from 'react';
import Panel from '../../components/Panel/Panel';
import JPanel from '../../components/UI/JPanel';
import { JScrollPane } from '../../components/UI/JScollPane';
import { useAppSelector } from '../../hooks';
import { Limit } from './Limits/Limit';
import { BloodlineContext } from './BloodlineContext';
import { ActiveLimits } from './Limits/ActiveLimits';
import { SelectedLimit } from './Limits/SelectedLimit';
import { Souls } from './Souls/Souls';
import { SERVER_CONFIG } from '../../util/serverConfig';

const WIDTH = 615;
const HEIGHT = 370;

export function Bloodlines({ onClose }: { onClose: () => void }) {
  const limits = useAppSelector((state) => state.character.bloodlines.limits);
  const c = useAppSelector((state) => state.character.bloodlines);
  const [selectedLimit, setSelectedLimit] = useState<number | null>(null);

  const bloodlines = SERVER_CONFIG.BLOODLINE.Limits;

  return (
    <BloodlineContext.Provider value={selectedLimit}>
      <Panel name="Bloodline Limits" onClose={onClose}>
        <JPanel width={WIDTH} height={HEIGHT} background="UIResource.Common.BigBG1" padding={5}>
          <JPanel width={85} height={HEIGHT - 10} background="UIResource.Common.BigBG3" padding={5}>
            <JScrollPane size={{ width: 75, height: HEIGHT - 20 }}>
              {Object.keys(bloodlines)
                .sort((k1, k2) => bloodlines[k1].level - bloodlines[k2].level)
                .map((item: any, idx) => (
                  <JPanel
                    key={idx}
                    className={!!limits[item] && 'clickable'}
                    size={{ width: 50, height: 50 }}
                    background="UIResource.Common.BigBG5"
                    padding={2}
                    onClick={() => {
                      if (!limits[item]) {
                        return;
                      }

                      setSelectedLimit(item);
                    }}
                    style={{ marginBottom: 5 }}>
                    <Limit id={item} disabled={!limits[item]} />
                  </JPanel>
                ))}
            </JScrollPane>
          </JPanel>

          <JPanel x={90} width={220} height={HEIGHT - 10} background="UIResource.Common.BigBG3" padding={5}>
            <ActiveLimits onClick={(id) => setSelectedLimit(id)} />

            <JPanel size={{ width: 185, height: 2 }} position={{ x: 10, y: 60 }} background="UIResource.Common.PartitionYellow" />

            <JPanel y={75} width={210}>
              <SelectedLimit limit={selectedLimit} />
            </JPanel>
          </JPanel>

          <JPanel x={315} width={290} height={HEIGHT - 10} background="UIResource.Common.BigBG3" padding={5}>
            <Souls />
          </JPanel>
        </JPanel>
      </Panel>
    </BloodlineContext.Provider>
  );
}
