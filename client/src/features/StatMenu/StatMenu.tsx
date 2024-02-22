import * as React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import Panel from '../../components/Panel/Panel';
import JPanel from '../../components/UI/JPanel';
import { hideStats, setStats } from '../../slices/statSlice';
import { JTextField } from '../../components/UI/JTextField';
import { MultilineLabel } from '../../components/UI/MultilineLabel';
import { Label } from '../../components/UI/Label';
import { JProgressBar } from '../../components/UI/JProgressBar';
import useTranslator from '../../hooks/translate';
import { SERVER_CONFIG } from '../../util/serverConfig';
import { CDNImage } from '../../components/Elements/Image';
import { toServer } from '../../util/ServerSocket';

const labelStyle: React.CSSProperties = {
  fontWeight: 'bold',
  textAlign: 'right',
  paddingTop: 3,
  fontSize: 11,
};

export const StatMenu: React.FC<{}> = () => {
  const t = useTranslator();

  const dispatch = useAppDispatch();
  const name = useAppSelector((store) => store.character.displayName);
  const stats = useAppSelector((store) => store.stats.stats);
  const currentTitle = useAppSelector((state) => state.stats.stats.title ?? 0);
  const village = useAppSelector((state) => state.ui.homeVillage);

  React.useEffect(() => {
    toServer('stats', {}, (stats: any) => {
      dispatch(setStats(stats));
    });
  }, []);

  const expPerLevel = SERVER_CONFIG.LEVELING.expPerLevel;
  const expForLevel = expPerLevel[stats.level];
  const expToLevel = expPerLevel[stats.level + 1];

  const percent = Math.floor(((stats.exp - expForLevel) / (expToLevel - expForLevel)) * 100);
  const isMaxLevel = stats.level >= (SERVER_CONFIG.LEVELING?.max ?? 99);

  return (
    <Panel name="Stats" onClose={() => dispatch(hideStats())}>
      <JPanel size={{ width: 318, height: 410 }}>
        <JPanel size={{ width: 318, height: 40 }} background="UIResource.Common.BigBG7">
          <CDNImage
            src={`titles/${currentTitle}.gif`}
            style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}
            alt={`Title ${currentTitle}`}
          />
        </JPanel>

        <JPanel size={{ width: 318, height: 100 }} position={{ x: 0, y: 45 }} background="UIResource.Common.BigBG1">
          <MultilineLabel size={{ width: 50, height: 20 }} position={{ x: 0, y: 6 }} text={'Name'} style={labelStyle} />
          <JTextField size={{ width: 100, height: 20 }} position={{ x: 50, y: 6 }} text={name} />

          <MultilineLabel size={{ width: 50, height: 20 }} position={{ x: 150, y: 6 }} text={'Level'} style={labelStyle} />
          <JTextField size={{ width: 100, height: 20 }} position={{ x: 200, y: 6 }} text={stats.level.toString()} />

          <JPanel size={{ width: 298, height: 2 }} position={{ x: 10, y: 30 }} background="UIResource.Common.PartitionYellow" />

          <MultilineLabel size={{ width: 50, height: 20 }} position={{ x: 0, y: 37 }} text={'Village'} style={labelStyle} />
          <JTextField size={{ width: 100, height: 20 }} position={{ x: 50, y: 37 }} text={t(`scene__${village}--name`).split(' ')[0]} />

          <MultilineLabel size={{ width: 50, height: 20 }} position={{ x: 150, y: 37 }} text={'Rank'} style={labelStyle} />
          <JTextField size={{ width: 100, height: 20 }} position={{ x: 200, y: 37 }} text="" />

          <JPanel size={{ width: 100, height: 15 }} position={{ x: 200, y: 34 }}>
            <div style={{ textAlign: 'center', fontSize: 14, color: 'darkblue', fontFamily: 'KOMIKAK' }}>{t(`rank__${stats.rank}`)}</div>
          </JPanel>

          <JPanel size={{ width: 298, height: 2 }} position={{ x: 10, y: 62 }} background="UIResource.Common.PartitionYellow" />

          {/* <MultilineLabel size={{ width: 50, height: 20 }} position={{ x: 0, y: 70 }} text={'State'} style={labelStyle} />
          <JTextField size={{ width: 100, height: 20 }} position={{ x: 50, y: 70 }} text="State" /> */}

          {/* <MultilineLabel size={{ width: 50, height: 20 }} position={{ x: 150, y: 70 }} text={'Type'} style={labelStyle} />
          <JTextField size={{ width: 100, height: 20 }} position={{ x: 200, y: 70 }} text="Weapon Type" /> */}

          {/* <JPanel size={{ width: 298, height: 2 }} position={{ x: 10, y: 94 }} background="UIResource.Common.PartitionYellow" /> */}
          <MultilineLabel size={{ width: 50, height: 20 }} position={{ x: 0, y: 70 }} text={'Exp'} style={labelStyle} />
          {isMaxLevel ? (
            <div
              className="text-outline"
              style={{
                position: 'absolute',
                top: 62,
                width: '100%',
                textAlign: 'center',
                fontFamily: 'KOMIKAK',
                fontSize: 22,
                color: 'darkgreen',
              }}>
              MAX
            </div>
          ) : (
            <JProgressBar
              size={{ width: 249, height: 18 }}
              position={{ x: 51, y: 71 }}
              progress={percent}
              title={`${stats.exp} / ${stats.expToLevel}`}
            />
          )}
        </JPanel>

        <JPanel size={{ width: 318, height: 260 }} position={{ x: 0, y: 150 }} background="UIResource.Common.BigBG1">
          <MultilineLabel size={{ width: 50, height: 20 }} position={{ x: 0, y: 6 }} text={'Str'} style={labelStyle} />
          <JTextField size={{ width: 100, height: 20 }} position={{ x: 50, y: 6 }} text={stats.str.toString()} />

          <MultilineLabel size={{ width: 50, height: 20 }} position={{ x: 150, y: 6 }} text={'Attack'} style={labelStyle} />
          <JTextField size={{ width: 100, height: 20 }} position={{ x: 200, y: 6 }} text={`${stats.minAttack} - ${stats.maxAttack}`} />

          <MultilineLabel size={{ width: 50, height: 20 }} position={{ x: 150, y: 30 }} text={'Block'} style={labelStyle} />
          <JTextField
            size={{ width: 100, height: 20 }}
            position={{ x: 200, y: 30 }}
            text={stats.parry.toString()}
            title={`+${(stats.parry / 16).toFixed(2)}% chance to reduce damage by 40%\nReduced by targets Pierce`}
          />

          <JPanel size={{ width: 298, height: 2 }} position={{ x: 10, y: 54 }} background="UIResource.Common.PartitionYellow" />

          <MultilineLabel size={{ width: 50, height: 20 }} position={{ x: 0, y: 61 }} text={'Agi'} style={labelStyle} />
          <JTextField size={{ width: 100, height: 20 }} position={{ x: 50, y: 61 }} text={stats.agi.toString()} />

          <MultilineLabel size={{ width: 50, height: 20 }} position={{ x: 150, y: 61 }} text={'Speed'} style={labelStyle} />
          <JTextField
            size={{ width: 100, height: 20 }}
            position={{ x: 200, y: 61 }}
            text={`${(stats.speed / 1000).toFixed(2)}`}
            title={`Flat value: ${stats.speed}. \nTake turn every ${(5 / (stats.speed / 1000)).toFixed(2)} seconds of combat.`}
          />

          <MultilineLabel size={{ width: 50, height: 20 }} position={{ x: 150, y: 86 }} text={'Dodge'} style={labelStyle} />
          <JTextField
            size={{ width: 100, height: 20 }}
            position={{ x: 200, y: 86 }}
            text={stats.dodge.toString()}
            title={`+${(stats.dodge / 16).toFixed(2)}% chance to avoid damage\nReduced by targets Hit`}
          />

          <JPanel size={{ width: 298, height: 2 }} position={{ x: 10, y: 110 }} background="UIResource.Common.PartitionYellow" />

          <MultilineLabel size={{ width: 50, height: 20 }} position={{ x: 0, y: 117 }} text={'Sta'} style={labelStyle} />
          <JTextField size={{ width: 100, height: 20 }} position={{ x: 50, y: 117 }} text={stats.sta.toString()} />

          <MultilineLabel size={{ width: 50, height: 20 }} position={{ x: 150, y: 117 }} text={'Hp'} style={labelStyle} />
          <JTextField size={{ width: 100, height: 20 }} position={{ x: 200, y: 117 }} text={`${stats.hp}/${stats.maxHp}`} />

          <MultilineLabel size={{ width: 50, height: 20 }} position={{ x: 150, y: 142 }} text={'Chakra'} style={labelStyle} />
          <JTextField size={{ width: 100, height: 20 }} position={{ x: 200, y: 142 }} text={stats.maxChakra.toString()} />

          <JPanel size={{ width: 298, height: 2 }} position={{ x: 10, y: 166 }} background="UIResource.Common.PartitionYellow" />

          <MultilineLabel
            size={{ width: 50, height: 20 }}
            position={{ x: 0, y: 173 }}
            text={'Pierce'}
            style={labelStyle}
            title="Reduces enemy block %"
          />
          <JTextField
            size={{ width: 100, height: 20 }}
            position={{ x: 50, y: 173 }}
            text={stats.pierce.toString()}
            title={`-${(stats.pierce / 16).toFixed(2)}% enemy block chance`}
          />

          <MultilineLabel
            size={{ width: 50, height: 20 }}
            position={{ x: 150, y: 173 }}
            text={'Hit'}
            style={labelStyle}
            title="Reduces enemy dodge"
          />
          <JTextField
            size={{ width: 100, height: 20 }}
            position={{ x: 200, y: 173 }}
            text={stats.hit.toString()}
            title={`-${(stats.hit / 16).toFixed(2)}% enemy chance to avoid damage`}
          />

          <MultilineLabel
            size={{ width: 50, height: 20 }}
            position={{ x: 0, y: 199 }}
            text={'Defense'}
            style={labelStyle}
            title="Reduces damage taken"
          />
          <JTextField
            size={{ width: 100, height: 20 }}
            position={{ x: 50, y: 199 }}
            text={stats.defense.toString()}
            title={`-${((stats.defense / (stats.defense + 1354)) * 100).toFixed(2)}% damage taken`}
          />

          <MultilineLabel
            size={{ width: 50, height: 20 }}
            position={{ x: 150, y: 199 }}
            text={'Break'}
            style={labelStyle}
            title="Reduces enemy defense. Can reduce below 0 for extra damage"
          />
          <JTextField
            size={{ width: 100, height: 20 }}
            position={{ x: 200, y: 199 }}
            text={stats.defenseBreak.toString()}
            title={`+${((stats.defenseBreak / (stats.defenseBreak + 1354)) * 100).toFixed(2)}% enemy damage taken`}
          />

          <MultilineLabel
            size={{ width: 50, height: 20 }}
            position={{ x: 0, y: 225 }}
            text={'Crit'}
            style={labelStyle}
            title="Increases crit % and crit damage"
          />
          <JTextField
            size={{ width: 100, height: 20 }}
            position={{ x: 50, y: 225 }}
            text={stats.critical.toString()}
            title={`+${(stats.critical / 16).toFixed(2)}% crit chance \n+${(stats.critical / 8).toFixed(2)}% crit damage`}
          />

          <MultilineLabel
            size={{ width: 50, height: 20 }}
            position={{ x: 150, y: 225 }}
            text={'Const'}
            style={labelStyle}
            title="Reduces enemy crit % and crit damage"
          />
          <JTextField
            size={{ width: 100, height: 20 }}
            position={{ x: 200, y: 225 }}
            text={stats.con.toString()}
            title={`-${(stats.con / 16).toFixed(2)}% enemy crit chance \n-${(stats.con / 8).toFixed(2)}% enemy crit damage`}
          />

          <Label position={{ x: 5, y: 240 }} style={labelStyle} text="Hover over stats to get detailed information." />
        </JPanel>
      </JPanel>
    </Panel>
  );
};
