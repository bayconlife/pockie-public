import * as React from 'react';
import Panel from '../../components/Panel/Panel';
import { JButton } from '../../components/UI/JButton';
import JPanel from '../../components/UI/JPanel';
import { MultilineLabel } from '../../components/UI/MultilineLabel';
import useTranslator from '../../hooks/translate';
import { CDNImage } from '../../components/Elements/Image';
import { toServer } from '../../util/ServerSocket';

interface Info {
  current: number;
  attemptsLeft: number;
  exp: number;
  nextExp: number;
}

export const LasNochesPrompt: React.FC<{}> = ({}) => {
  const t = useTranslator();

  const [info, setInfo] = React.useState<Info>({ current: -1, attemptsLeft: 0, exp: 0, nextExp: 0 });
  const [disableStart, setDisableStart] = React.useState(false);

  React.useEffect(() => {
    // if (!show) {
    toServer('lasNochesInfo', null, (data: Info) => setInfo(data));
    // }
  }, []);

  return (
    <Panel name={t(`npc__${17003}--name`)} moveable={false}>
      <JPanel size={{ width: 476, height: 249 }}>
        <JPanel size={{ width: 161, height: 204 }} background="UIResource.NPC.TottomBG1">
          <JPanel size={{ width: 137, height: 182 }} position={{ x: 13, y: 13 }} background="UIResource.NPC.EstopCircle" />
          <JPanel size={{ width: 135, height: 180 }} position={{ x: 13, y: 13 }}>
            <CDNImage src={`icons/npc/17003.png`} />
          </JPanel>
        </JPanel>

        <JPanel size={{ width: 310, height: 84 }} position={{ x: 166, y: 0 }} background="UIResource.Common.BigBG1">
          <MultilineLabel size={{ width: 300, height: 74 }} position={{ x: 5, y: 5 }} text={'SingleTollGate_NextLevelEXP'} />
        </JPanel>

        <JPanel size={{ width: 310, height: 114 }} position={{ x: 166, y: 90 }} background="UIResource.Common.BigBG1">
          <JPanel size={{ width: 300, height: 20 }} position={{ x: 5, y: 5 }} background="UIResource.Common.TextBG1">
            <MultilineLabel
              size={{ width: 170, height: 20 }}
              position={{ x: 3, y: 2 }}
              text={`Current ${info?.current === -1 ? 'Not started' : info.current}`}
            />
            <MultilineLabel
              size={{ width: 110, height: 20 }}
              position={{ x: 180, y: 2 }}
              text={`Next Floor ${info?.current === -1 ? '1' : info.current + 1}`}
            />
          </JPanel>

          <MultilineLabel size={{ width: 90, height: 20 }} position={{ x: 8, y: 26 }} text={'Next'} />
          <MultilineLabel size={{ width: 60, height: 20 }} position={{ x: 95, y: 26 }} text={info.nextExp.toString()} />
          {/* <MultilineLabel size={{ width: 146, height: 20 }} position={{ x: 155, y: 26 }} text={'SGate_NextLevelAddEXP'} /> */}

          <JPanel size={{ width: 299, height: 2 }} position={{ x: 8, y: 48 }} background="UIResource.Common.PartitionYellow" />

          <MultilineLabel size={{ width: 90, height: 20 }} position={{ x: 8, y: 51 }} text={`Current`} />
          <MultilineLabel size={{ width: 60, height: 20 }} position={{ x: 95, y: 51 }} text={info.exp.toString()} />

          <JPanel size={{ width: 299, height: 2 }} position={{ x: 5, y: 73 }} background="UIResource.Common.PartitionYellow" />

          <MultilineLabel size={{ width: 190, height: 20 }} position={{ x: 8, y: 84 }} text={`Lives Left`} />
          <MultilineLabel size={{ width: 190, height: 20 }} position={{ x: 95, y: 84 }} text={info.attemptsLeft.toString()} />
          {/* <MultilineLabel size={{ width: 85, height: 20 }} position={{ x: 215, y: 84 }} text={'SingleTollGate_BuyBrightShadowBotFU'} /> */}
        </JPanel>

        <JPanel size={{ width: 205, height: 35 }} position={{ x: 4, y: 214 }} background="UIResource.Common.SmallBG1">
          <JButton
            size={{ width: 75, height: 22 }}
            position={{ x: 5, y: 6 }}
            text={info.current === -1 ? 'Start' : 'Continue'}
            onClick={() => {
              info.current === -1
                ? toServer('lasNochesStart', null, () => toServer('lasNochesAttempt', null, (data: Info) => setInfo(data)))
                : toServer('lasNochesAttempt', null, (data: Info) => setInfo(data));

              setDisableStart(true);

              setTimeout(() => setDisableStart(false), 2000);
            }}
            disabled={info.attemptsLeft === 0 || disableStart}
          />

          <JButton size={{ width: 75, height: 22 }} position={{ x: 125, y: 6 }} text={'Auto'} disabled />
        </JPanel>

        <JButton
          size={{ width: 75, height: 22 }}
          position={{ x: 300, y: 220 }}
          text={'Claim'}
          onClick={() =>
            toServer('lasNochesClaim', null, () => {
              toServer('lasNochesInfo', null, (data: Info) => setInfo(data));
            })
          }
        />
        <JButton
          size={{ width: 75, height: 22 }}
          position={{ x: 390, y: 220 }}
          text={'Leave'}
          onClick={() => toServer('switchScene', 171)}
        />
      </JPanel>
    </Panel>
  );
};
